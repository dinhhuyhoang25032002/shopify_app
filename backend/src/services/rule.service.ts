import { RuleDto } from 'src/dto/rule.dto'
import { RuleModel } from 'src/models/rule.model'
import { Op } from 'sequelize'
import { handlePushMetafield } from '@/util/pushMetafield'

export const handleCreateRule = async (body: RuleDto, url: string): Promise<RuleDto> => {
  try {
    console.log('url', url, body)

    const newRule = await RuleModel.create({ ...body, tags: JSON.stringify(body.tags) }, { raw: true })
    // await handlePushMetafield(url)
    return newRule
  } catch (error) {
    console.log(error)
    throw error
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
