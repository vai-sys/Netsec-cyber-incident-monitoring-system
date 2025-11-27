// controllers/dashboardController.js - Additional KPIs
const Incident = require('../model/Incident');
const mongoose = require('mongoose');
// 1. Incident Resolution Metrics
exports.resolutionMetrics = async (req, res) => {
  try {
    const range = Number(req.query.range) || 30;
    const end = new Date();
    const start = new Date(); start.setDate(end.getDate() - range + 1);
    
    const [totalIncidents, resolvedIncidents, avgResolutionTime] = await Promise.all([
      Incident.countDocuments({ start_date: { $gte: start, $lte: end } }),
      Incident.countDocuments({ 
        start_date: { $gte: start, $lte: end },
        status: { $in: ['Resolved', 'Closed'] }
      }),
      Incident.aggregate([
        { 
          $match: { 
            start_date: { $gte: start, $lte: end },
            end_date: { $exists: true, $ne: null },
            status: { $in: ['Resolved', 'Closed'] }
          } 
        },
        {
          $project: {
            resolutionTime: {
              $subtract: ['$end_date', '$start_date']
            }
          }
        },
        {
          $group: {
            _id: null,
            avgTime: { $avg: '$resolutionTime' }
          }
        }
      ])
    ]);

    const resolutionRate = totalIncidents > 0 
      ? ((resolvedIncidents / totalIncidents) * 100).toFixed(2) 
      : 0;
    
    const avgDays = avgResolutionTime.length > 0 
      ? (avgResolutionTime[0].avgTime / (1000 * 60 * 60 * 24)).toFixed(1)
      : null;

    return res.json({
      totalIncidents,
      resolvedIncidents,
      resolutionRate: `${resolutionRate}%`,
      avgResolutionDays: avgDays
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// 2. Threat Distribution by Category
exports.categoryDistribution = async (req, res) => {
  try {
    const range = Number(req.query.range) || 30;
    const end = new Date();
    const start = new Date(); start.setDate(end.getDate() - range + 1);

    const distribution = await Incident.aggregate([
      { $match: { start_date: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: {
            category: '$receiver_category',
            subcode: '$receiver_category_subcode'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    return res.json(distribution.map(d => ({
      category: d._id.category || 'Unknown',
      subcode: d._id.subcode || 'N/A',
      count: d.count
    })));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// 3. Incident Velocity (new incidents per day/week)
exports.velocity = async (req, res) => {
  try {
    const range = Number(req.query.range) || 30;
    const end = new Date();
    const start = new Date(); start.setDate(end.getDate() - range + 1);

    const velocity = await Incident.aggregate([
      { $match: { start_date: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$start_date" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const totalDays = velocity.length;
    const totalIncidents = velocity.reduce((sum, v) => sum + v.count, 0);
    const avgPerDay = totalDays > 0 ? (totalIncidents / totalDays).toFixed(2) : 0;

    return res.json({
      dailyVelocity: velocity.map(v => ({ date: v._id, count: v.count })),
      avgIncidentsPerDay: avgPerDay,
      totalDays,
      totalIncidents
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// 4. Active vs Resolved Breakdown
exports.statusBreakdown = async (req, res) => {
  try {
    const breakdown = await Incident.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const total = breakdown.reduce((sum, b) => sum + b.count, 0);
    
    return res.json({
      breakdown: breakdown.map(b => ({
        status: b._id || 'Unknown',
        count: b.count,
        percentage: ((b.count / total) * 100).toFixed(2)
      })),
      total
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// 5. Incident Type Trends
exports.typetrends = async (req, res) => {
  try {
    const range = Number(req.query.range) || 90;
    const end = new Date();
    const start = new Date(); start.setDate(end.getDate() - range + 1);

    const trends = await Incident.aggregate([
      { $match: { start_date: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: {
            type: '$incident_type',
            week: { $dateToString: { format: "%Y-%U", date: "$start_date" } }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.week": 1, count: -1 } }
    ]);

    return res.json(trends.map(t => ({
      incidentType: t._id.type || 'Unknown',
      week: t._id.week,
      count: t.count
    })));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// 6. Top Targeted Organizations
exports.topTargets = async (req, res) => {
  try {
    const range = Number(req.query.range) || 30;
    const limit = Number(req.query.limit) || 10;
    const end = new Date();
    const start = new Date(); start.setDate(end.getDate() - range + 1);

    const targets = await Incident.aggregate([
      { $match: { start_date: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: '$receiver_name',
          count: { $sum: 1 },
          categories: { $addToSet: '$receiver_category' },
          countries: { $addToSet: '$receiver_country' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);

    return res.json(targets.map(t => ({
      organization: t._id || 'Unknown',
      incidentCount: t.count,
      categories: t.categories.filter(Boolean),
      countries: t.countries.filter(Boolean)
    })));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// 7. Incident Duration Analysis
exports.durationAnalysis = async (req, res) => {
  try {
    const range = Number(req.query.range) || 90;
    const end = new Date();
    const start = new Date(); start.setDate(end.getDate() - range + 1);

    const analysis = await Incident.aggregate([
      { 
        $match: { 
          start_date: { $gte: start, $lte: end },
          end_date: { $exists: true, $ne: null }
        } 
      },
      {
        $project: {
          incident_type: 1,
          durationDays: {
            $divide: [
              { $subtract: ['$end_date', '$start_date'] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      },
      {
        $group: {
          _id: '$incident_type',
          avgDuration: { $avg: '$durationDays' },
          minDuration: { $min: '$durationDays' },
          maxDuration: { $max: '$durationDays' },
          count: { $sum: 1 }
        }
      },
      { $sort: { avgDuration: -1 } }
    ]);

    return res.json(analysis.map(a => ({
      incidentType: a._id || 'Unknown',
      avgDurationDays: a.avgDuration.toFixed(1),
      minDurationDays: a.minDuration.toFixed(1),
      maxDurationDays: a.maxDuration.toFixed(1),
      sampleSize: a.count
    })));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// 8. Geographic Heatmap Data
exports.geographicHeatmap = async (req, res) => {
  try {
    const range = Number(req.query.range) || 30;
    const end = new Date();
    const start = new Date(); start.setDate(end.getDate() - range + 1);

    const heatmap = await Incident.aggregate([
      { $match: { start_date: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: '$receiver_country',
          incidentCount: { $sum: 1 },
          types: { $addToSet: '$incident_type' },
          categories: { $addToSet: '$receiver_category' }
        }
      },
      { $sort: { incidentCount: -1 } }
    ]);

    return res.json(heatmap.map(h => ({
      country: h._id || 'Unknown',
      incidentCount: h.incidentCount,
      uniqueTypes: h.types.filter(Boolean).length,
      uniqueCategories: h.categories.filter(Boolean).length
    })));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// 9. Month-over-Month Growth
exports.momGrowth = async (req, res) => {
  try {
    const months = Number(req.query.months) || 6;
    const end = new Date();
    const start = new Date();
    start.setMonth(end.getMonth() - months);

    const growth = await Incident.aggregate([
      { $match: { start_date: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$start_date" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const withGrowth = growth.map((g, i) => {
      if (i === 0) return { month: g._id, count: g.count, growth: null };
      const prevCount = growth[i - 1].count;
      const growthPct = ((g.count - prevCount) / prevCount * 100).toFixed(2);
      return { month: g._id, count: g.count, growth: `${growthPct}%` };
    });

    return res.json(withGrowth);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// 10. Recent Activity Summary
exports.recentActivity = async (req, res) => {
  try {
    const hours = Number(req.query.hours) || 24;
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - hours);

    const [newIncidents, updatedIncidents, resolvedIncidents] = await Promise.all([
      Incident.countDocuments({ added_to_DB: { $gte: cutoff } }),
      Incident.countDocuments({ updated_at: { $gte: cutoff } }),
      Incident.countDocuments({ 
        end_date: { $gte: cutoff },
        status: { $in: ['Resolved', 'Closed'] }
      })
    ]);

    const recentTypes = await Incident.aggregate([
      { $match: { added_to_DB: { $gte: cutoff } } },
      { $group: { _id: '$incident_type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    return res.json({
      timeframe: `Last ${hours} hours`,
      newIncidents,
      updatedIncidents,
      resolvedIncidents,
      topNewTypes: recentTypes.map(t => ({ type: t._id, count: t.count }))
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};