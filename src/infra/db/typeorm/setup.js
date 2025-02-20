const { resolve } = require('path');
const typeorm = require('typeorm');

let typeormServer;

if (process.env.NODE_ENV === 'test') {
  typeormServer = new typeorm.DataSource({
    type: 'sqlite',
    database: 'db.sqlite',
    synchronize: true,
    dropSchema: true,
    entities: [resolve(__dirname, 'entities/*.entity-typeorm.js')],
  });
} else if (process.env.NODE_ENV === 'integration') {
  typeormServer = new typeorm.DataSource({
    type: 'postgres',
    host: 'localhost',
    database: 'biblioteca_test',
    synchronize: true,
    username: 'postgres',
    password: '123',
    port: 5432,
    entities: [resolve(__dirname, 'entities/*.entity-typeorm.js')],
  });
}

module.exports = { typeormServer };
