import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const ShopModel = sequelize.define("Shop", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    shop: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sender_email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("install", "uninstall"),
        defaultValue: "install",
    },
});
export default ShopModel
