const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  Reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  Title: {
    type: String,
    required: [true, 'Title is required']
  },
  Description: {
    type: String,
    required: [true, 'Description is required']
  },
  Incident_Type: {
    type: String,
    required: [true, 'Incident Type is required']
  },
  Threat_Level: {
    type: String,
    required: [true, 'Severity is required']
  },
  Location: {
    type: String
  },
  Additional_Notes: {
    type: String
  },
  Report_ID: {
    type: String,
    unique: true
  },
  Status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Under Investigation', 'Closed'],
    default: 'Pending'
  },
  Date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

ReportSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const lastReport = await this.constructor.findOne().sort({ createdAt: -1 });
      const newReportNumber = lastReport
        ? parseInt(lastReport.Report_ID.split('-')[1]) + 1
        : 1000;
      this.Report_ID = `RPT-${newReportNumber}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Report = mongoose.model('Report', ReportSchema);
module.exports = Report;