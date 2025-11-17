import { readdirSync } from 'fs';
import { join, extname } from 'path';
import sequelize from 'src/database/index';

const modelsDir = __dirname;

readdirSync(modelsDir)
  .filter(file => file !== 'index.ts' && extname(file) === '.ts')
  .forEach(file => {
    const filePath = join(modelsDir, file).replace(/\\/g, '/'); // fix windows path
    require(filePath);
    console.log(`✅ Model loaded: ${file}`);
  });

export default sequelize;
