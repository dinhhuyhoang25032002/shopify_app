// models/index.js
import { readdirSync } from "fs";
import path, { join, extname } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import sequelize from "../db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// folder current: /models
const modelsDir = __dirname;

// đọc tất cả file trong thư mục models
readdirSync(modelsDir)
  .filter(
    (file) =>
      file !== "index.js" &&
      (extname(file) === ".js" || extname(file) === ".mjs")
  )
  .forEach(async (file) => {
    const filePath = pathToFileURL(join(modelsDir, file)).href; // ✅ convert to file URL
    await import(filePath);
    console.log(`✅ Model loaded: ${file}`);
  });

export default sequelize;
