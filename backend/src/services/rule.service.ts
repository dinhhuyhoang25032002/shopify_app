import { RuleDto } from 'src/dto/rule.dto'
import { RuleModel } from 'src/models/rule.model'
import util from 'util'
import { Op } from 'sequelize'
import { handleFetchApi } from '@/util/handleFetchApi'
import { ShopModel } from '@/models/shop.model'
export const handleCreateRule = async (body: RuleDto): Promise<RuleDto> => {
  try {
    return RuleModel.create(body, { raw: true })
  } catch (error) {
    throw new Error('Error creating rule.')
  }
}

export const handleDuplicateRule = async (ruleId: string): Promise<RuleDto | null> => {
  const ruleData = await RuleModel.findOne({
    where: { id: ruleId },
    raw: true
  })

  if (!ruleData) {
    return null
  }
  const { id, ...rest } = ruleData
  const duplicatedData = {
    ...rest,
    name: `${rest.name}_copy_${Date.now()}`
  }
  const duplicatedRule = await RuleModel.create(duplicatedData)
  return duplicatedRule.get({ plain: true })
}

export const handleUpdateRuleById = async (ruleId: string, body: Partial<RuleDto>): Promise<boolean> => {
  let tags = body.tags

  const [affectedRows] = await RuleModel.update({ ...body, tags: JSON.stringify(tags) }, { where: { name: ruleId } })

  return affectedRows > 0
}

export const handleDeleteRuleById = async (ruleId: string): Promise<boolean> => {
  const result = await RuleModel.destroy({
    where: { name: ruleId }
  })

  return result > 0 // true nếu xóa được, false nếu không tìm thấy
}

export const handleGetRulesBySearch = async (keyword: string) => {
  if (!keyword) return []

  const rules = await RuleModel.findAll({
    where: {
      name: { [Op.like]: `%${keyword}%` }
    },
    raw: true
  })

  return rules
}

export const handleGetRules = async (page = 0, pageSize = 10) => {
  const [rules, total] = await Promise.all([
    RuleModel.findAll({
      raw: true,
      limit: pageSize,
      offset: page * pageSize,
      order: [['createdAt', 'DESC']]
    }),
    RuleModel.count()
  ])

  return { rules, total }
}

export const handleGetRuleByName = async (name: string) => {
  const rule = await RuleModel.findOne({
    where: { name },
    raw: true
  })

  let ruleParse
  if (rule) {
    ruleParse = { ...rule, tags: rule.tags ? JSON.parse(rule.tags) : [] }
  }

  return ruleParse
}

export const handlePushMetafield = async (url: string) => {
  const domain = new URL(url).hostname

  const [shop, rules] = await Promise.all([
    ShopModel.findOne({ where: { shop: domain }, raw: true }),
    RuleModel.findAll({ raw: true })
  ])

  const rulesList = rules.map((r) => ({
    id: r.id,
    name: r.name,
    status: r.status,
    apply: r.apply,
    type: r.type,
    priority: r.priority,
    tags: r.tags ? JSON.parse(r.tags as string) : []
  }))

  const value = JSON.stringify(rulesList)

  const query = {
    query: `query {
   shop {
      id
    }
}`
  }

  const res = await handleFetchApi({ url, shop }, query)
  const idShop = res.data.shop.id
  const queryPush = {
    query: `mutation CreateAppDataMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafieldsSetInput) {
        metafields {
          id
          namespace
          key
          value
        }
        userErrors {
          field
          message
        }
      }
    }`,
    variables: {
      metafieldsSetInput: [
        {
          namespace: 'rule_list',
          key: 'product_rule',
          type: 'json',
          value: value,
          ownerId: idShop
        }
      ]
    }
  }
  const pushMetaData = await handleFetchApi({ url, shop }, queryPush)

  return pushMetaData.data.metafieldsSet.metafields.length
}
