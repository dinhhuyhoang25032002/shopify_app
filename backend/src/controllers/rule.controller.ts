import { RuleDto } from 'src/dto/rule.dto'
import {
  handleDeleteRuleById,
  handleGetRuleByName,
  handleCreateRule,
  handleDuplicateRule,
  handleGetRules,
  handleUpdateRuleById,
  handleGetRulesBySearch
} from 'src/services/rule.service'
import { Context } from 'koa'
import { PayLoadJWT } from '@/types'
export const createRule = async (ctx: Context) => {
  try {
    const body = ctx.request.body as any as RuleDto
    const user = ctx.state.user as PayLoadJWT
    const result = await handleCreateRule(body, user)
    ctx.status = 201
    ctx.body = result
  } catch (error: any) {
    ctx.status = error.status || 500
    ctx.body = { message: error.message }
  }
}

export const duplicateRule = async (ctx: Context) => {
  try {
    const ruleId = ctx.params.id
    const user = ctx.state.user as PayLoadJWT
    const { url } = user
    const duplicated = await handleDuplicateRule(ruleId, url)

    ctx.status = 201
    ctx.body = duplicated
  } catch (error: any) {
    console.error(error)
    ctx.status = error.status || 500
    ctx.body = { message: error.message }
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
    const user = ctx.state.user as PayLoadJWT
    const { shop } = user
    const rules = await handleGetRulesBySearch(keyword, shop.shop)

    ctx.status = 200
    ctx.body = rules // nếu không tìm thấy, trả về array rỗng
  } catch (error) {
    console.error(error)
    ctx.status = 500
  }
}
export const getRule = async (ctx: Context) => {
  try {
    const id = ctx.params.id
    const user = ctx.state.user as PayLoadJWT
    const { shop } = user
    if (!id) {
      ctx.status = 400
      ctx.body = { message: 'Missing required param.' }
      return
    }

    const rule = await handleGetRuleByName(id, shop.shop)

    if (!rule) {
      ctx.status = 404
      ctx.body = { message: 'Rule not found.' }
      return
    }
    ctx.status = 200
    ctx.body = rule
  } catch (error) {
    console.error(error)
    ctx.status = 500
  }
}
export const getRules = async (ctx: Context) => {
  try {
    const page = Number(ctx.query.index) || 0
    const user = ctx.state.user as PayLoadJWT
    const { shop } = user
    const data = await handleGetRules(page, shop.shop)
    ctx.status = 200
    ctx.body = data
  } catch (error: any) {
    console.error(error)
    ctx.status = error.status || 500
    ctx.body = { message: error.message }
  }
}
export const updateRule = async (ctx: Context) => {
  try {
    const ruleId = ctx.params.id
    const body = ctx.request.body as Partial<RuleDto>
    const user = ctx.state.user as PayLoadJWT

    const success = await handleUpdateRuleById(ruleId, body, user)

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
    const user = ctx.state.user as PayLoadJWT
    const success = await handleDeleteRuleById(ruleId, user)

    if (success) {
      ctx.status = 200
      ctx.body = { message: 'Rule deleted successfully' }
    } else {
      ctx.status = 404
      ctx.body = { message: 'Rule not found' }
    }
  } catch (error: any) {
    console.error(error)
    ctx.status = error.status || 500
    ctx.body = { message: error.message }
  }
}
