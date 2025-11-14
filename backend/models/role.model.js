import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const RoleModel = sequelize.define("Role", {
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
    status: {
        type: DataTypes.ENUM("Enable", "Disable"),
        defaultValue: "Enable"
    },
    priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    apply: {
        type: DataTypes.ENUM("All,TAGS"),
        defaultValue: "All"
    },
    type: {
        type: DataTypes.ENUM("PERCENTAGE", "FIXED_AMOUNT", "SET_PRICE"),
        allowNull: false,
        defaultValue: "SET_PRICE"
    },
    tags: {
        type: DataTypes.JSON()
    }
});

export default RoleModel