import { Sequelize } from 'sequelize';
import path from 'path';
import { cwd } from 'process';
const __dirname = path.join(cwd());
const DB_PATH = path.join(__dirname, '..', 'database', 'database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: DB_PATH,
});

export default sequelize;
