// Global variables
let applications = [];
let currentApplication = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadApplications();
});

// Initialize application
function initializeApp() {
    console.log('Soum_Confluence - Simple Design initialized');
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('app-search');
    if (searchInput) {
        searchInput.addEventListener('input', filterApplications);
    }

    // Form submissions
    const addAppForm = document.getElementById('add-app-form');
    if (addAppForm) {
        addAppForm.addEventListener('submit', handleAddApplication);
    }

    const uploadForm = document.getElementById('upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUpload);
    }

    // Modal close on outside click
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeAddModal();
            closeUploadModal();
        }
    });
}

// Load applications from API
async function loadApplications() {
    try {
        const response = await fetch('/api/applications');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        applications = await response.json();
        displayApplications(applications);
        updateAppCount();
    } catch (error) {
        console.error('Error loading applications:', error);
        showMessage('Error loading applications: ' + error.message, 'error');
    }
}

// Display applications in sidebar
function displayApplications(apps) {
    const container = document.getElementById('app-nav');
    if (!container) return;

    if (apps.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #6c757d;">
                <i class="fas fa-mobile-alt" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <p>No applications found</p>
            </div>
        `;
        return;
    }

    container.innerHTML = apps.map(app => `
        <div class="app-nav-item" onclick="showApplication('${app.id}')">
            <div class="app-name">${app.name}</div>
            <div class="app-u-number">${app.uNumber || app.id}</div>
        </div>
    `).join('');
}

// Show application details
async function showApplication(appId) {
    try {
        const response = await fetch(`/api/applications/${appId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const app = await response.json();
        
        currentApplication = app;
        displayApplicationDetails(app);
        
        // Update active state
        document.querySelectorAll('.app-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        event.target.closest('.app-nav-item').classList.add('active');
        
        // Show detail page
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('app-detail-page').style.display = 'block';
        
    } catch (error) {
        console.error('Error loading application details:', error);
        showMessage('Error loading application details: ' + error.message, 'error');
    }
}

// Display application details
function displayApplicationDetails(app) {
    // Update page header
    document.getElementById('app-name').textContent = app.name;
    document.getElementById('app-u-number').textContent = app.uNumber || app.id;
    
    // Update basic information
    document.getElementById('detail-app-name').textContent = app.name;
    document.getElementById('detail-u-number').textContent = app.uNumber || app.id;
    document.getElementById('detail-version').textContent = app.version || '-';
    document.getElementById('detail-page-version').textContent = app.pageVersion || '1.0';
    document.getElementById('detail-support-level').textContent = app.supportCategory || '-';
    document.getElementById('detail-support-mode').textContent = app.supportLevel || '-';
    
    // Update support details
    document.getElementById('detail-support-team').textContent = app.supportTeam || '-';
    document.getElementById('detail-owner').textContent = app.owner || '-';
    document.getElementById('detail-lead').textContent = app.lead || '-';
    document.getElementById('detail-infra-support').textContent = app.infraSupport || '-';
    document.getElementById('detail-vendor-support').textContent = app.vendorContact || '-';
    
    // Update escalation matrix
    document.getElementById('detail-escalation-matrix').textContent = app.escalationMatrix || 'No escalation matrix defined';
    
    // Update inventory
    document.getElementById('detail-server-count').textContent = app.serverCount || '0';
    document.getElementById('detail-server-names').textContent = app.serverNames || '-';
    document.getElementById('detail-server-configs').textContent = app.serverConfigs || '-';
    
    // Update architecture
    document.getElementById('detail-architecture').textContent = app.architecture || 'No architecture information available';
    document.getElementById('detail-functionality').textContent = app.functionality || 'No functionality information available';
    
    // Load diagrams and documents
    loadApplicationDiagrams(app.id);
    loadApplicationDocuments(app.id);
}

// Load application diagrams
function loadApplicationDiagrams(appId) {
    const container = document.getElementById('detail-diagrams');
    
    // For now, show placeholder diagrams
    container.innerHTML = `
        <div class="diagram-item">
            <i class="fas fa-project-diagram"></i>
            <h4>Application Architecture</h4>
            <p>High-level system architecture diagram</p>
        </div>
        <div class="diagram-item">
            <i class="fas fa-server"></i>
            <h4>Infrastructure Diagram</h4>
            <p>Server and network infrastructure layout</p>
        </div>
        <div class="diagram-item">
            <i class="fas fa-database"></i>
            <h4>Database Schema</h4>
            <p>Database structure and relationships</p>
        </div>
    `;
}

// Load application documents
async function loadApplicationDocuments(appId) {
    try {
        const response = await fetch(`/api/documents?applicationId=${appId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const documents = await response.json();
        
        const container = document.getElementById('detail-documents');
        
        if (documents.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #6c757d;">
                    <i class="fas fa-file-alt" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <p>No documents uploaded yet</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = documents.map(doc => `
            <div class="document-item">
                <div class="doc-icon">
                    <i class="fas fa-file-pdf"></i>
                </div>
                <div class="doc-name">${doc.filename}</div>
                <div class="doc-type">${doc.documentType || 'Document'}</div>
                <div class="doc-actions">
                    <button class="btn btn-primary btn-sm" onclick="downloadDocument('${doc.id}')">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteDocument('${doc.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading documents:', error);
        const container = document.getElementById('detail-documents');
        container.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #dc3545;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <p>Error loading documents</p>
            </div>
        `;
    }
}

// Filter applications
function filterApplications() {
    const query = document.getElementById('app-search').value.toLowerCase();
    const filteredApps = applications.filter(app => 
        app.name.toLowerCase().includes(query) ||
        (app.uNumber && app.uNumber.toLowerCase().includes(query))
    );
    displayApplications(filteredApps);
}

// Update application count
function updateAppCount() {
    const countElement = document.getElementById('app-count');
    if (countElement) {
        countElement.textContent = applications.length;
    }
}

// Show add application modal
function showAddApplicationModal() {
    document.getElementById('add-app-modal').style.display = 'block';
}

// Close add application modal
function closeAddModal() {
    document.getElementById('add-app-modal').style.display = 'none';
    document.getElementById('add-app-form').reset();
}

// Handle add application form submission
async function handleAddApplication(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const appData = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch('/api/applications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appData)
        });
        
        if (response.ok) {
            const result = await response.json();
            showMessage('Application added successfully!', 'success');
            closeAddModal();
            loadApplications();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to add application');
        }
    } catch (error) {
        console.error('Error adding application:', error);
        showMessage('Error adding application: ' + error.message, 'error');
    }
}

// Edit application
function editApplication() {
    if (!currentApplication) return;
    
    // Populate form with current data
    document.getElementById('app-name').value = currentApplication.name;
    document.getElementById('app-u-number').value = currentApplication.uNumber || currentApplication.id;
    document.getElementById('app-version').value = currentApplication.version || '';
    document.getElementById('app-page-version').value = currentApplication.pageVersion || '1.0';
    document.getElementById('app-support-level').value = currentApplication.supportCategory || 'Gold';
    document.getElementById('app-support-mode').value = currentApplication.supportLevel || '8x5';
    document.getElementById('app-support-team').value = currentApplication.supportTeam || '';
    document.getElementById('app-owner').value = currentApplication.owner || '';
    document.getElementById('app-lead').value = currentApplication.lead || '';
    document.getElementById('app-infra-support').value = currentApplication.infraSupport || '';
    document.getElementById('app-vendor-support').value = currentApplication.vendorContact || '';
    document.getElementById('app-escalation').value = currentApplication.escalationMatrix || '';
    document.getElementById('app-server-count').value = currentApplication.serverCount || 0;
    document.getElementById('app-server-names').value = currentApplication.serverNames || '';
    document.getElementById('app-server-configs').value = currentApplication.serverConfigs || '';
    document.getElementById('app-architecture').value = currentApplication.architecture || '';
    document.getElementById('app-functionality').value = currentApplication.functionality || '';
    
    showAddApplicationModal();
}

// Delete application
async function deleteApplication() {
    if (!currentApplication) return;
    
    if (!confirm(`Are you sure you want to delete "${currentApplication.name}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`/api/applications/${currentApplication.id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showMessage('Application deleted successfully!', 'success');
            loadApplications();
            
            // Show welcome screen
            document.getElementById('welcome-screen').style.display = 'flex';
            document.getElementById('app-detail-page').style.display = 'none';
            currentApplication = null;
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Delete failed');
        }
    } catch (error) {
        console.error('Error deleting application:', error);
        showMessage('Error deleting application: ' + error.message, 'error');
    }
}

// Show upload modal
function showUploadModal() {
    if (!currentApplication) {
        showMessage('Please select an application first', 'error');
        return;
    }
    document.getElementById('upload-modal').style.display = 'block';
}

// Close upload modal
function closeUploadModal() {
    document.getElementById('upload-modal').style.display = 'none';
    document.getElementById('upload-form').reset();
}

// Handle upload form submission
async function handleUpload(e) {
    e.preventDefault();
    
    if (!currentApplication) {
        showMessage('Please select an application first', 'error');
        return;
    }
    
    const formData = new FormData(e.target);
    formData.append('applicationId', currentApplication.id);
    
    const fileInput = document.getElementById('document-file');
    
    // Validate file selection
    if (!fileInput.files[0]) {
        showMessage('Please select a file to upload', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Uploading...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            showMessage('Document uploaded successfully!', 'success');
            closeUploadModal();
            loadApplicationDocuments(currentApplication.id);
        } else {
            throw new Error(result.error || 'Upload failed');
        }
    } catch (error) {
        console.error('Error uploading document:', error);
        showMessage('Error uploading document: ' + error.message, 'error');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Download document
async function downloadDocument(docId) {
    try {
        const response = await fetch(`/api/documents/${docId}/download`);
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'document';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Download failed');
        }
    } catch (error) {
        console.error('Error downloading document:', error);
        showMessage('Error downloading document: ' + error.message, 'error');
    }
}

// Delete document
async function deleteDocument(docId) {
    if (!confirm('Are you sure you want to delete this document?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/documents/${docId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showMessage('Document deleted successfully!', 'success');
            if (currentApplication) {
                loadApplicationDocuments(currentApplication.id);
            }
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Delete failed');
        }
    } catch (error) {
        console.error('Error deleting document:', error);
        showMessage('Error deleting document: ' + error.message, 'error');
    }
}

// Utility functions
function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert at the top of the main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(messageDiv, mainContent.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}