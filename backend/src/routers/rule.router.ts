import {
  createRule,
  deleteRule,
  duplicateRule,
  getRule,
  getRules,
  getRulesBySearch,
  updateRule,
} from '@/controllers/rule.controller';
import { RuleDto } from '@/dto/rule.dto';
import { validateBody } from '@/middleware/validate-payload';
import Router from '@koa/router';
const router = new Router({
  prefix: '/rules',
});

// POST
router.post('/', validateBody(RuleDto), createRule);
router.post('/:id', duplicateRule);

// GET
router.get('/search', getRulesBySearch);
router.get('/:id', getRule);
router.get('/', getRules);

// PATCH
router.patch('/:id', updateRule);

//DELETE
router.delete('/:id', deleteRule);

export default router;
