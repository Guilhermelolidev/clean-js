const { resolve } = require('path');

module.exports = {
  type: '',
  host: '',
  database: '',
  username: '',
  password: '',
  port: 5432,
  synchronize: false,
  entities: [resolve(__dirname, 'entities/*.entity-typeorm.js')],
};
