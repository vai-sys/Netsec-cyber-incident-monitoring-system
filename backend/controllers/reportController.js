const Report = require('../model/report');
const Incident = require('../model/Incident');
const { generatePDF, generateCSV } = require('../util/reportUtils');
const mongoose = require('mongoose');

exports.createReport = async (req, res) => {
  try {
    const {
      title,
      description,
      incidentType,
      severity,
      location,
      additionalNotes
    } = req.body;

    const requiredFields = [
      { field: 'title', message: 'Title is required' },
      { field: 'description', message: 'Description is required' },
      { field: 'incidentType', message: 'Incident Type is required' },
      { field: 'severity', message: 'Severity is required' }
    ];

    for (const { field, message } of requiredFields) {
      if (!req.body[field] || req.body[field].trim() === '') {
        return res.status(400).json({
          message,
          field
        });
      }
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: 'Authentication required'
      });
    }

    const report = new Report({
      Title: title.trim(),
      Description: description.trim(),
      Incident_Type: incidentType,
      Threat_Level: severity,
      Location: (location || '').trim(),
      Additional_Notes: (additionalNotes || '').trim(),
      Reporter: req.user._id,
      Date: new Date()
    });

    try {
      await report.save();

      res.status(201).json({
        message: 'Report created successfully',
        report: {
          id: report._id,
          reportId: report.Report_ID,
          title: report.Title,
          incidentType: report.Incident_Type
        }
      });
    } catch (saveError) {
      console.error('Report Save Error:', saveError);

      if (saveError.name === 'ValidationError') {
        return res.status(400).json({
          message: 'Validation Error',
          errors: Object.values(saveError.errors).map(err => err.message)
        });
      }

      res.status(500).json({
        message: 'Error saving report',
        error: saveError.message
      });
    }
  } catch (error) {
    console.error('Unexpected Report Creation Error:', error);
    res.status(500).json({
      message: 'Unexpected error occurred',
      error: error.message
    });
  }
};

exports.getReportById = async (req, res) => {
  try {
 
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid report ID' });
    }

    const report = await Report.findById(req.params.id)
      .populate('Reporter', 'name email')
      .populate('Incident');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ message: 'Error fetching report', error: error.message });
  }
};

exports.updateReportStatus = async (req, res) => {
  try {
    // Validate report ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid report ID' });
    }

    const { status } = req.body;

    // Validate status
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id, 
      { 
        Status: status,
        updatedAt: new Date() // Add update timestamp
      }, 
      { 
        new: true,
        runValidators: true // Ensure mongoose validators run on update
      }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ message: 'Error updating report', error: error.message });
  }
};

exports.downloadReports = async (req, res) => {
  const { format, reportId } = req.query;

  // Validate format
  if (!format || (format !== 'pdf' && format !== 'csv')) {
    return res.status(400).json({ message: 'Invalid format. Use "pdf" or "csv".' });
  }

  try {
    let query = {};

    // Add optional report ID filter
    if (reportId) {
      if (!mongoose.Types.ObjectId.isValid(reportId)) {
        return res.status(400).json({ message: 'Invalid report ID format' });
      }
      query._id = new mongoose.Types.ObjectId(reportId);
    }

    const reports = await Report.find(query)
      .populate('Reporter', 'name email')
      .populate('Incident', 'Incident_ID Description');

    if (reports.length === 0) {
      return res.status(404).json({ message: 'No reports available for download.' });
    }

    const formattedReports = reports.map(report => ({
      Report_ID: report._id.toString(),
      Incident_Type: report.Incident_Type,
      Location: report.Location,
      Description: report.Description,
      Threat_Level: report.Threat_Level,
      Status: report.Status,
      Date: report.Date,
      Reporter: report.Reporter ? report.Reporter.name : 'N/A',
      Incident_Ref: report.Incident ? report.Incident.Incident_ID : 'N/A'
    }));

    if (format === 'pdf') {
      return generatePDF(formattedReports, res);
    } else {
      return generateCSV(formattedReports, res);
    }

  } catch (err) {
    console.error('Error in downloading reports:', err);
    return res.status(500).json({ 
      message: 'Error generating report', 
      error: err.message 
    });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 9, 
      search = '', 
      incidentType = '', 
      threatLevel = '' 
    } = req.query;

    // Validate page and limit
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    const query = {};
    
    // Build search query
    if (search) {
      query.$or = [
        { Title: { $regex: search, $options: 'i' } },
        { Description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add filters
    if (incidentType) {
      query.Incident_Type = incidentType;
    }
    if (threatLevel) {
      query.Threat_Level = threatLevel;
    }

    const options = {
      page: pageNum,
      limit: limitNum,
      sort: { createdAt: -1 },
      populate: { path: 'Reporter', select: 'name email' }
    };

    const result = await Report.paginate(query, options);

    res.json({
      reports: result.docs,
      currentPage: result.page,
      totalPages: result.totalPages,
      totalReports: result.totalDocs
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Error fetching reports', error: error.message });
  }
};







