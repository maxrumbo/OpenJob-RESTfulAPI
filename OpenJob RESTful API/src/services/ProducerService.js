const amqp = require('amqplib');

class ProducerService {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    if (!this.connection) {
      const url = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
    }
  }

  async sendMessage(queue, message) {
    if (!this.channel) {
      await this.connect();
    }
    await this.channel.assertQueue(queue, {
      durable: true,
    });
    await this.channel.sendToQueue(queue, Buffer.from(message));
  }
}

module.exports = new ProducerService();