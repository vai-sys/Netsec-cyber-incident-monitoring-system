// models/Incident.js
const mongoose = require('mongoose');

const STATUS_TYPES = ['Open', 'Investigating', 'Resolved', 'Closed', 'Unknown'];


const ARRAY_FIELDS = [
  'receiver_country',
  'receiver_category',
  'receiver_category_subcode',
  'sources_url'
];

// Normalize incoming values into arrays of trimmed strings
function normalizeToStringArray(value) {
  if (value == null) return [];
  if (Array.isArray(value)) {
    return value
      .map(v => (v == null ? '' : String(v).trim()))
      .filter(Boolean);
  }
  // single value -> array with one trimmed string
  const s = String(value).trim();
  return s === '' ? [] : [s];
}

const IncidentSchema = new mongoose.Schema({
  // NOTE: no Incident_ID field here — we use MongoDB's _id (ObjectId)
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },

  start_date: { type: Date },
  end_date: { type: Date },

  inclusion_criteria: { type: String, trim: true },

  // single string value (not an array)
  incident_type: { type: String, trim: true, default: 'Unknown' },

  receiver_name: { type: String, trim: true },

  // these remain arrays and are normalized in pre-validate
  receiver_country: { type: [String], default: [] },
  receiver_category: { type: [String], default: [] },
  receiver_category_subcode: { type: [String], default: [] },

  
  sources_attribution: { type: String, trim: true },
  sources_url: { type: [String], default: [] },

  // status with limited allowed values
  status: { type: String, enum: STATUS_TYPES, default: 'Open' }

}, {
  timestamps: { createdAt: 'added_to_DB', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-validate: normalize arrays and ensure incident_type is a single trimmed string
IncidentSchema.pre('validate', function(next) {
  // Normalize array fields
  ARRAY_FIELDS.forEach(field => {
    if (this.isModified(field) || this[field] == null) {
      this[field] = normalizeToStringArray(this[field]);
    }
  });

  // incident_type: if input is array or missing, pick first value or Unknown
  const it = this.incident_type;
  if (Array.isArray(it)) {
    const first = it.map(x => (x == null ? '' : String(x).trim())).find(Boolean);
    this.incident_type = first || 'Unknown';
  } else {
    this.incident_type = (it == null) ? 'Unknown' : String(it).trim() || 'Unknown';
  }

  // status fallback
  if (!this.status || !STATUS_TYPES.includes(this.status)) {
    this.status = 'Open';
  }

  // simple date sanity: clear invalid dates (optional)
  if (this.start_date && isNaN(new Date(this.start_date).getTime())) this.start_date = undefined;
  if (this.end_date && isNaN(new Date(this.end_date).getTime())) this.end_date = undefined;

  next();
});

// // Friendly JSON output: expose id and remove _id and __v
// IncidentSchema.set('toJSON', {
//   virtuals: true,
//   transform: (doc, ret) => {
//     ret.id = ret._id;              // keep ObjectId if you want, or ret._id.toString()
//     delete ret._id;
//     delete ret.__v;
//     return ret;
//   }
// });



module.exports = mongoose.model('Incident', IncidentSchema);
