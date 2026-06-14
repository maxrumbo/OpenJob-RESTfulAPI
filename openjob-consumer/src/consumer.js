require('dotenv').config({ quiet: true });
const amqp = require('amqplib');
const nodemailer = require('nodemailer');
const { Pool } = require('pg');

const requiredEnv = [
  'PGUSER',
  'PGPASSWORD',
  'PGDATABASE',
  'PGHOST',
  'PGPORT',
  'RABBITMQ_HOST',
  'RABBITMQ_PORT',
  'RABBITMQ_USER',
  'RABBITMQ_PASSWORD',
  'MAIL_HOST',
  'MAIL_PORT',
  'MAIL_USER',
  'MAIL_PASSWORD',
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Environment variable ${key} belum diatur`);
  }
});

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
});

const init = async () => {
  try {
    const url = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();

    const queue = 'export:applications';

    await channel.assertQueue(queue, {
      durable: true,
    });

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    console.log('Menunggu pesan dari antrean RabbitMQ...');

    channel.consume(queue, async (message) => {
      if (!message) {
        return;
      }

      try {
        const { application_id: applicationId } = JSON.parse(message.content.toString());

        if (!applicationId) {
          throw new Error('application_id tidak ditemukan pada payload pesan');
        }

        const result = await pool.query(
          `SELECT
             a.id as application_id,
             a.applied_at,
             u_applicant.name as applicant_name,
             u_applicant.email as applicant_email,
             j.title as job_title,
             c.name as company_name,
             u_owner.email as owner_email
           FROM applications a
           JOIN users u_applicant ON a.user_id = u_applicant.id
           JOIN jobs j ON a.job_id = j.id
           JOIN companies c ON j.company_id = c.id
           LEFT JOIN users u_owner ON j.created_by = u_owner.id
           WHERE a.id = $1`,
          [applicationId],
        );

        if (result.rowCount === 0) {
          console.warn(`Lamaran dengan id ${applicationId} tidak ditemukan`);
          channel.ack(message);
          return;
        }

        const data = result.rows[0];

        if (!data.owner_email) {
          console.warn(`Perusahaan pada lamaran ${applicationId} tidak memiliki email owner`);
          channel.ack(message);
          return;
        }

        const info = await transporter.sendMail({
          from: '"OpenJob Notifier" <no-reply@openjob.com>',
          to: data.owner_email,
          subject: `Lamaran Baru untuk Posisi ${data.job_title}`,
          text: `Halo, ada kandidat baru yang melamar untuk posisi ${data.job_title} di perusahaan ${data.company_name}.\n\nDetail Pelamar:\nNama: ${data.applicant_name}\nEmail: ${data.applicant_email}\nTanggal Lamaran: ${data.applied_at}`,
          html: `<p>Halo, ada kandidat baru yang melamar untuk posisi ${data.job_title} di perusahaan ${data.company_name}.</p><br/><p>Detail Pelamar:</p><p>Nama: ${data.applicant_name}</p><p>Email: ${data.applicant_email}</p><p>Tanggal Lamaran: ${data.applied_at}</p>`,
        });

        console.log('Email sent: %s', info.messageId);
        channel.ack(message);
      } catch (error) {
        console.error('Gagal memproses pesan:', error);
        channel.nack(message, false, false);
      }
    });
  } catch (error) {
    console.error('Koneksi ke RabbitMQ gagal:', error);
  }
};

if (require.main === module) {
  init();
}

module.exports = {
  init,
};
