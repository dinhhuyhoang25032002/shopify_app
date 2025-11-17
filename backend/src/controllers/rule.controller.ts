import { RuleDto } from 'src/dto/rule.dto'
import {
  handleDeleteRuleById,
  handleGetRuleByName,
  handleCreateRule,
  handleDuplicateRule,
  handleGetRules,
  handleUpdateRuleById,
  handleGetRulesBySearch,
  handleGetRulesByTags
} from 'src/services/rule.service'
import { Context } from 'koa'
export const createRule = async (ctx: Context) => {
  try {
    const body = ctx.request.body as any as RuleDto
    const result = await handleCreateRule(body)
    ctx.status = 201
    ctx.body = result
  } catch (error) {
    ctx.status = 500
    console.log(error)
  }
}

export const duplicateRule = async (ctx: Context) => {
  try {
    const ruleId = ctx.params.id
    const duplicated = await handleDuplicateRule(ruleId)
    if (!duplicated) {
      ctx.status = 404
      ctx.body = { message: 'Rule not found' }
      return
    }

    ctx.status = 201
    ctx.body = duplicated
  } catch (error) {
    console.error(error)
    ctx.status = 500
  }
}

export const getRulesBySearch = async (ctx: Context) => {
  try {
    const keyword = (ctx.query.name as string)?.trim()

    if (!keyword) {
      ctx.status = 400
      ctx.body = { message: 'Missing search keyword' }
      return
    }

    const rules = await handleGetRulesBySearch(keyword)

    ctx.status = 200
    ctx.body = rules // nếu không tìm thấy, trả về array rỗng
  } catch (error) {
    console.error(error)
    ctx.status = 500
  }
}
export const getRule = async (ctx: Context) => {
  try {
    const name = ctx.params.id

    if (!name) {
      ctx.status = 400
      ctx.body = { message: 'Missing required param.' }
      return
    }

    const rule = await handleGetRuleByName(name)

    if (!rule) {
      ctx.status = 404
      ctx.body = 'Rule not found.'
      return
    }
    ctx.status = 200
    ctx.body = rule
  } catch (error) {
    console.error(error)
    ctx.status = 500
    ctx.body = 'Server error.'
  }
}
export const getRules = async (ctx: Context) => {
  try {
    const page = Number(ctx.query.index) || 0

    const data = await handleGetRules(page)

    ctx.status = 200
    ctx.body = data
  } catch (error) {
    console.error(error)
    ctx.status = 500
    ctx.body = 'Error fetching rules'
  }
}
export const updateRule = async (ctx: Context) => {
  try {
    const ruleId = ctx.params.id
    const body = ctx.request.body as Partial<RuleDto>
    console.log('body', body)

    const success = await handleUpdateRuleById(ruleId, body)

    if (success) {
      ctx.status = 200
      ctx.body = { message: 'Rule updated successfully' }
    } else {
      ctx.status = 404
      ctx.body = { message: 'Rule not found or no changes' }
    }
  } catch (error) {
    console.error(error)
    ctx.status = 500
  }
}
export const deleteRule = async (ctx: Context) => {
  try {
    const ruleId = ctx.params.id
    const success = await handleDeleteRuleById(ruleId)

    if (success) {
      ctx.status = 200
      ctx.body = 'Rule deleted successfully'
    } else {
      ctx.status = 404
      ctx.body = 'Rule not found'
    }
  } catch (error) {
    console.error(error)
    ctx.status = 500
    ctx.body = 'Error deleting rule'
  }
}

export const getRulesByTags = async (ctx: Context) => {
  try {
    const tags = ctx.query.tag
    const result = await handleGetRulesByTags(tags)
    if (result) {
      ctx.status = 200
      ctx.body = { message: 'rule access.' }
      return
    }
    ctx.status = 200
    ctx.body = { message: 'rule not access.' }
  } catch (error) {
    ctx.status = 500
    console.log(error)
  }
}
