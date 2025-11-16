import { DataTypes, Model } from 'sequelize';
import sequelize from '@/database/index';
import { ShopDto } from '@/dto/shop.dto';

export interface ShopCreationAttributes extends Omit<ShopDto, 'id'> {}
export class ShopModel extends Model<ShopDto, ShopCreationAttributes> implements ShopDto {
  declare id: number;
  declare shop: string;
  declare token: string;
  declare email: string;
  declare first_name: string;
  declare sender_email: string;
  declare status: number;
}

ShopModel.init(
  {
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
    sender_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: 'shops',
  },
);
