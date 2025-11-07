import { DataTypes } from "sequelize";
import sequelize from "../db.js";
const RoleTagModel = sequelize.define("RoleTag", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tag: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});
export default RoleTagModel;