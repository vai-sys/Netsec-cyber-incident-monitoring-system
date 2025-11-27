// import.js
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGO_URI = process.env.MONGO_URI ||
  'mongodb+srv://vaishnavit582:1BxjODQucUskfy90@cluster1.sxekl4d.mongodb.net/netsec?retryWrites=true&w=majority';

// file path relative to this script
const file = path.join(__dirname, './final_data_download.json');

// load your model (adjust path if different)
const Incident = require('./model/Incident.js');

function normalizeDoc(raw) {
  // convert { "$oid": "..." } to a real ObjectId instance
  if (raw._id && raw._id.$oid) {
    raw._id = new mongoose.Types.ObjectId(raw._id.$oid);
  }

  // convert date strings to Date objects (if valid)
  ['start_date','end_date','added_to_DB','updated_at'].forEach(k => {
    if (raw[k]) {
      const d = new Date(raw[k]);
      raw[k] = isNaN(d.getTime()) ? undefined : d;
    }
  });

  return raw;
}

async function run() {
  // connect without deprecated options (driver 4.x+ ignores those options)
  await mongoose.connect(MONGO_URI);

  console.log('Connected to MongoDB');

  // Read & parse the file
  const raw = fs.readFileSync(file, 'utf8');
  const docs = JSON.parse(raw);
  console.log('Read', docs.length, 'documents from file');

  // OPTIONAL: drop collection to avoid unique index conflicts
  await mongoose.connection.db.collection('incidents').drop().catch(() => {});

  // Normalize docs (convert $oid and dates)
  const normalized = docs.map(normalizeDoc);

  // Insert in batches so we can continue on errors and see progress
  const BATCH = 200;
  for (let i = 0; i < normalized.length; i += BATCH) {
    const batch = normalized.slice(i, i + BATCH);
    try {
      const res = await Incident.insertMany(batch, { ordered: false });
      console.log(`Inserted batch ${i}-${i + batch.length - 1}: ${res.length}`);
    } catch (err) {
      console.error(`Batch ${i}-${i + batch.length - 1} error:`, err.message);
      if (err.writeErrors) {
        err.writeErrors.forEach(e => {
          console.error('WriteError:', e.errmsg);
        });
      }
    }
  }

  console.log('Import complete');
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Fatal error', err);
  process.exit(1);
});
