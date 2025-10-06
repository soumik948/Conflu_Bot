# 🚀 Soum_Confluence Setup Guide

## 📋 Overview
Soum_Confluence is a simple, clean document management system for OSS Telecom applications with left sidebar navigation and detailed application pages.

## 🎯 Features
- **Left Sidebar Navigation**: List of 15 OSS Telecom applications
- **Detailed Application Pages**: Complete application information
- **Document Management**: Upload/download documents per application
- **Edit/Delete**: Full CRUD operations for applications
- **Search**: Find applications quickly
- **Data Persistence**: All data saved to JSON files
- **Mobile Responsive**: Works on all devices

## 📱 Applications Included
1. One Probe (U-1001)
2. TSM - Telecom Service Management (U-1002)
3. Netcool (U-1003)
4. Weathermap (U-1004)
5. Argos (U-1005)
6. Sigos (U-1006)
7. Webtelnet (U-1007)
8. Performance Management (U-1008)
9. Spectrum (U-1009)
10. Mycom (U-1010)
11. Network Data Lake (U-1011)
12. Talend (U-1012)
13. Telecom AI (U-1013)
14. Probe Master (U-1014)
15. Network Monitoring (U-1015)
16. GCP Databases (U-1016)
17. Concentrator (U-1017)

## 🛠️ Setup Instructions

### Method 1: Clone from GitHub (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/soumik948/Conflu_Bot.git

# 2. Navigate to the project directory
cd Conflu_Bot

# 3. Install dependencies
npm install

# 4. Start the application
npm start
```

### Method 2: Download ZIP

1. Go to https://github.com/soumik948/Conflu_Bot
2. Click "Code" → "Download ZIP"
3. Extract the ZIP file
4. Open terminal in the extracted folder
5. Run the commands from Method 1 (steps 3-4)

## 🚀 Running the Application

### Local Development
```bash
# Start the server
npm start

# The application will be available at:
# http://localhost:8080
```

### Custom Port
```bash
# Run on a different port
PORT=3000 npm start
# Available at: http://localhost:3000
```

### Production Mode
```bash
# Install PM2 globally (optional)
npm install -g pm2

# Start with PM2
pm2 start server.js --name "soum-confluence"

# Save PM2 configuration
pm2 save
pm2 startup
```

## 📁 Project Structure
```
Conflu_Bot/
├── data/                    # Persistent data storage
│   ├── applications.json   # Applications data
│   └── documents.json      # Documents metadata
├── public/
│   ├── css/
│   │   └── style_new.css   # New simplified styles
│   ├── js/
│   │   └── app_new.js      # New JavaScript functionality
│   ├── uploads/            # Uploaded files
│   └── index.html          # Main HTML file
├── server.js               # Backend server
├── package.json            # Dependencies
└── README.md              # Documentation
```

## 🔧 Configuration

### Environment Variables
```bash
# Set port (optional)
export PORT=8080

# Set environment
export NODE_ENV=production
```

### Data Storage
- Applications: `data/applications.json`
- Documents: `data/documents.json`
- Uploaded files: `public/uploads/`

## 📱 Usage Guide

### 1. **View Applications**
- Applications are listed in the left sidebar
- Click any application to view details
- Use search to find specific applications

### 2. **Application Details**
Each application page shows:
- **Basic Information**: Name, U-Number, Version, Support Level
- **Support Details**: Team, Owner, Lead, Contacts
- **Escalation Matrix**: Support escalation levels
- **Application Inventory**: Server count, names, configurations
- **Architecture & Functionality**: Technical details
- **Architecture Diagrams**: Visual representations
- **Documents**: Uploaded files and documents

### 3. **Add New Application**
- Click "New Application" button in header
- Fill in all required fields
- Click "Add Application"

### 4. **Edit Application**
- Select an application from sidebar
- Click "Edit" button
- Modify the form
- Save changes

### 5. **Delete Application**
- Select an application from sidebar
- Click "Delete" button
- Confirm deletion

### 6. **Upload Documents**
- Select an application
- Scroll to "Application Documents" section
- Click "Upload Document"
- Select file and add description
- Upload

### 7. **Download Documents**
- Go to application documents section
- Click "Download" button next to any document

## 🌐 Hosting Options

### 1. **Heroku (Free)**
```bash
# Install Heroku CLI
# Create Procfile
echo "web: node server.js" > Procfile

# Deploy
git add .
git commit -m "Deploy to Heroku"
heroku create your-app-name
git push heroku main
```

### 2. **Railway**
1. Connect GitHub repository
2. Railway auto-deploys from main branch
3. Set PORT environment variable

### 3. **Render**
1. Connect GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Set PORT environment variable

### 4. **Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 5. **Netlify**
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `public`
4. Set functions directory: `server`

## 🔍 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process using port 8080
   lsof -ti:8080 | xargs kill -9
   
   # Or use different port
   PORT=3000 npm start
   ```

2. **Permission Denied**
   ```bash
   # Fix file permissions
   chmod +x server.js
   chmod -R 755 public/
   ```

3. **Module Not Found**
   ```bash
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Data Not Persisting**
   - Check `data/` directory exists
   - Verify write permissions
   - Check server logs for errors

### Health Check
Visit `http://localhost:8080/api/health` to check system status.

## 📊 API Endpoints

- `GET /` - Main application
- `GET /api/applications` - List all applications
- `GET /api/applications/:id` - Get specific application
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application
- `POST /api/upload` - Upload document
- `GET /api/documents` - List documents
- `GET /api/documents/:id/download` - Download document
- `DELETE /api/documents/:id` - Delete document
- `GET /api/health` - System health check

## 🎨 Customization

### Adding New Applications
1. Edit `server.js`
2. Add new application to `initializeData()` function
3. Restart server

### Styling Changes
1. Edit `public/css/style_new.css`
2. Refresh browser

### Adding New Features
1. Edit `public/js/app_new.js` for frontend
2. Edit `server.js` for backend
3. Test and deploy

## 📞 Support

For issues or questions:
1. Check this setup guide
2. Review server logs
3. Check GitHub issues
4. Contact development team

---

**Soum_Confluence** - Simple, Clean, Effective Telecom Application Management! 🚀