import {
  createRule,
  deleteRule,
  duplicateRule,
  getRule,
  getRules,
  getRulesBySearch,
  pushMetafield,
  // getRulesByTags,
  updateRule
} from '@/controllers/rule.controller'

import Router from '@koa/router'
const router = new Router({
  prefix: '/rules'
})

// POST
router.post('/', createRule)
router.post('/metafield', pushMetafield)
router.post('/:id', duplicateRule)

// GET
router.get('/', getRules)
router.get('/search', getRulesBySearch)
// router.get('/tags', getRulesByTags)
router.get('/:id', getRule)

// PATCH
router.patch('/:id', updateRule)

//DELETE
router.delete('/:id', deleteRule)

export default router
