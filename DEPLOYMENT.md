# Soum_Confluence Deployment Guide

## 🚀 Quick Deployment

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or start production server
npm start
```

### Production Deployment

#### Option 1: Direct Server Deployment
```bash
# Clone repository
git clone <repository-url>
cd soum-confluence

# Install dependencies
npm install

# Start application
npm start
```

#### Option 2: Using PM2 (Recommended for Production)
```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start server.js --name "soum-confluence"

# Save PM2 configuration
pm2 save
pm2 startup
```

#### Option 3: Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🌐 Free Hosting Options

### 1. Heroku (Recommended)
```bash
# Install Heroku CLI
# Create Procfile
echo "web: node server.js" > Procfile

# Deploy to Heroku
heroku create soum-confluence
git push heroku main
```

### 2. Railway
```bash
# Connect GitHub repository
# Railway will auto-deploy from main branch
# Set PORT environment variable to 3000
```

### 3. Render
```bash
# Connect GitHub repository
# Set build command: npm install
# Set start command: npm start
# Set PORT environment variable to 3000
```

### 4. Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 5. Netlify
```bash
# Build command: npm run build
# Publish directory: public
# Functions directory: server
```

## 🔧 Environment Variables

Create a `.env` file:
```env
PORT=3000
NODE_ENV=production
```

## 📊 Monitoring

### Health Check Endpoint
```bash
curl http://localhost:3000/api/health
```

### Logs
```bash
# PM2 logs
pm2 logs soum-confluence

# Direct logs
npm start 2>&1 | tee app.log
```

## 🔒 Security Considerations

1. **HTTPS**: Use SSL certificates in production
2. **Environment Variables**: Store sensitive data in environment variables
3. **Rate Limiting**: Implement rate limiting for API endpoints
4. **Input Validation**: Validate all user inputs
5. **File Upload Security**: Implement file type validation

## 📈 Performance Optimization

1. **Caching**: Implement Redis for session storage
2. **CDN**: Use CDN for static assets
3. **Database**: Migrate to PostgreSQL/MongoDB for production
4. **Load Balancing**: Use nginx for load balancing
5. **Monitoring**: Implement application monitoring

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill existing process
   pkill -f "node server.js"
   
   # Or use different port
   PORT=3001 npm start
   ```

2. **Permission Denied**
   ```bash
   # Fix file permissions
   chmod +x server.js
   ```

3. **Module Not Found**
   ```bash
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📞 Support

For deployment issues:
- Check the logs: `npm start 2>&1 | tee app.log`
- Verify port availability: `netstat -tulpn | grep :3000`
- Check Node.js version: `node --version`
- Verify dependencies: `npm list`

---

**Soum_Confluence** - Ready for production deployment! 🚀