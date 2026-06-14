require('dotenv').config();

const app = require('./app');

const host = process.env.HOST;
const port = process.env.PORT;

app.listen(port, host, () => {
  console.log(`OpenJob API berjalan pada http://${host}:${port}`);
});
