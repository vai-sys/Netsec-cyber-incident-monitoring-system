const express = require('express');
const {
    createIncident,
    getAllIncidents,
    getIncidentById,
    updateIncident,
    deleteIncident,
    getAdvancedIncidentMap,
    getSectorThreatAnalysis,
    getIncidentTimeline
} = require('../controllers/incidentController');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbacMiddleware');

const router = express.Router();

router.get('/advanced-map', auth, rbac(['admin', 'user']), getAdvancedIncidentMap);
router.get('/sector-threat-analysis', auth, rbac(['admin', 'user']), getSectorThreatAnalysis);
router.get('/advanced-timeline', auth, rbac(['admin', 'user']), getIncidentTimeline);


router.post('/', auth, rbac(['admin', 'user']), createIncident);
router.get('/', auth, rbac(['admin', 'user']), getAllIncidents);


router.get('/:id', auth, rbac(['admin', 'user']), getIncidentById);
router.put('/:id', auth, rbac(['admin']), updateIncident);
router.delete('/:id', auth, rbac(['admin']), deleteIncident);

module.exports = router;