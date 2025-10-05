# Soum_Confluence - Telecom Document Management System

A comprehensive document management system similar to Confluence, specifically designed for telecom OSS/BSS applications. This platform provides a centralized repository for managing application documentation, team information, and technical specifications.

## 🚀 Features

### Core Functionality
- **Application Management**: Comprehensive database of 25+ telecom applications
- **Document Management**: Upload, download, and organize documents
- **Search & Filter**: Advanced search capabilities with category and support level filters
- **Team Information**: Complete contact details and escalation matrices
- **Real-time Dashboard**: Statistics and recent applications overview

### Application Categories
- **B2B Applications**: Network management, service provisioning, fault management
- **B2C Applications**: Customer portals, billing systems, mobile money platforms

### Support Levels
- **Platinum**: 24x7 support with highest priority
- **Gold**: 8x7 support with high priority  
- **Silver**: 8x5 support with standard priority

## 📋 Application Inventory

The system includes 25 comprehensive telecom applications:

### OSS (Operations Support Systems)
1. **Network Management System (NMS)** - U-1003
2. **Fault Management System (FMS)** - U-1006
3. **Performance Management System (PMS)** - U-1007
4. **Service Order Management (SOM)** - U-1004
5. **Inventory Management System (IMS)** - U-1005
6. **Service Activation System (SAS)** - U-1008
7. **Mediation System (MED)** - U-1010
8. **Element Management System (EMS)** - U-1018
9. **Service Quality Management (SQM)** - U-1019
10. **Service Level Agreement Management (SLAM)** - U-1022
11. **Network Planning System (NPS)** - U-1023
12. **Trouble Ticket System (TTS)** - U-1024

### BSS (Business Support Systems)
1. **Customer Relationship Management (CRM)** - U-1001
2. **Billing and Revenue Management (BRM)** - U-1002
3. **Charging System (CHG)** - U-1011
4. **Customer Self-Service Portal (CSSP)** - U-1009
5. **Customer Care System (CCS)** - U-1020
6. **Revenue Assurance System (RAS)** - U-1021
7. **Mobile Money Platform (MMP)** - U-1025

### Core Network Systems
1. **Home Location Register (HLR)** - U-1013
2. **Visitor Location Register (VLR)** - U-1014
3. **Mobile Switching Center (MSC)** - U-1015
4. **Gateway GPRS Support Node (GGSN)** - U-1016
5. **Serving GPRS Support Node (SGSN)** - U-1017
6. **Policy and Charging Rules Function (PCRF)** - U-1012

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Multer** - File upload handling
- **UUID** - Unique identifier generation

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling with modern design patterns
- **JavaScript (ES6+)** - Client-side functionality
- **Font Awesome** - Icons
- **Google Fonts** - Typography

### Features
- **Responsive Design** - Mobile-first approach
- **Modern UI/UX** - Confluence-inspired interface
- **Real-time Updates** - Dynamic content loading
- **File Management** - Upload/download capabilities
- **Search & Filter** - Advanced querying

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd soum-confluence
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm start
   ```

4. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

### Development Mode
```bash
npm run dev
```

## 📱 Usage

### Dashboard
- View application statistics
- Monitor recent applications
- Quick access to key metrics

### Applications
- Browse all telecom applications
- Filter by category (B2B/B2C) and support level
- View detailed application information
- Add new applications

### Documents
- Upload documents with optional application association
- Download existing documents
- Manage document library

### Search
- Search applications by name, owner, or functionality
- Apply multiple filters
- View search results in grid format

## 🔧 API Endpoints

### Applications
- `GET /api/applications` - Get all applications
- `GET /api/applications/:id` - Get specific application
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application

### Documents
- `GET /api/documents` - Get all documents
- `POST /api/upload` - Upload document
- `GET /api/documents/:id/download` - Download document

### Search
- `GET /api/search` - Search applications with filters

## 📊 Application Data Structure

Each application includes:
- **Basic Info**: ID, name, category, version
- **Team Details**: Owner, support team, lead, escalation matrix
- **Infrastructure**: Server name, configuration, vendor contact
- **Technical**: Architecture, functionality, support level
- **Metadata**: Last updated timestamp

## 🎨 Design Features

### UI/UX Highlights
- **Confluence-inspired Design** - Familiar interface for users
- **Responsive Layout** - Works on all device sizes
- **Modern Color Scheme** - Professional gradient backgrounds
- **Interactive Elements** - Hover effects and smooth transitions
- **Card-based Layout** - Clean, organized information display

### Accessibility
- **Keyboard Navigation** - Full keyboard support
- **Screen Reader Friendly** - Semantic HTML structure
- **High Contrast** - Readable color combinations
- **Mobile Optimized** - Touch-friendly interface

## 🔒 Security Features

- **File Upload Validation** - Secure file handling
- **Input Sanitization** - XSS prevention
- **CORS Configuration** - Cross-origin request handling
- **Error Handling** - Graceful error management

## 📈 Future Enhancements

- **User Authentication** - Login/logout functionality
- **Role-based Access** - Permission management
- **Database Integration** - Persistent data storage
- **Real-time Notifications** - Live updates
- **Advanced Analytics** - Usage statistics and reporting
- **API Documentation** - Swagger/OpenAPI integration
- **Docker Support** - Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Basic application management
- ✅ Document upload/download
- ✅ Search and filtering
- ✅ Responsive design

### Phase 2 (Next)
- 🔄 User authentication
- 🔄 Database integration
- 🔄 Advanced analytics
- 🔄 API documentation

### Phase 3 (Future)
- ⏳ Real-time collaboration
- ⏳ Mobile application
- ⏳ Advanced reporting
- ⏳ Integration capabilities

---

**Soum_Confluence** - Empowering telecom teams with comprehensive document management and application tracking.