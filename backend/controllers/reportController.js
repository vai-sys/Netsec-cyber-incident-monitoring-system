const Report = require('../model/report');
const Incident = require('../model/Incident');
const { generatePDF, generateCSV } = require('../util/reportUtils');
const mongoose = require('mongoose');

// CREATE REPORT
exports.createReport = async (req, res) => {
  try {
    const {
      title,
      description,
      incidentType,
      severity,
      location,
      additionalNotes,
      incidentRef,
      incidentID_raw,
      latitude,
      longitude
    } = req.body;

    const requiredFields = [
      { field: 'title', message: 'Title is required' },
      { field: 'description', message: 'Description is required' },
      { field: 'incidentType', message: 'Incident Type is required' },
      { field: 'severity', message: 'Severity is required' }
    ];

    for (const { field, message } of requiredFields) {
      if (!req.body[field] || req.body[field].trim() === '') {
        return res.status(400).json({ message, field });
      }
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const report = new Report({
      Title: title.trim(),
      Description: description.trim(),
      Incident_Type: incidentType,
      Threat_Level: severity,
      Location: (location || '').trim(),
      Additional_Notes: (additionalNotes || '').trim(),

      Reporter: req.user._id,
      Date: new Date(),

      // NEW FIELDS
      incidentRef: incidentRef || null,
      incidentID_raw: incidentID_raw || null
    });

    // OPTIONAL GEO SUPPORT
    if (longitude && latitude) {
      report.location_point = {
        type: 'Point',
        coordinates: [Number(longitude), Number(latitude)]
      };
    }

    await report.save();

    return res.status(201).json({
      message: 'Report created successfully',
      report: {
        id: report._id,
        reportId: report.Report_ID,
        title: report.Title,
        incidentType: report.Incident_Type
      }
    });

  } catch (error) {
    console.error('Unexpected Report Creation Error:', error);
    res.status(500).json({ message: 'Unexpected error occurred', error: error.message });
  }
};

// GET REPORT BY ID
exports.getReportById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid report ID' });
    }

    const report = await Report.findById(req.params.id)
      .populate('Reporter', 'name email')
      .populate('incidentRef');   // FIXED POPULATION

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(report);

  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ message: 'Error fetching report', error: error.message });
  }
};

// UPDATE REPORT STATUS
exports.updateReportStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid report ID' });
    }

    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { Status: status, updatedAt: new Date() },
      { new: true, runValidators: true }
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

// DOWNLOAD REPORTS (CSV / PDF)
exports.downloadReports = async (req, res) => {
  const { format, reportId } = req.query;

  if (!format || (format !== 'pdf' && format !== 'csv')) {
    return res.status(400).json({ message: 'Invalid format. Use "pdf" or "csv".' });
  }

  try {
    let query = {};

    if (reportId) {
      if (!mongoose.Types.ObjectId.isValid(reportId)) {
        return res.status(400).json({ message: 'Invalid report ID format' });
      }
      query._id = new mongoose.Types.ObjectId(reportId);
    }

    const reports = await Report.find(query)
      .populate('Reporter', 'name email')
      .populate('incidentRef', 'Incident_ID Description');

    if (reports.length === 0) {
      return res.status(404).json({ message: 'No reports available for download.' });
    }

    const formattedReports = reports.map(r => ({
      Report_ID: r.Report_ID,
      Incident_Type: r.Incident_Type,
      Location: r.Location,
      Description: r.Description,
      Threat_Level: r.Threat_Level,
      Status: r.Status,
      Date: r.Date,
      Reporter: r.Reporter ? r.Reporter.name : 'N/A',
      Incident_Ref: r.incidentRef ? r.incidentRef.Incident_ID : 'N/A'
    }));

    if (format === 'pdf') return generatePDF(formattedReports, res);
    if (format === 'csv') return generateCSV(formattedReports, res);

  } catch (err) {
    console.error('Error in downloading reports:', err);
    return res.status(500).json({ message: 'Error generating report', error: err.message });
  }
};

// GET ALL REPORTS WITH PAGINATION + SEARCH
// controllers/reportController.js
exports.getAllReports = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      search = '',
      incidentType = '',
      threatLevel = ''
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    if (search) {
      query.$or = [
        { Title: { $regex: search, $options: 'i' } },
        { Description: { $regex: search, $options: 'i' } }
      ];
    }

    if (incidentType) query.Incident_Type = incidentType;
    if (threatLevel) query.Threat_Level = threatLevel;

    // total count for pagination
    const totalReports = await Report.countDocuments(query);

    // fetch paginated docs
    const docs = await Report.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('Reporter', 'name email')
      .lean();

    const totalPages = Math.ceil(totalReports / limitNum) || 1;

    return res.json({
      reports: docs,
      currentPage: pageNum,
      totalPages,
      totalReports
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return res.status(500).json({ message: 'Error fetching reports', error: error.message });
  }
};