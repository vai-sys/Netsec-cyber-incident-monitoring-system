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
const {resolutionMetrics , velocity ,statusBreakdown ,categoryDistribution,typetrends,durationAnalysis,geographicHeatmap ,momGrowth,recentActivity,topTargets} =require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbacMiddleware');

const router = express.Router();

// router.get('/advanced-map', auth, rbac(['admin', 'user']), getAdvancedIncidentMap);
// router.get('/sector-threat-analysis', auth, rbac(['admin', 'user']), getSectorThreatAnalysis);
// router.get('/advanced-timeline', auth, rbac(['admin', 'user']), getIncidentTimeline);


router.get('/kpi/resolution', resolutionMetrics);
router.get('/kpi/velocity',velocity);
router.get('/kpi/status', statusBreakdown);
router.get('/kpi/categories', categoryDistribution);
router.get('/kpi/trends/types',typetrends);
router.get('/kpi/targets',topTargets);
router.get('/kpi/duration', durationAnalysis);
router.get('/kpi/heatmap', geographicHeatmap);
router.get('/kpi/growth', momGrowth);
router.get('/kpi/recent', recentActivity);


router.post('/', auth, rbac(['admin', 'user']), createIncident);
router.get('/', auth, rbac(['admin', 'user']), getAllIncidents);


router.get('/:id', auth, rbac(['admin', 'user']), getIncidentById);
router.put('/:id', auth, rbac(['admin']), updateIncident);
router.delete('/:id', auth, rbac(['admin']), deleteIncident);

module.exports = router;