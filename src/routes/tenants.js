const { Router } = require('express');
const tenantsController = require('../controllers/tenantsController');

const router = Router();

router.get('/:slug', tenantsController.show);

module.exports = router;
