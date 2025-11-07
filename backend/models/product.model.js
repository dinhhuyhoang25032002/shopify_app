import { DataTypes } from "sequelize";
import sequelize from "../db.js";
const ProductModel = sequelize.define("Product", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    _idProduct: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
});
export default ProductModel;