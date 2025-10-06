const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types for now, but you can add restrictions here
    cb(null, true);
  }
});

// Data storage (in production, use a proper database)
let applications = [];
let documents = [];

// File paths for persistent storage
const APPLICATIONS_FILE = 'data/applications.json';
const DOCUMENTS_FILE = 'data/documents.json';

// Ensure data directory exists
if (!fs.existsSync('data')) {
  fs.mkdirSync('data', { recursive: true });
}

// Load data from files
const loadData = () => {
  try {
    // Load applications
    if (fs.existsSync(APPLICATIONS_FILE)) {
      const appsData = fs.readFileSync(APPLICATIONS_FILE, 'utf8');
      applications = JSON.parse(appsData);
      console.log(`Loaded ${applications.length} applications from file`);
    } else {
      console.log('No applications file found, initializing with default data');
      initializeData();
      saveData('applications');
    }
    
    // Load documents
    if (fs.existsSync(DOCUMENTS_FILE)) {
      const docsData = fs.readFileSync(DOCUMENTS_FILE, 'utf8');
      documents = JSON.parse(docsData);
      console.log(`Loaded ${documents.length} documents from file`);
    } else {
      console.log('No documents file found, starting with empty documents array');
      documents = [];
      saveData('documents');
    }
  } catch (error) {
    console.error('Error loading data from files:', error);
    // Initialize with default data if loading fails
    initializeData();
    saveData('all');
  }
};

// Save data to files
const saveData = (type) => {
  try {
    if (type === 'applications' || type === 'all') {
      fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(applications, null, 2));
      console.log('Applications data saved to file');
    }
    if (type === 'documents' || type === 'all') {
      fs.writeFileSync(DOCUMENTS_FILE, JSON.stringify(documents, null, 2));
      console.log('Documents data saved to file');
    }
  } catch (error) {
    console.error('Error saving data to files:', error);
  }
};

// Initialize with comprehensive telecom applications data
const initializeData = () => {
  applications = [
    {
      id: 'U-1001',
      name: 'Customer Relationship Management (CRM)',
      category: 'B2B',
      supportCategory: 'Platinum',
      supportLevel: '24x7',
      owner: 'John Smith',
      supportTeam: 'CRM Support Team',
      serverName: 'crm-prod-01',
      serverConfig: '8 CPU, 32GB RAM, 500GB SSD',
      version: 'v2.4.1',
      lead: 'Sarah Johnson',
      escalationMatrix: 'Level 1: Support Team, Level 2: Technical Lead, Level 3: Engineering Manager',
      vendorContact: 'Oracle Support - support@oracle.com',
      infraSupport: 'Infrastructure Team - infra@company.com',
      architecture: 'Microservices architecture with REST APIs, Oracle Database, Redis Cache',
      functionality: 'Customer data management, lead tracking, sales pipeline, customer support tickets',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1002',
      name: 'Billing and Revenue Management (BRM)',
      category: 'B2C',
      supportCategory: 'Platinum',
      supportLevel: '24x7',
      owner: 'Mike Chen',
      supportTeam: 'Billing Operations Team',
      serverName: 'brm-prod-01',
      serverConfig: '16 CPU, 64GB RAM, 1TB SSD',
      version: 'v3.1.2',
      lead: 'Lisa Wang',
      escalationMatrix: 'Level 1: Billing Support, Level 2: Billing Lead, Level 3: Finance Director',
      vendorContact: 'Amdocs Support - support@amdocs.com',
      infraSupport: 'Database Team - db@company.com',
      architecture: 'Event-driven architecture, Oracle BRM, Apache Kafka, PostgreSQL',
      functionality: 'Invoice generation, payment processing, revenue recognition, customer billing',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1003',
      name: 'Network Management System (NMS)',
      category: 'B2B',
      supportCategory: 'Gold',
      supportLevel: '8x7',
      owner: 'David Rodriguez',
      supportTeam: 'Network Operations Center',
      serverName: 'nms-prod-01',
      serverConfig: '12 CPU, 48GB RAM, 2TB HDD',
      version: 'v4.2.0',
      lead: 'Jennifer Lee',
      escalationMatrix: 'Level 1: NOC Team, Level 2: Network Engineer, Level 3: Network Manager',
      vendorContact: 'Huawei Support - support@huawei.com',
      infraSupport: 'Network Infrastructure Team - netops@company.com',
      architecture: 'SNMP-based monitoring, MySQL database, WebSocket connections',
      functionality: 'Network device monitoring, fault management, performance monitoring, topology visualization',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1004',
      name: 'Service Order Management (SOM)',
      category: 'B2B',
      supportCategory: 'Gold',
      supportLevel: '8x5',
      owner: 'Robert Kim',
      supportTeam: 'Service Delivery Team',
      serverName: 'som-prod-01',
      serverConfig: '8 CPU, 32GB RAM, 500GB SSD',
      version: 'v1.8.3',
      lead: 'Amanda Taylor',
      escalationMatrix: 'Level 1: Service Desk, Level 2: Service Manager, Level 3: Operations Director',
      vendorContact: 'IBM Support - support@ibm.com',
      infraSupport: 'Application Infrastructure Team - appinfra@company.com',
      architecture: 'Service-oriented architecture, IBM WebSphere, Oracle Database',
      functionality: 'Service provisioning, order tracking, workflow management, customer onboarding',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1005',
      name: 'Inventory Management System (IMS)',
      category: 'B2B',
      supportCategory: 'Silver',
      supportLevel: '8x5',
      owner: 'Maria Garcia',
      supportTeam: 'Inventory Control Team',
      serverName: 'ims-prod-01',
      serverConfig: '6 CPU, 24GB RAM, 1TB HDD',
      version: 'v2.1.5',
      lead: 'Kevin Brown',
      escalationMatrix: 'Level 1: Inventory Team, Level 2: Operations Lead, Level 3: Supply Chain Manager',
      vendorContact: 'SAP Support - support@sap.com',
      infraSupport: 'ERP Infrastructure Team - erp@company.com',
      architecture: 'SAP ERP integration, REST APIs, Oracle Database',
      functionality: 'Asset tracking, stock management, procurement, warehouse operations',
      lastUpdated: new Date().toISOString()
    }
  ];
};

// Load data on startup
loadData();

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all applications
app.get('/api/applications', (req, res) => {
  res.json(applications);
});

// Get application by ID
app.get('/api/applications/:id', (req, res) => {
  const app = applications.find(a => a.id === req.params.id);
  if (!app) {
    return res.status(404).json({ error: 'Application not found' });
  }
  res.json(app);
});

// Create new application
app.post('/api/applications', (req, res) => {
  try {
    const newApp = {
      id: `U-${Date.now()}`,
      ...req.body,
      lastUpdated: new Date().toISOString()
    };
    applications.push(newApp);
    saveData('applications');
    res.json(newApp);
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ error: 'Failed to create application' });
  }
});

// Update application
app.put('/api/applications/:id', (req, res) => {
  try {
    const index = applications.findIndex(a => a.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Application not found' });
    }
    applications[index] = { ...applications[index], ...req.body, lastUpdated: new Date().toISOString() };
    saveData('applications');
    res.json(applications[index]);
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// Delete application
app.delete('/api/applications/:id', (req, res) => {
  try {
    const index = applications.findIndex(a => a.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Application not found' });
    }
    applications.splice(index, 1);
    saveData('applications');
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

// Upload document - FIXED VERSION
app.post('/api/upload', upload.single('document'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const document = {
      id: uuidv4(),
      filename: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date().toISOString(),
      applicationId: req.body.applicationId || null,
      description: req.body.description || '',
      category: req.body.category || 'General',
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : []
    };
    
    documents.push(document);
    saveData('documents'); // Save to file immediately
    
    console.log(`Document uploaded successfully: ${document.filename} (ID: ${document.id})`);
    res.json({
      success: true,
      message: 'Document uploaded successfully',
      document: document
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to upload document',
      details: error.message 
    });
  }
});

// Get documents
app.get('/api/documents', (req, res) => {
  res.json(documents);
});

// Get document by ID
app.get('/api/documents/:id', (req, res) => {
  const doc = documents.find(d => d.id === req.params.id);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }
  res.json(doc);
});

// Download document
app.get('/api/documents/:id/download', (req, res) => {
  try {
    const doc = documents.find(d => d.id === req.params.id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Check if file exists
    if (!fs.existsSync(doc.path)) {
      return res.status(404).json({ error: 'File not found on disk' });
    }
    
    res.download(doc.path, doc.filename);
  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).json({ error: 'Failed to download document' });
  }
});

// Delete document
app.delete('/api/documents/:id', (req, res) => {
  try {
    const index = documents.findIndex(d => d.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    const doc = documents[index];
    
    // Delete file from disk
    if (fs.existsSync(doc.path)) {
      fs.unlinkSync(doc.path);
    }
    
    // Remove from documents array
    documents.splice(index, 1);
    saveData('documents');
    
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// Update document metadata
app.put('/api/documents/:id', (req, res) => {
  try {
    const index = documents.findIndex(d => d.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    documents[index] = { 
      ...documents[index], 
      ...req.body, 
      lastUpdated: new Date().toISOString() 
    };
    saveData('documents');
    res.json(documents[index]);
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Failed to update document' });
  }
});

// Search applications
app.get('/api/search', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  const category = req.query.category || '';
  const supportCategory = req.query.supportCategory || '';
  
  let results = applications;
  
  if (query) {
    results = results.filter(app => 
      app.name.toLowerCase().includes(query) ||
      app.owner.toLowerCase().includes(query) ||
      app.functionality.toLowerCase().includes(query)
    );
  }
  
  if (category) {
    results = results.filter(app => app.category === category);
  }
  
  if (supportCategory) {
    results = results.filter(app => app.supportCategory === supportCategory);
  }
  
  res.json(results);
});

// Search documents
app.get('/api/documents/search', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  const category = req.query.category || '';
  const applicationId = req.query.applicationId || '';
  
  let results = documents;
  
  if (query) {
    results = results.filter(doc => 
      doc.filename.toLowerCase().includes(query) ||
      (doc.description && doc.description.toLowerCase().includes(query)) ||
      doc.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  if (category) {
    results = results.filter(doc => doc.category === category);
  }
  
  if (applicationId) {
    results = results.filter(doc => doc.applicationId === applicationId);
  }
  
  res.json(results);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    applications: applications.length,
    documents: documents.length
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

app.listen(PORT, () => {
  console.log(`Soum_Confluence server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the application`);
  console.log(`Data persistence enabled - files saved to: ${path.join(__dirname, 'data')}`);
});