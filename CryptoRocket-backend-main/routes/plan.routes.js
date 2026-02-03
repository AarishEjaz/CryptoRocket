const router = require('express').Router();
const PlanController = require('../controllers/plan.controller');
const { isLoggedIn, isAdminLoggedIn } = require('../middleware/authenticate.middleware');

router.post('/create', isAdminLoggedIn, PlanController.PlanCreate);
router.put('/update/:id', isAdminLoggedIn, PlanController.PlanUpdate);
router.delete('/delete/:id', isAdminLoggedIn, PlanController.PlanDelete);

router.get('/get-admin-reports', isAdminLoggedIn, PlanController.PlansAdminReports);
router.get('/get-plans', isLoggedIn, PlanController.PlansClientReports);

module.exports = router;
