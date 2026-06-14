const { randomUUID } = require('crypto');

const generateId = (prefix) => `${prefix}-${randomUUID()}`;

module.exports = generateId;
