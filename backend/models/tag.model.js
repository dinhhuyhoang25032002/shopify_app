import { DataTypes } from "sequelize";
import sequelize from "../db.js";
const TagModel = sequelize.define("Tag", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
});
export default TagModel;