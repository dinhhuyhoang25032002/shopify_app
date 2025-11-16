// models/index.js
import { readdirSync } from 'fs';
import { join, extname } from 'path';
import sequelize from '@/database/index';
import { pathToFileURL } from 'url';

// folder current: /models
const modelsDir = __dirname;
// đọc tất cả file trong thư mục models
readdirSync(modelsDir)
  .filter(file => file !== 'index.ts' && extname(file) === '.ts')
  .forEach(async file => {
    const filePath = pathToFileURL(join(modelsDir, file)).href; // ✅ convert to file URL
    await import(filePath);
    console.log(`✅ Model loaded: ${file}`);
  });

export default sequelize;
