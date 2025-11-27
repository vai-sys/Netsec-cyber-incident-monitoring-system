const Incident = require('../model/Incident');
const mongoose = require('mongoose');

const createError = require('http-errors');



// exports.createIncident = async (req, res) => {
//   try {
  
//     const lastIncident = await Incident.findOne().sort({ createdAt: -1 });
//     const newIncidentId = lastIncident 
//       ? `INC-${parseInt(lastIncident.Incident_ID.split('-')[1]) + 1}`
//       : 'INC-1000';

//     const newIncident = new Incident({
//       ...req.body,
//       Incident_ID: newIncidentId
//     });

//     await newIncident.save();
//     res.status(201).json(newIncident);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating incident', error: error.message });
//   }
// };

exports.createIncident = async (req, res) => {
  try {
    // Find the last inserted incident based on createdAt timestamp
    const lastIncident = await Incident.findOne().sort({ createdAt: -1 });

    let newIncidentId = "INC-1000"; // default starting ID

    if (lastIncident && lastIncident.Incident_ID) {
      const parts = lastIncident.Incident_ID.split("-");
      const lastNum = parseInt(parts[1]);
      newIncidentId = `INC-${lastNum + 1}`;
    }

    // Create new incident object
    const newIncident = new Incident({
      ...req.body,
      Incident_ID: newIncidentId
    });

    await newIncident.save();

    return res.status(201).json({
      message: "Incident created successfully",
      data: newIncident
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error creating incident",
      error: error.message
    });
  }
};


exports.getAllIncidents = async (req, res) => {
  try {
    const {
      search,
      receiver_country,
      receiver_category,
      incident_type,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = req.query;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { receiver_name: { $regex: search, $options: 'i' } },
        { receiver_country: { $regex: search, $options: 'i' } },
        { incident_type: { $regex: search, $options: 'i' } }
      ];
    }

    if (receiver_country) filter.receiver_country = receiver_country;
    if (receiver_category) filter.receiver_category = receiver_category;
    if (incident_type) filter.incident_type = incident_type;
    if (status) filter.status = status;

    if (startDate || endDate) {
      const dateFilter = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
      // apply to start_date field if you want incidents that begin within range
      filter.start_date = dateFilter;
    }

    const totalIncidents = await Incident.countDocuments(filter);
    const incidents = await Incident.find(filter)
      .sort({ start_date: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    return res.json({
      incidents,
      currentPage: pageNum,
      totalPages: Math.ceil(totalIncidents / limitNum),
      totalIncidents
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching incidents', error: error.message });
  }
};


exports.getIncidentById = async (req, res) => {
  try {
   
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid incident ID format' });
    }

    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    res.json(incident);
  } catch (error) {
    console.error('Error fetching incident:', error);
    res.status(500).json({ 
      message: 'Error fetching incident', 
      error: error.message 
    });
  }
};

exports.updateIncident = async (req, res) => {
  try {
    
    const updateFields = {
      Platform: req.body.Platform,
      Sector: req.body.Sector,
      Incident_Type: req.body.Incident_Type,
      Threat_Level: req.body.Threat_Level,
      Location: req.body.Location,
      Description: req.body.Description,
      Incident_Solved: req.body.Incident_Solved,
      Source: req.body.Source,
      Summary: req.body.Summary,
      Coordinates: req.body.Coordinates
    };

    const updatedIncident = await Incident.findByIdAndUpdate(
      req.params.id, 
      { $set: updateFields }, 
      { new: true, runValidators: true }
    );

    if (!updatedIncident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.json(updatedIncident);
  } catch (error) {
    res.status(500).json({ message: 'Error updating incident', error: error.message });
  }
};

exports.deleteIncident = async (req, res) => {
  try {
    const deletedIncident = await Incident.findByIdAndDelete(req.params.id);

    if (!deletedIncident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.json({ message: 'Incident deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting incident', error: error.message });
  }
};

exports.getAdvancedIncidentMap = async (req, res) => {
  try {
    const incidents = await Incident.aggregate([
      {
        $group: {
          _id: {
            sector: '$Sector',
            threatLevel: '$Threat_Level'
          },
          incidents: {
            $push: {
              id: '$_id',
              location: '$Location',
              coordinates: '$Coordinates',
              description: '$Description',
              date: '$Date'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          sector: '$_id.sector',
          threatLevel: '$_id.threatLevel',
          incidents: 1,
          count: 1,
          _id: 0
        }
      }
    ]);

   
    if (incidents.length === 0) {
      return res.status(404).json({ message: 'No incidents found' });
    }

    res.json(incidents);
  } catch (error) {
    console.error('Advanced Map Error:', error);
    res.status(500).json({ 
      message: 'Error fetching advanced map data', 
      error: error.message 
    });
  }
};


exports.getSectorThreatAnalysis = async (req, res, next) => {
  try {
    const sectorThreatCorrelation = await Incident.aggregate([
      {
        $group: {
          _id: '$Sector',
          totalIncidents: { $sum: 1 },
          unsolvedIncidents: {
            $sum: { $cond: [{ $eq: ['$Incident_Solved', false] }, 1, 0] }
          },
          threatData: {
            $push: {
              level: '$Threat_Level',
              totalLevelIncidents: { $sum: 1 }
            }
          }
        }
      },
      {
        $project: {
          sector: '$_id',
          totalSectorIncidents: '$totalIncidents',
          totalUnsolvedIncidents: '$unsolvedIncidents',
          threatData: '$threatData',
          correlationIndex: { 
            $cond: [
              { $gt: ['$totalIncidents', 0] },
              { $divide: ['$unsolvedIncidents', '$totalIncidents'] },
              0
            ]
          }
        }
      },
      { $sort: { totalSectorIncidents: -1 } }
    ]);

    if (sectorThreatCorrelation.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No incidents found'
      });
    }

    res.json({
      success: true,
      count: sectorThreatCorrelation.length,
      data: sectorThreatCorrelation
    });
  } catch (error) {
    console.error('Sector Threat Analysis Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving sector threat analysis',
      error: error.message
    });
  }
};

exports.getIncidentTimeline = async (req, res, next) => {   
  try {         
    const {
      startDate,
      endDate,
      threatLevel,
      sector,
      incidentType
    } = req.query;

    const query = {};

    if (startDate && endDate) {
      query.Date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (threatLevel) {
      query.Threat_Level = threatLevel;
    }

    if (sector) {
      query.Sector = sector;
    }

    if (incidentType) {
      query.Incident_Type = incidentType;
    }

    const timeline = await Incident.find(query)
      .select('Incident_ID Date Sector Incident_Type Threat_Level Location Description Incident_Solved Coordinates')
      .sort({ Date: -1 })
      .lean();

    const timelineMetrics = {
      totalIncidents: timeline.length,
      threatLevelBreakdown: {},
      sectorBreakdown: {},
      solvedStatus: {
        solved: timeline.filter(incident => incident.Incident_Solved).length,
        unsolved: timeline.filter(incident => !incident.Incident_Solved).length
      }
    };

    timeline.forEach(incident => {
      // Threat Level Breakdown
      if (!timelineMetrics.threatLevelBreakdown[incident.Threat_Level]) {
        timelineMetrics.threatLevelBreakdown[incident.Threat_Level] = 0;
      }
      timelineMetrics.threatLevelBreakdown[incident.Threat_Level]++;

      // Sector Breakdown
      if (!timelineMetrics.sectorBreakdown[incident.Sector]) {
        timelineMetrics.sectorBreakdown[incident.Sector] = 0;
      }
      timelineMetrics.sectorBreakdown[incident.Sector]++;
    });

    res.json({
      success: true,
      metrics: timelineMetrics,
      timeline
    });
  } catch (error) {
    next(createError(500, 'Error retrieving incident timeline'));
  } 
};



exports.getIncidentTimeline = async (req, res, next) => {
  try {
   
    const { 
      startDate, 
      endDate, 
      threatLevel, 
      sector, 
      incidentType 
    } = req.query;

   
    const query = {};
    
    if (startDate && endDate) {
      query.Date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (threatLevel) {
      query.Threat_Level = threatLevel;
    }
    
    if (sector) {
      query.Sector = sector;
    }
    
    if (incidentType) {
      query.Incident_Type = incidentType;
    }

   
    const timeline = await Incident.find(query)
      .select('Incident_ID Date Sector Incident_Type Threat_Level Location Description Incident_Solved Coordinates')
      .sort({ Date: -1 })
      .lean();

   
    const timelineMetrics = {
      totalIncidents: timeline.length,
      threatLevelBreakdown: {},
      solvedStatus: {
        solved: timeline.filter(incident => incident.Incident_Solved).length,
        unsolved: timeline.filter(incident => !incident.Incident_Solved).length
      }
    };

    timeline.forEach(incident => {
      if (!timelineMetrics.threatLevelBreakdown[incident.Threat_Level]) {
        timelineMetrics.threatLevelBreakdown[incident.Threat_Level] = 0;
      }
      timelineMetrics.threatLevelBreakdown[incident.Threat_Level]++;
    });

    res.json({
      success: true,
      metrics: timelineMetrics,
      timeline
    });
  } catch (error) {
    next(createError(500, 'Error retrieving incident timeline'));
  }
};
