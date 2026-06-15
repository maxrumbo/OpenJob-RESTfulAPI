const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const errorHandler = require('./middlewares/errorHandler');
const swaggerSpec = require('./swagger');
const usersRoutes = require('./routes/users');
const authenticationsRoutes = require('./routes/authentications');
const companiesRoutes = require('./routes/companies');
const categoriesRoutes = require('./routes/categories');
const jobsRoutes = require('./routes/jobs');
const profileRoutes = require('./routes/profile');
const applicationsRoutes = require('./routes/applications');
const bookmarksRoutes = require('./routes/bookmarks');
const documentsRoutes = require('./routes/documents');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: '/api-docs/swagger.json',
  },
}));

app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'OpenJob RESTful API',
  });
});

app.use('/users', usersRoutes);
app.use('/authentications', authenticationsRoutes);
app.use('/companies', companiesRoutes);
app.use('/categories', categoriesRoutes);
app.use('/jobs', jobsRoutes);
app.use('/profile', profileRoutes);
app.use('/applications', applicationsRoutes);
app.use('/bookmarks', bookmarksRoutes);
app.use('/documents', documentsRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: 'failed',
    message: 'Endpoint tidak ditemukan',
  });
});

app.use(errorHandler);

module.exports = app;
