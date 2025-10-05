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

const upload = multer({ storage: storage });

// Data storage (in production, use a proper database)
let applications = [];
let documents = [];

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
    },
    {
      id: 'U-1006',
      name: 'Fault Management System (FMS)',
      category: 'B2B',
      supportCategory: 'Platinum',
      supportLevel: '24x7',
      owner: 'Alex Thompson',
      supportTeam: 'Network Operations Center',
      serverName: 'fms-prod-01',
      serverConfig: '10 CPU, 40GB RAM, 1TB SSD',
      version: 'v3.5.2',
      lead: 'Rachel Green',
      escalationMatrix: 'Level 1: NOC Team, Level 2: Network Engineer, Level 3: Network Manager',
      vendorContact: 'Ericsson Support - support@ericsson.com',
      infraSupport: 'Network Infrastructure Team - netops@company.com',
      architecture: 'Event-driven architecture, Apache Kafka, MongoDB, Redis',
      functionality: 'Fault detection, alarm correlation, incident management, automated remediation',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1007',
      name: 'Performance Management System (PMS)',
      category: 'B2B',
      supportCategory: 'Gold',
      supportLevel: '8x7',
      owner: 'James Wilson',
      supportTeam: 'Performance Analytics Team',
      serverName: 'pms-prod-01',
      serverConfig: '14 CPU, 56GB RAM, 2TB SSD',
      version: 'v2.8.1',
      lead: 'Emma Davis',
      escalationMatrix: 'Level 1: Performance Team, Level 2: Analytics Lead, Level 3: CTO',
      vendorContact: 'Nokia Support - support@nokia.com',
      infraSupport: 'Analytics Infrastructure Team - analytics@company.com',
      architecture: 'Big Data architecture, Apache Spark, InfluxDB, Grafana',
      functionality: 'KPI monitoring, performance analytics, capacity planning, trend analysis',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1008',
      name: 'Service Activation System (SAS)',
      category: 'B2B',
      supportCategory: 'Gold',
      supportLevel: '8x5',
      owner: 'Michael Brown',
      supportTeam: 'Service Activation Team',
      serverName: 'sas-prod-01',
      serverConfig: '8 CPU, 32GB RAM, 1TB SSD',
      version: 'v1.9.4',
      lead: 'Sophie Martinez',
      escalationMatrix: 'Level 1: Activation Team, Level 2: Service Manager, Level 3: Operations Director',
      vendorContact: 'Cisco Support - support@cisco.com',
      infraSupport: 'Service Infrastructure Team - serviceinfra@company.com',
      architecture: 'Workflow engine, Oracle Database, REST APIs, Message Queues',
      functionality: 'Service provisioning, activation workflows, resource allocation, service testing',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1009',
      name: 'Customer Self-Service Portal (CSSP)',
      category: 'B2C',
      supportCategory: 'Gold',
      supportLevel: '24x7',
      owner: 'Jennifer Taylor',
      supportTeam: 'Customer Experience Team',
      serverName: 'cssp-prod-01',
      serverConfig: '12 CPU, 48GB RAM, 1TB SSD',
      version: 'v4.1.3',
      lead: 'Daniel Anderson',
      escalationMatrix: 'Level 1: Customer Support, Level 2: UX Lead, Level 3: Product Manager',
      vendorContact: 'Salesforce Support - support@salesforce.com',
      infraSupport: 'Web Infrastructure Team - webinfra@company.com',
      architecture: 'React.js frontend, Node.js backend, PostgreSQL, Redis',
      functionality: 'Account management, bill viewing, service changes, support tickets',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1010',
      name: 'Mediation System (MED)',
      category: 'B2B',
      supportCategory: 'Platinum',
      supportLevel: '24x7',
      owner: 'Christopher Lee',
      supportTeam: 'Data Processing Team',
      serverName: 'med-prod-01',
      serverConfig: '16 CPU, 64GB RAM, 2TB SSD',
      version: 'v5.2.1',
      lead: 'Michelle White',
      escalationMatrix: 'Level 1: Data Team, Level 2: Processing Lead, Level 3: Data Director',
      vendorContact: 'Openet Support - support@openet.com',
      infraSupport: 'Data Infrastructure Team - datainfra@company.com',
      architecture: 'Stream processing, Apache Kafka, Apache Flink, PostgreSQL',
      functionality: 'CDR processing, data normalization, usage calculation, billing mediation',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1011',
      name: 'Charging System (CHG)',
      category: 'B2C',
      supportCategory: 'Platinum',
      supportLevel: '24x7',
      owner: 'Robert Johnson',
      supportTeam: 'Charging Operations Team',
      serverName: 'chg-prod-01',
      serverConfig: '20 CPU, 80GB RAM, 3TB SSD',
      version: 'v6.1.0',
      lead: 'Amanda Clark',
      escalationMatrix: 'Level 1: Charging Team, Level 2: Billing Lead, Level 3: Finance Director',
      vendorContact: 'Netscout Support - support@netscout.com',
      infraSupport: 'Billing Infrastructure Team - billinginfra@company.com',
      architecture: 'Real-time charging, Oracle BRM, Apache Kafka, Redis Cluster',
      functionality: 'Real-time rating, balance management, charging rules, payment processing',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1012',
      name: 'Policy and Charging Rules Function (PCRF)',
      category: 'B2B',
      supportCategory: 'Gold',
      supportLevel: '8x7',
      owner: 'William Davis',
      supportTeam: 'Policy Management Team',
      serverName: 'pcrf-prod-01',
      serverConfig: '12 CPU, 48GB RAM, 1TB SSD',
      version: 'v3.7.2',
      lead: 'Jessica Miller',
      escalationMatrix: 'Level 1: Policy Team, Level 2: Network Lead, Level 3: CTO',
      vendorContact: 'Juniper Support - support@juniper.com',
      infraSupport: 'Policy Infrastructure Team - policyinfra@company.com',
      architecture: 'Policy engine, Diameter protocol, PostgreSQL, Redis',
      functionality: 'Policy enforcement, QoS management, bandwidth control, service authorization',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1013',
      name: 'Home Location Register (HLR)',
      category: 'B2B',
      supportCategory: 'Platinum',
      supportLevel: '24x7',
      owner: 'Thomas Wilson',
      supportTeam: 'Core Network Team',
      serverName: 'hlr-prod-01',
      serverConfig: '24 CPU, 96GB RAM, 4TB SSD',
      version: 'v8.3.1',
      lead: 'Ashley Brown',
      escalationMatrix: 'Level 1: Core Network Team, Level 2: Network Engineer, Level 3: CTO',
      vendorContact: 'Huawei Support - support@huawei.com',
      infraSupport: 'Core Infrastructure Team - coreinfra@company.com',
      architecture: 'Distributed database, SS7 protocol, MySQL Cluster, Redis',
      functionality: 'Subscriber data management, location tracking, authentication, roaming support',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1014',
      name: 'Visitor Location Register (VLR)',
      category: 'B2B',
      supportCategory: 'Gold',
      supportLevel: '8x7',
      owner: 'Matthew Garcia',
      supportTeam: 'Core Network Team',
      serverName: 'vlr-prod-01',
      serverConfig: '16 CPU, 64GB RAM, 2TB SSD',
      version: 'v7.2.4',
      lead: 'Nicole Martinez',
      escalationMatrix: 'Level 1: Core Network Team, Level 2: Network Engineer, Level 3: CTO',
      vendorContact: 'Nokia Support - support@nokia.com',
      infraSupport: 'Core Infrastructure Team - coreinfra@company.com',
      architecture: 'Distributed system, SS7 protocol, PostgreSQL, Redis',
      functionality: 'Temporary subscriber data, call routing, location updates, visitor management',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1015',
      name: 'Mobile Switching Center (MSC)',
      category: 'B2B',
      supportCategory: 'Platinum',
      supportLevel: '24x7',
      owner: 'Andrew Rodriguez',
      supportTeam: 'Core Network Team',
      serverName: 'msc-prod-01',
      serverConfig: '32 CPU, 128GB RAM, 6TB SSD',
      version: 'v9.1.2',
      lead: 'Stephanie Lee',
      escalationMatrix: 'Level 1: Core Network Team, Level 2: Network Engineer, Level 3: CTO',
      vendorContact: 'Ericsson Support - support@ericsson.com',
      infraSupport: 'Core Infrastructure Team - coreinfra@company.com',
      architecture: 'Circuit switching, SS7 protocol, Oracle Database, Redis',
      functionality: 'Call switching, call routing, handover management, voice services',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1016',
      name: 'Gateway GPRS Support Node (GGSN)',
      category: 'B2B',
      supportCategory: 'Gold',
      supportLevel: '8x7',
      owner: 'Kevin Anderson',
      supportTeam: 'Packet Core Team',
      serverName: 'ggsn-prod-01',
      serverConfig: '20 CPU, 80GB RAM, 3TB SSD',
      version: 'v4.5.3',
      lead: 'Rachel Thompson',
      escalationMatrix: 'Level 1: Packet Core Team, Level 2: Network Engineer, Level 3: CTO',
      vendorContact: 'Cisco Support - support@cisco.com',
      infraSupport: 'Packet Infrastructure Team - packetinfra@company.com',
      architecture: 'Packet switching, GTP protocol, PostgreSQL, Redis',
      functionality: 'Internet gateway, IP address allocation, packet routing, data services',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1017',
      name: 'Serving GPRS Support Node (SGSN)',
      category: 'B2B',
      supportCategory: 'Gold',
      supportLevel: '8x7',
      owner: 'Brian White',
      supportTeam: 'Packet Core Team',
      serverName: 'sgsn-prod-01',
      serverConfig: '18 CPU, 72GB RAM, 2TB SSD',
      version: 'v4.3.1',
      lead: 'Laura Davis',
      escalationMatrix: 'Level 1: Packet Core Team, Level 2: Network Engineer, Level 3: CTO',
      vendorContact: 'Huawei Support - support@huawei.com',
      infraSupport: 'Packet Infrastructure Team - packetinfra@company.com',
      architecture: 'Packet switching, GTP protocol, MySQL, Redis',
      functionality: 'Session management, mobility management, packet routing, data services',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1018',
      name: 'Element Management System (EMS)',
      category: 'B2B',
      supportCategory: 'Silver',
      supportLevel: '8x5',
      owner: 'Mark Thompson',
      supportTeam: 'Element Management Team',
      serverName: 'ems-prod-01',
      serverConfig: '8 CPU, 32GB RAM, 1TB SSD',
      version: 'v2.6.2',
      lead: 'Samantha Wilson',
      escalationMatrix: 'Level 1: EMS Team, Level 2: Network Lead, Level 3: Network Manager',
      vendorContact: 'Juniper Support - support@juniper.com',
      infraSupport: 'Element Infrastructure Team - elementinfra@company.com',
      architecture: 'SNMP management, Web interface, PostgreSQL, Redis',
      functionality: 'Element configuration, monitoring, alarm management, software updates',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1019',
      name: 'Service Quality Management (SQM)',
      category: 'B2B',
      supportCategory: 'Gold',
      supportLevel: '8x7',
      owner: 'Ryan Martinez',
      supportTeam: 'Quality Assurance Team',
      serverName: 'sqm-prod-01',
      serverConfig: '14 CPU, 56GB RAM, 2TB SSD',
      version: 'v3.2.1',
      lead: 'Jennifer Garcia',
      escalationMatrix: 'Level 1: Quality Team, Level 2: QA Lead, Level 3: Quality Director',
      vendorContact: 'Netscout Support - support@netscout.com',
      infraSupport: 'Quality Infrastructure Team - qualityinfra@company.com',
      architecture: 'Analytics platform, Apache Spark, InfluxDB, Grafana',
      functionality: 'Service quality monitoring, SLA management, performance analytics, reporting',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1020',
      name: 'Customer Care System (CCS)',
      category: 'B2C',
      supportCategory: 'Gold',
      supportLevel: '24x7',
      owner: 'David Kim',
      supportTeam: 'Customer Care Team',
      serverName: 'ccs-prod-01',
      serverConfig: '16 CPU, 64GB RAM, 2TB SSD',
      version: 'v5.4.2',
      lead: 'Michelle Johnson',
      escalationMatrix: 'Level 1: Customer Care, Level 2: Care Lead, Level 3: Customer Director',
      vendorContact: 'Salesforce Support - support@salesforce.com',
      infraSupport: 'Care Infrastructure Team - careinfra@company.com',
      architecture: 'Multi-channel platform, REST APIs, PostgreSQL, Redis',
      functionality: 'Customer support, ticket management, knowledge base, live chat',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1021',
      name: 'Revenue Assurance System (RAS)',
      category: 'B2B',
      supportCategory: 'Silver',
      supportLevel: '8x5',
      owner: 'Steven Brown',
      supportTeam: 'Revenue Assurance Team',
      serverName: 'ras-prod-01',
      serverConfig: '12 CPU, 48GB RAM, 1TB SSD',
      version: 'v2.9.3',
      lead: 'Amanda White',
      escalationMatrix: 'Level 1: Revenue Team, Level 2: Finance Lead, Level 3: Finance Director',
      vendorContact: 'Subex Support - support@subex.com',
      infraSupport: 'Revenue Infrastructure Team - revenueinfra@company.com',
      architecture: 'Data analytics platform, Apache Spark, PostgreSQL, Redis',
      functionality: 'Revenue leakage detection, fraud prevention, data validation, reporting',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1022',
      name: 'Service Level Agreement Management (SLAM)',
      category: 'B2B',
      supportCategory: 'Gold',
      supportLevel: '8x7',
      owner: 'Jason Davis',
      supportTeam: 'SLA Management Team',
      serverName: 'slam-prod-01',
      serverConfig: '10 CPU, 40GB RAM, 1TB SSD',
      version: 'v1.7.4',
      lead: 'Sarah Miller',
      escalationMatrix: 'Level 1: SLA Team, Level 2: Operations Lead, Level 3: Operations Director',
      vendorContact: 'IBM Support - support@ibm.com',
      infraSupport: 'SLA Infrastructure Team - slainfra@company.com',
      architecture: 'Monitoring platform, REST APIs, PostgreSQL, Redis',
      functionality: 'SLA monitoring, compliance tracking, performance reporting, alerting',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1023',
      name: 'Network Planning System (NPS)',
      category: 'B2B',
      supportCategory: 'Silver',
      supportLevel: '8x5',
      owner: 'Michael Wilson',
      supportTeam: 'Network Planning Team',
      serverName: 'nps-prod-01',
      serverConfig: '16 CPU, 64GB RAM, 3TB SSD',
      version: 'v4.1.2',
      lead: 'Lisa Anderson',
      escalationMatrix: 'Level 1: Planning Team, Level 2: Planning Lead, Level 3: CTO',
      vendorContact: 'Huawei Support - support@huawei.com',
      infraSupport: 'Planning Infrastructure Team - planninginfra@company.com',
      architecture: 'GIS platform, PostgreSQL, PostGIS, Redis',
      functionality: 'Network planning, capacity planning, coverage analysis, optimization',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1024',
      name: 'Trouble Ticket System (TTS)',
      category: 'B2B',
      supportCategory: 'Gold',
      supportLevel: '8x7',
      owner: 'Christopher Taylor',
      supportTeam: 'Trouble Management Team',
      serverName: 'tts-prod-01',
      serverConfig: '8 CPU, 32GB RAM, 1TB SSD',
      version: 'v3.3.1',
      lead: 'Jessica Rodriguez',
      escalationMatrix: 'Level 1: Trouble Team, Level 2: Support Lead, Level 3: Operations Director',
      vendorContact: 'ServiceNow Support - support@servicenow.com',
      infraSupport: 'Trouble Infrastructure Team - troubleinfra@company.com',
      architecture: 'ITSM platform, REST APIs, PostgreSQL, Redis',
      functionality: 'Ticket management, incident tracking, problem management, escalation',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'U-1025',
      name: 'Mobile Money Platform (MMP)',
      category: 'B2C',
      supportCategory: 'Platinum',
      supportLevel: '24x7',
      owner: 'Daniel Kim',
      supportTeam: 'Mobile Money Team',
      serverName: 'mmp-prod-01',
      serverConfig: '24 CPU, 96GB RAM, 4TB SSD',
      version: 'v6.2.1',
      lead: 'Ashley Martinez',
      escalationMatrix: 'Level 1: Mobile Money Team, Level 2: Fintech Lead, Level 3: CTO',
      vendorContact: 'Mastercard Support - support@mastercard.com',
      infraSupport: 'Fintech Infrastructure Team - fintechinfra@company.com',
      architecture: 'Microservices, REST APIs, PostgreSQL, Redis, Apache Kafka',
      functionality: 'Mobile payments, money transfer, wallet management, financial services',
      lastUpdated: new Date().toISOString()
    }
  ];
};

// Initialize data on startup
initializeData();

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
  const newApp = {
    id: `U-${Date.now()}`,
    ...req.body,
    lastUpdated: new Date().toISOString()
  };
  applications.push(newApp);
  res.json(newApp);
});

// Update application
app.put('/api/applications/:id', (req, res) => {
  const index = applications.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }
  applications[index] = { ...applications[index], ...req.body, lastUpdated: new Date().toISOString() };
  res.json(applications[index]);
});

// Delete application
app.delete('/api/applications/:id', (req, res) => {
  const index = applications.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }
  applications.splice(index, 1);
  res.json({ message: 'Application deleted successfully' });
});

// Upload document
app.post('/api/upload', upload.single('document'), (req, res) => {
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
    applicationId: req.body.applicationId || null
  };
  
  documents.push(document);
  res.json(document);
});

// Get documents
app.get('/api/documents', (req, res) => {
  res.json(documents);
});

// Download document
app.get('/api/documents/:id/download', (req, res) => {
  const doc = documents.find(d => d.id === req.params.id);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  res.download(doc.path, doc.filename);
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

app.listen(PORT, () => {
  console.log(`Soum_Confluence server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the application`);
});