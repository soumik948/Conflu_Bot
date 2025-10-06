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

// Initialize with 15 OSS Telecom applications
const initializeData = () => {
  applications = [
    {
      id: 'U-1001',
      name: 'One Probe',
      uNumber: 'U-1001',
      category: 'OSS',
      supportCategory: 'Platinum',
      supportLevel: '24x7',
      owner: 'Alex Thompson',
      supportTeam: 'Network Monitoring Team',
      serverName: 'oneprobe-prod-01, oneprobe-prod-02',
      serverConfig: '16 CPU, 64GB RAM, 2TB SSD',
      version: 'v3.2.1',
      pageVersion: '1.0',
      lead: 'Sarah Johnson',
      escalationMatrix: 'Level 1: NOC Team, Level 2: Network Engineer, Level 3: Network Manager',
      vendorContact: 'Ericsson Support - support@ericsson.com',
      infraSupport: 'Network Infrastructure Team - netops@company.com',
      architecture: 'Distributed probe architecture with centralized data collection, REST APIs, PostgreSQL database',
      functionality: 'Network performance monitoring, real-time data collection, fault detection, performance analytics',
      serverCount: 2,
      serverNames: 'oneprobe-prod-01, oneprobe-prod-02',
      serverConfigs: '16 CPU, 64GB RAM, 2TB SSD each',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1002',
      name: 'TSM (Telecom Service Management)',
      uNumber: 'U-1002',
      category: 'OSS',
      supportCategory: 'Gold',
      supportLevel: '8x7',
      owner: 'Mike Chen',
      supportTeam: 'Service Management Team',
      serverName: 'tsm-prod-01',
      serverConfig: '12 CPU, 48GB RAM, 1TB SSD',
      version: 'v4.1.3',
      pageVersion: '1.0',
      lead: 'Lisa Wang',
      escalationMatrix: 'Level 1: Service Desk, Level 2: Service Manager, Level 3: Operations Director',
      vendorContact: 'IBM Support - support@ibm.com',
      infraSupport: 'Service Infrastructure Team - serviceinfra@company.com',
      architecture: 'Service-oriented architecture, IBM WebSphere, Oracle Database, REST APIs',
      functionality: 'Service provisioning, order management, service lifecycle management, customer onboarding',
      serverCount: 1,
      serverNames: 'tsm-prod-01',
      serverConfigs: '12 CPU, 48GB RAM, 1TB SSD',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1003',
      name: 'Netcool',
      uNumber: 'U-1003',
      category: 'OSS',
      supportCategory: 'Platinum',
      supportLevel: '24x7',
      owner: 'David Rodriguez',
      supportTeam: 'Network Operations Center',
      serverName: 'netcool-prod-01, netcool-prod-02',
      serverConfig: '20 CPU, 80GB RAM, 3TB SSD',
      version: 'v8.1.2',
      pageVersion: '1.0',
      lead: 'Jennifer Lee',
      escalationMatrix: 'Level 1: NOC Team, Level 2: Network Engineer, Level 3: Network Manager',
      vendorContact: 'IBM Support - support@ibm.com',
      infraSupport: 'Network Infrastructure Team - netops@company.com',
      architecture: 'Event-driven architecture, IBM Netcool, PostgreSQL, WebSocket connections',
      functionality: 'Network fault management, alarm correlation, incident management, automated remediation',
      serverCount: 2,
      serverNames: 'netcool-prod-01, netcool-prod-02',
      serverConfigs: '20 CPU, 80GB RAM, 3TB SSD each',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1004',
      name: 'Weathermap',
      uNumber: 'U-1004',
      category: 'OSS',
      supportCategory: 'Silver',
      supportLevel: '8x5',
      owner: 'Robert Kim',
      supportTeam: 'Network Visualization Team',
      serverName: 'weathermap-prod-01',
      serverConfig: '8 CPU, 32GB RAM, 500GB SSD',
      version: 'v2.8.4',
      pageVersion: '1.0',
      lead: 'Amanda Taylor',
      escalationMatrix: 'Level 1: Visualization Team, Level 2: Network Lead, Level 3: Network Manager',
      vendorContact: 'Open Source Community - weathermap@community.org',
      infraSupport: 'Web Infrastructure Team - webinfra@company.com',
      architecture: 'Web-based visualization, PHP, MySQL, JavaScript, SVG rendering',
      functionality: 'Network topology visualization, real-time status display, performance monitoring dashboard',
      serverCount: 1,
      serverNames: 'weathermap-prod-01',
      serverConfigs: '8 CPU, 32GB RAM, 500GB SSD',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1005',
      name: 'Argos',
      uNumber: 'U-1005',
      category: 'OSS',
      supportCategory: 'Gold',
      supportLevel: '8x7',
      owner: 'Maria Garcia',
      supportTeam: 'Performance Analytics Team',
      serverName: 'argos-prod-01, argos-prod-02',
      serverConfig: '16 CPU, 64GB RAM, 2TB SSD',
      version: 'v5.3.1',
      pageVersion: '1.0',
      lead: 'Kevin Brown',
      escalationMatrix: 'Level 1: Analytics Team, Level 2: Performance Lead, Level 3: CTO',
      vendorContact: 'Argos Support - support@argos.com',
      infraSupport: 'Analytics Infrastructure Team - analytics@company.com',
      architecture: 'Big Data architecture, Apache Spark, InfluxDB, Grafana, REST APIs',
      functionality: 'Performance analytics, KPI monitoring, capacity planning, trend analysis, reporting',
      serverCount: 2,
      serverNames: 'argos-prod-01, argos-prod-02',
      serverConfigs: '16 CPU, 64GB RAM, 2TB SSD each',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1006',
      name: 'Sigos',
      uNumber: 'U-1006',
      category: 'OSS',
      supportCategory: 'Gold',
      supportLevel: '8x7',
      owner: 'Alex Thompson',
      supportTeam: 'Signaling Analysis Team',
      serverName: 'sigos-prod-01',
      serverConfig: '14 CPU, 56GB RAM, 1TB SSD',
      version: 'v7.2.3',
      pageVersion: '1.0',
      lead: 'Rachel Green',
      escalationMatrix: 'Level 1: Signaling Team, Level 2: Network Engineer, Level 3: Network Manager',
      vendorContact: 'Sigos Support - support@sigos.com',
      infraSupport: 'Signaling Infrastructure Team - signaling@company.com',
      architecture: 'Signaling analysis platform, SS7 protocol, PostgreSQL, real-time processing',
      functionality: 'SS7 signaling analysis, call trace analysis, fraud detection, network optimization',
      serverCount: 1,
      serverNames: 'sigos-prod-01',
      serverConfigs: '14 CPU, 56GB RAM, 1TB SSD',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1007',
      name: 'Webtelnet',
      uNumber: 'U-1007',
      category: 'OSS',
      supportCategory: 'Silver',
      supportLevel: '8x5',
      owner: 'James Wilson',
      supportTeam: 'Network Access Team',
      serverName: 'webtelnet-prod-01',
      serverConfig: '6 CPU, 24GB RAM, 500GB SSD',
      version: 'v1.4.2',
      pageVersion: '1.0',
      lead: 'Emma Davis',
      escalationMatrix: 'Level 1: Access Team, Level 2: Network Lead, Level 3: Network Manager',
      vendorContact: 'Open Source Community - webtelnet@community.org',
      infraSupport: 'Web Infrastructure Team - webinfra@company.com',
      architecture: 'Web-based terminal access, SSH/Telnet gateway, JavaScript, WebSocket connections',
      functionality: 'Remote device access, terminal emulation, secure network device management',
      serverCount: 1,
      serverNames: 'webtelnet-prod-01',
      serverConfigs: '6 CPU, 24GB RAM, 500GB SSD',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1008',
      name: 'Performance Management',
      uNumber: 'U-1008',
      category: 'OSS',
      supportCategory: 'Platinum',
      supportLevel: '24x7',
      owner: 'Michael Brown',
      supportTeam: 'Performance Management Team',
      serverName: 'perfmgmt-prod-01, perfmgmt-prod-02',
      serverConfig: '18 CPU, 72GB RAM, 2TB SSD',
      version: 'v6.1.4',
      pageVersion: '1.0',
      lead: 'Sophie Martinez',
      escalationMatrix: 'Level 1: Performance Team, Level 2: Analytics Lead, Level 3: CTO',
      vendorContact: 'Huawei Support - support@huawei.com',
      infraSupport: 'Performance Infrastructure Team - perfinfra@company.com',
      architecture: 'Distributed performance monitoring, Apache Kafka, InfluxDB, Grafana, REST APIs',
      functionality: 'Network performance monitoring, KPI collection, SLA management, performance reporting',
      serverCount: 2,
      serverNames: 'perfmgmt-prod-01, perfmgmt-prod-02',
      serverConfigs: '18 CPU, 72GB RAM, 2TB SSD each',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1009',
      name: 'Spectrum',
      uNumber: 'U-1009',
      category: 'OSS',
      supportCategory: 'Gold',
      supportLevel: '8x7',
      owner: 'Jennifer Taylor',
      supportTeam: 'Network Management Team',
      serverName: 'spectrum-prod-01',
      serverConfig: '16 CPU, 64GB RAM, 1TB SSD',
      version: 'v9.2.1',
      pageVersion: '1.0',
      lead: 'Daniel Anderson',
      escalationMatrix: 'Level 1: NMS Team, Level 2: Network Engineer, Level 3: Network Manager',
      vendorContact: 'CA Technologies Support - support@ca.com',
      infraSupport: 'Network Infrastructure Team - netops@company.com',
      architecture: 'SNMP-based network management, Oracle Database, Java EE, REST APIs',
      functionality: 'Network device management, fault management, performance monitoring, topology discovery',
      serverCount: 1,
      serverNames: 'spectrum-prod-01',
      serverConfigs: '16 CPU, 64GB RAM, 1TB SSD',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1010',
      name: 'Mycom',
      uNumber: 'U-1010',
      category: 'OSS',
      supportCategory: 'Gold',
      supportLevel: '8x7',
      owner: 'Christopher Lee',
      supportTeam: 'OSS Analytics Team',
      serverName: 'mycom-prod-01, mycom-prod-02',
      serverConfig: '20 CPU, 80GB RAM, 3TB SSD',
      version: 'v8.4.2',
      pageVersion: '1.0',
      lead: 'Michelle White',
      escalationMatrix: 'Level 1: Analytics Team, Level 2: Performance Lead, Level 3: CTO',
      vendorContact: 'Mycom Support - support@mycom.com',
      infraSupport: 'Analytics Infrastructure Team - analytics@company.com',
      architecture: 'Big Data analytics platform, Apache Spark, Hadoop, PostgreSQL, REST APIs',
      functionality: 'OSS analytics, performance optimization, capacity planning, network intelligence',
      serverCount: 2,
      serverNames: 'mycom-prod-01, mycom-prod-02',
      serverConfigs: '20 CPU, 80GB RAM, 3TB SSD each',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1011',
      name: 'Network Data Lake',
      uNumber: 'U-1011',
      category: 'OSS',
      supportCategory: 'Platinum',
      supportLevel: '24x7',
      owner: 'Robert Johnson',
      supportTeam: 'Data Engineering Team',
      serverName: 'datalake-prod-01, datalake-prod-02, datalake-prod-03',
      serverConfig: '32 CPU, 128GB RAM, 10TB SSD',
      version: 'v4.2.1',
      pageVersion: '1.0',
      lead: 'Amanda Clark',
      escalationMatrix: 'Level 1: Data Team, Level 2: Data Lead, Level 3: CTO',
      vendorContact: 'Cloudera Support - support@cloudera.com',
      infraSupport: 'Data Infrastructure Team - datainfra@company.com',
      architecture: 'Hadoop ecosystem, Apache Spark, Hive, Kafka, PostgreSQL, REST APIs',
      functionality: 'Network data ingestion, storage, processing, analytics, machine learning pipelines',
      serverCount: 3,
      serverNames: 'datalake-prod-01, datalake-prod-02, datalake-prod-03',
      serverConfigs: '32 CPU, 128GB RAM, 10TB SSD each',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1012',
      name: 'Talend',
      uNumber: 'U-1012',
      category: 'OSS',
      supportCategory: 'Gold',
      supportLevel: '8x7',
      owner: 'William Davis',
      supportTeam: 'Data Integration Team',
      serverName: 'talend-prod-01',
      serverConfig: '12 CPU, 48GB RAM, 1TB SSD',
      version: 'v8.0.1',
      pageVersion: '1.0',
      lead: 'Jessica Miller',
      escalationMatrix: 'Level 1: Integration Team, Level 2: Data Lead, Level 3: CTO',
      vendorContact: 'Talend Support - support@talend.com',
      infraSupport: 'Data Infrastructure Team - datainfra@company.com',
      architecture: 'Data integration platform, Java EE, PostgreSQL, REST APIs, ETL processes',
      functionality: 'Data integration, ETL processes, data quality, data transformation, workflow automation',
      serverCount: 1,
      serverNames: 'talend-prod-01',
      serverConfigs: '12 CPU, 48GB RAM, 1TB SSD',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1013',
      name: 'Telecom AI',
      uNumber: 'U-1013',
      category: 'OSS',
      supportCategory: 'Platinum',
      supportLevel: '24x7',
      owner: 'Thomas Wilson',
      supportTeam: 'AI/ML Team',
      serverName: 'telecomai-prod-01, telecomai-prod-02',
      serverConfig: '24 CPU, 96GB RAM, 4TB SSD',
      version: 'v2.1.3',
      pageVersion: '1.0',
      lead: 'Ashley Brown',
      escalationMatrix: 'Level 1: AI Team, Level 2: ML Lead, Level 3: CTO',
      vendorContact: 'TensorFlow Support - support@tensorflow.org',
      infraSupport: 'AI Infrastructure Team - aiinfra@company.com',
      architecture: 'AI/ML platform, TensorFlow, Python, PostgreSQL, REST APIs, GPU acceleration',
      functionality: 'Network anomaly detection, predictive analytics, automated optimization, ML model training',
      serverCount: 2,
      serverNames: 'telecomai-prod-01, telecomai-prod-02',
      serverConfigs: '24 CPU, 96GB RAM, 4TB SSD each',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1014',
      name: 'Probe Master',
      uNumber: 'U-1014',
      category: 'OSS',
      supportCategory: 'Gold',
      supportLevel: '8x7',
      owner: 'Matthew Garcia',
      supportTeam: 'Probe Management Team',
      serverName: 'probemaster-prod-01',
      serverConfig: '14 CPU, 56GB RAM, 1TB SSD',
      version: 'v5.7.2',
      pageVersion: '1.0',
      lead: 'Nicole Martinez',
      escalationMatrix: 'Level 1: Probe Team, Level 2: Network Engineer, Level 3: Network Manager',
      vendorContact: 'Probe Master Support - support@probemaster.com',
      infraSupport: 'Probe Infrastructure Team - probeinfra@company.com',
      architecture: 'Probe management platform, REST APIs, PostgreSQL, real-time monitoring',
      functionality: 'Probe configuration management, data collection orchestration, probe health monitoring',
      serverCount: 1,
      serverNames: 'probemaster-prod-01',
      serverConfigs: '14 CPU, 56GB RAM, 1TB SSD',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1015',
      name: 'Network Monitoring',
      uNumber: 'U-1015',
      category: 'OSS',
      supportCategory: 'Platinum',
      supportLevel: '24x7',
      owner: 'Andrew Rodriguez',
      supportTeam: 'Network Operations Center',
      serverName: 'netmon-prod-01, netmon-prod-02',
      serverConfig: '20 CPU, 80GB RAM, 2TB SSD',
      version: 'v7.3.1',
      pageVersion: '1.0',
      lead: 'Stephanie Lee',
      escalationMatrix: 'Level 1: NOC Team, Level 2: Network Engineer, Level 3: Network Manager',
      vendorContact: 'Zabbix Support - support@zabbix.com',
      infraSupport: 'Network Infrastructure Team - netops@company.com',
      architecture: 'Distributed monitoring system, Zabbix, MySQL, REST APIs, SNMP polling',
      functionality: 'Network device monitoring, service monitoring, alerting, performance tracking',
      serverCount: 2,
      serverNames: 'netmon-prod-01, netmon-prod-02',
      serverConfigs: '20 CPU, 80GB RAM, 2TB SSD each',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1016',
      name: 'GCP Databases',
      uNumber: 'U-1016',
      category: 'OSS',
      supportCategory: 'Gold',
      supportLevel: '8x7',
      owner: 'Kevin Anderson',
      supportTeam: 'Database Management Team',
      serverName: 'gcp-db-cluster-01, gcp-db-cluster-02',
      serverConfig: 'Cloud SQL - 16 vCPU, 64GB RAM, 1TB SSD',
      version: 'v13.2',
      pageVersion: '1.0',
      lead: 'Rachel Thompson',
      escalationMatrix: 'Level 1: DB Team, Level 2: DBA Lead, Level 3: CTO',
      vendorContact: 'Google Cloud Support - support@google.com',
      infraSupport: 'Cloud Infrastructure Team - cloudinfra@company.com',
      architecture: 'Google Cloud SQL, PostgreSQL, automated backups, high availability, REST APIs',
      functionality: 'Database hosting, automated backups, scaling, monitoring, performance optimization',
      serverCount: 2,
      serverNames: 'gcp-db-cluster-01, gcp-db-cluster-02',
      serverConfigs: 'Cloud SQL - 16 vCPU, 64GB RAM, 1TB SSD each',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1017',
      name: 'Concentrator',
      uNumber: 'U-1017',
      category: 'OSS',
      supportCategory: 'Silver',
      supportLevel: '8x5',
      owner: 'Brian White',
      supportTeam: 'Data Collection Team',
      serverName: 'concentrator-prod-01',
      serverConfig: '10 CPU, 40GB RAM, 1TB SSD',
      version: 'v3.4.1',
      pageVersion: '1.0',
      lead: 'Laura Davis',
      escalationMatrix: 'Level 1: Collection Team, Level 2: Data Lead, Level 3: CTO',
      vendorContact: 'Open Source Community - concentrator@community.org',
      infraSupport: 'Data Infrastructure Team - datainfra@company.com',
      architecture: 'Data concentration platform, Apache Kafka, PostgreSQL, REST APIs, real-time processing',
      functionality: 'Data collection, aggregation, concentration, forwarding to data lake, real-time processing',
      serverCount: 1,
      serverNames: 'concentrator-prod-01',
      serverConfigs: '10 CPU, 40GB RAM, 1TB SSD',
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
      documentType: req.body.documentType || 'Document',
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
  const applicationId = req.query.applicationId;
  if (applicationId) {
    const filteredDocs = documents.filter(doc => doc.applicationId === applicationId);
    res.json(filteredDocs);
  } else {
    res.json(documents);
  }
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