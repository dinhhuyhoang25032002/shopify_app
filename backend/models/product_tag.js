import { DataTypes } from "sequelize";
import sequelize from "../db.js";
const ProductTagModel = sequelize.define("ProductTag", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tag_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    product_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});
export default ProductTagModel;