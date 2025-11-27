const fs = require('fs');
const PDFDocument = require('pdfkit');
const { parse } = require('json2csv');

const generatePDF = async (reportData, res) => {
  try {

    if (!reportData || !Array.isArray(reportData) || reportData.length === 0) {
      return res.status(400).json({ message: 'No report data available' });
    }

    const doc = new PDFDocument();

   
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=incident_report.pdf');

    
    doc.pipe(res);


    doc.fontSize(20).font('Helvetica-Bold').text('Incident Reports', { 
      align: 'center',
      underline: true 
    });
    doc.moveDown(1.5);

 
    doc.fontSize(12).font('Helvetica');

   
    reportData.forEach((report, index) => {
      
      doc.font('Helvetica-Bold').fontSize(14).text(`Report #${index + 1}`, { 
        underline: true 
      });
      doc.font('Helvetica').fontSize(12).moveDown(0.5);

      
      const fields = [
        { label: 'Report ID', value: report.Report_ID || 'N/A' },
        { label: 'Incident Type', value: report.Incident_Type || 'N/A' },
        { label: 'Location', value: report.Location || 'N/A' },
        { label: 'Description', value: report.Description || 'N/A' },
        { label: 'Threat Level', value: report.Threat_Level || 'N/A' },
        { label: 'Status', value: report.Status || 'N/A' },
        { label: 'Date', value: report.Date ? new Date(report.Date).toLocaleString() : 'N/A' }
      ];

      
      fields.forEach(field => {
        doc.text(`${field.label}: ${field.value}`);
      });

      
      doc.moveDown(1.5);
    });

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ 
      message: 'Error generating PDF report', 
      error: error.message 
    });
  }
};

// Generate CSV Report
const generateCSV = (reportData, res) => {
  try {
  
    if (!reportData || !Array.isArray(reportData) || reportData.length === 0) {
      return res.status(400).json({ message: 'No report data available' });
    }

    
    const fields = [
      'Report_ID', 
      'Incident_Type', 
      'Location', 
      'Description', 
      'Threat_Level', 
      'Status', 
      'Date'
    ];

    
    const csvData = parse(reportData, { fields });

    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=incident_report.csv');
    
    // Send CSV data
    res.send(csvData);

  } catch (error) {
    console.error('CSV Generation Error:', error);
    res.status(500).json({ 
      message: 'Error generating CSV report', 
      error: error.message 
    });
  }
};

module.exports = { generatePDF, generateCSV };



