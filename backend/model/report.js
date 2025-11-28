// models/Report.js
const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1000 }
});
const Counter = mongoose.model('Counter', CounterSchema);

const ReportSchema = new mongoose.Schema({
  Reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  Title: { type: String, required: true },
  Description: { type: String, required: true },

  Incident_Type: { type: String, required: true },

  Threat_Level: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    required: true
  },

  Location: { type: String },

  // GEOJSON point for geo queries. Follow MongoDB GeoJSON shape.
  location_point: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      // do not mark required here if it's optional in your app
    }
  },

  Additional_Notes: { type: String },

  // SAFE & UNIQUE
  Report_ID: { type: String, unique: true, index: true },

  // Link to real Incident
  incidentRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incident'
  },

  incidentID_raw: { type: String }, // useful for mapping

  Status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Under Investigation', 'Closed'],
    default: 'Pending'
  },

  Date: { type: Date, default: Date.now }

}, { timestamps: true });

// create 2dsphere index so geo queries work efficiently
ReportSchema.index({ location_point: '2dsphere' });

// SAFE ATOMIC REPORT_ID GENERATOR
// NOTE: use a normal function (not arrow) so `this` refers to the document
ReportSchema.pre('save', async function (next) {
  // Only generate when not present
  if (this.Report_ID) return next();

  try {
    // findOneAndUpdate with upsert is atomic for incrementing the counter
    const counter = await Counter.findOneAndUpdate(
      { _id: 'report' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true } // return the updated document
    );

    // IMPORTANT: use template literal backticks to create the string
    this.Report_ID = `RPT-${counter.seq}`;

    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model('Report', ReportSchema);
