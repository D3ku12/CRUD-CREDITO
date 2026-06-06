const { Router } = require('express');
const tenantsController = require('../controllers/tenantsController');
const { requireAuth, requireSuperAdmin } = require('../middleware/auth');

const router = Router();

router.get('/:slug', tenantsController.show);
router.get('/', requireAuth, requireSuperAdmin, tenantsController.list);
router.post('/', requireAuth, requireSuperAdmin, tenantsController.create);
router.put('/:slug', requireAuth, tenantsController.update);
router.delete('/:slug', requireAuth, requireSuperAdmin, tenantsController.remove);

module.exports = router;
