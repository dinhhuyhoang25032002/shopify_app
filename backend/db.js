import { Sequelize } from 'sequelize';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const DB_PATH = join(__dirname,"..", 'database', 'database.sqlite')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: DB_PATH
});
console.log(DB_PATH);

export default sequelize;
