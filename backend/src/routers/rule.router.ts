import {
  createRule,
  deleteRule,
  duplicateRule,
  getRule,
  getRules,
  getRulesBySearch,
  updateRule
} from '@/controllers/rule.controller'

import Router from '@koa/router'
const router = new Router({
  prefix: '/rules'
})

// POST
router.post('/', createRule)

router.post('/duplication/:id', duplicateRule)

// GET
router.get('/', getRules)
router.get('/search', getRulesBySearch)
router.get('/:id', getRule)

// PATCH
router.patch('/:id', updateRule)

//DELETE
router.delete('/:id', deleteRule)

export default router
