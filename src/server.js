require('dotenv').config();

const app = require('./app');

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 5000;

app.listen(port, host, () => {
  console.log(`OpenJob API server running at http://${host}:${port}`);
});
