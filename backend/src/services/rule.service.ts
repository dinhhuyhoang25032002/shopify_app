import { RuleDto } from 'src/dto/rule.dto'
import { RuleModel } from 'src/models/rule.model'
import { Op } from 'sequelize'
import { handlePushMetafield } from '@/util/pushMetafield'
import { PayLoadJWT } from '@/types'
import { AppError } from '@/helper/AppErr'

export const handleCreateRule = async (body: RuleDto, user: PayLoadJWT): Promise<RuleDto> => {
  try {
    const { url, shop } = user
    const { name } = body
    if (!name) {
      throw new AppError('Missing important parameter.', 400)
    }
    const isExistRule = await RuleModel.findOne({
      where: { name: name, shop: shop.shop },
      raw: true
    })
    if (isExistRule) {
      throw new AppError('Rule name already exists', 400)
    }
    const newRule = await RuleModel.create({ ...body, shop: shop.shop, tags: JSON.stringify(body.tags) }, { raw: true })
    await handlePushMetafield(url)
    return newRule
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const handleDuplicateRule = async (ruleId: string, url: string): Promise<RuleDto> => {
  const ruleData = await RuleModel.findOne({
    where: { id: ruleId },
    raw: true
  })

  if (!ruleData) {
    throw new AppError('Rule not exists.', 404)
  }
  const { id, ...rest } = ruleData
  const duplicatedData = {
    ...rest,
    name: `${rest.name}_copy_${Date.now()}`
  }
  const duplicatedRule = await RuleModel.create(duplicatedData)
  await handlePushMetafield(url)
  return duplicatedRule.get({ plain: true })
}

export const handleUpdateRuleById = async (
  ruleId: string,
  body: Partial<RuleDto>,
  user: PayLoadJWT
): Promise<boolean> => {
  let tags = body.tags
  const { url, shop } = user

  const [affectedRows] = await RuleModel.update(
    { ...body, tags: JSON.stringify(tags) },
    { where: { id: ruleId, shop: shop.shop } }
  )
  await handlePushMetafield(url)
  return affectedRows > 0
}

export const handleDeleteRuleById = async (ruleId: string, user: PayLoadJWT): Promise<boolean> => {
  const { url } = user
  const result = await RuleModel.destroy({
    where: { id: ruleId }
  })
  console.log('ruleId', ruleId)
  await handlePushMetafield(url)
  return result > 0
}

export const handleGetRulesBySearch = async (keyword: string, shop: string) => {
  if (!keyword) return []

  const rules = await RuleModel.findAll({
    where: {
      name: { [Op.like]: `%${keyword}%` },
      shop: shop
    },
    raw: true
  })

  return rules
}

export const handleGetRules = async (page = 0, shop: string) => {
  const pageSize = 10
  const [rules, total] = await Promise.all([
    RuleModel.findAll({
      where: { shop: shop },
      raw: true,
      limit: pageSize,
      offset: page * pageSize,
      order: [['createdAt', 'DESC']]
    }),
    RuleModel.count()
  ])

  return { rules, total }
}

export const handleGetRuleByName = async (id: string, shop: string) => {
  const rule = await RuleModel.findOne({
    where: { id, shop },
    raw: true
  })

  let ruleParse
  if (rule) {
    ruleParse = { ...rule, tags: rule.tags ? JSON.parse(rule.tags) : [] }
  }

  return ruleParse
}
