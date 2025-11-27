const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const incidentRoutes = require('./routes/incidentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


  app.get('/api/kibana/dashboard', async (req, res) => {
    try {
      const kibanaUrl = 'http://localhost:5601'; 
      const dashboardId = req.query.id; 
      const apiKey = 'SkkyZnVwTUJtYUVRRy1qclNvWWM6S3RpMkdidzJRZGV1STF1Ui16SXdPZw==';
  
      const response = await axios.get(`${kibanaUrl}/api/saved_objects/dashboard/${dashboardId}`, {
        headers: {
          Authorization: `ApiKey ${apiKey}`,
          'kbn-xsrf': 'true', 
        },
      });
  
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching Kibana dashboard:', error.message);
      res.status(500).json({ error: 'Failed to fetch Kibana dashboard' });
    }
  });

app.use('/api/incidents', incidentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
