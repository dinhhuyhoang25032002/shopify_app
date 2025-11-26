import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import sequelize from 'src/database/index'
import { APPLY_TYPE, DISCOUNT_TYPE, STATUS_ROLES } from 'src/constants'
import { RuleDto } from 'src/dto/rule.dto'

export interface RuleCreationAttributes extends Omit<RuleDto, 'id'> {}
export class RuleModel
  extends Model<InferAttributes<RuleModel>, InferCreationAttributes<RuleModel>>
  implements RuleCreationAttributes
{
  declare name: string
  declare status: string
  declare priority: number
  declare apply: string
  declare type: string
  declare value: number
  declare tags: string
  declare shop: string
  declare id: CreationOptional<number>
}
RuleModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(...Object.values(STATUS_ROLES)),
      defaultValue: STATUS_ROLES.ENABLE
    },
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    apply: {
      type: DataTypes.ENUM(...Object.values(APPLY_TYPE)),
      defaultValue: APPLY_TYPE.ALL
    },
    type: {
      type: DataTypes.ENUM(...Object.values(DISCOUNT_TYPE)),
      defaultValue: DISCOUNT_TYPE.SET_PRICE
    },
    value: { type: DataTypes.NUMBER, allowNull: false },
    tags: {
      type: DataTypes.TEXT
    },
    shop: { type: DataTypes.STRING, allowNull: false }
  },
  {
    sequelize,
    tableName: 'rules'
  }
)
