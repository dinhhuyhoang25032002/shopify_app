import {
  createRule,
  deleteRule,
  duplicateRule,
  getRule,
  getRules,
  getRulesBySearch,
  updateRule
} from 'src/controllers/rule.controller'
import { RuleDto } from 'src/dto/rule.dto'
import { validateBody } from '@/middleware/validatePayload'
import Router from '@koa/router'
const router = new Router({
  prefix: '/rules'
})

// POST
router.post('/', createRule)
router.post('/:id', duplicateRule)

// GET
router.get('/search', getRulesBySearch)
router.get('/:id', getRule)
router.get('/', getRules)

// PATCH
router.patch('/:id', updateRule)

//DELETE
router.delete('/:id', deleteRule)

export default router
