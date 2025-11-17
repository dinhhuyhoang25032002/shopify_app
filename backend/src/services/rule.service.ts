import { RuleDto } from 'src/dto/rule.dto'
import { RuleModel } from 'src/models/rule.model'
import { Op } from 'sequelize'
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
  console.log('tags', tags)

  const [affectedRows] = await RuleModel.update({ ...body, tags: JSON.stringify(tags) }, { where: { name: ruleId } })

  return affectedRows > 0
}

export const handleDeleteRuleById = async (ruleId: string): Promise<boolean> => {
  const result = await RuleModel.destroy({
    where: { id: ruleId }
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
      offset: page * pageSize
    }),
    RuleModel.count()
  ])

  return { rules, total }
}

export const handleGetRuleByName = async (name: string) => {
  if (!name) return null

  const rule = await RuleModel.findOne({
    where: { name },
    raw: true // trả về plain object
  })

  return rule
}

export const handleGetRulesByTags = async (tags: string | string[] | undefined) => {
  if (!tags) return []

  const tagArray = Array.isArray(tags) ? tags : [tags]
  console.log('tagArray', tagArray)

  const rules = await RuleModel.findAll({
    where: {
      [Op.or]: tagArray.map((tag) => ({
        tags: { [Op.like]: `%${tag}%` } // dùng LIKE tìm trong JSON text
      }))
    },
    raw: true
  })
  return rules.length > 0
}
