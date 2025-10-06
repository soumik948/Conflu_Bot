// Global variables
let applications = [];
let documents = [];
let currentSection = 'dashboard';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadApplications();
    loadDocuments();
    updateDashboard();
});

// Initialize application
function initializeApp() {
    console.log('Soum_Confluence initialized with persistent storage');
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Filter functionality
    const categoryFilter = document.getElementById('category-filter');
    const supportFilter = document.getElementById('support-filter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterApplications);
    }
    if (supportFilter) {
        supportFilter.addEventListener('change', filterApplications);
    }

    // Form submissions
    const addAppForm = document.getElementById('add-application-form');
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
            closeModal();
            closeAddModal();
            closeUploadModal();
        }
    });
}

// Navigation functions
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Show selected section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Add active class to nav link
    const navLink = document.querySelector(`[data-section="${sectionName}"]`);
    if (navLink) {
        navLink.classList.add('active');
    }

    currentSection = sectionName;

    // Load section-specific data
    if (sectionName === 'applications') {
        loadApplications();
    } else if (sectionName === 'documents') {
        loadDocuments();
    } else if (sectionName === 'search') {
        clearSearchResults();
    }
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
        updateDashboard();
    } catch (error) {
        console.error('Error loading applications:', error);
        showMessage('Error loading applications: ' + error.message, 'error');
    }
}

// Display applications in grid
function displayApplications(apps) {
    const container = document.getElementById('applications-list');
    if (!container) return;

    if (apps.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-mobile-alt"></i>
                <h3>No Applications Found</h3>
                <p>No applications match your current filters.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = apps.map(app => `
        <div class="app-card" onclick="showApplicationDetails('${app.id}')">
            <div class="app-header">
                <div class="app-id">${app.id}</div>
                <div class="app-name">${app.name}</div>
                <div class="app-meta">
                    <span class="app-category ${app.category.toLowerCase()}">${app.category}</span>
                    <span class="app-support ${app.supportCategory.toLowerCase()}">${app.supportCategory}</span>
                </div>
            </div>
            <div class="app-body">
                <div class="app-info">
                    <div class="app-info-item">
                        <span class="app-info-label">Owner:</span>
                        <span class="app-info-value">${app.owner}</span>
                    </div>
                    <div class="app-info-item">
                        <span class="app-info-label">Version:</span>
                        <span class="app-info-value">${app.version}</span>
                    </div>
                    <div class="app-info-item">
                        <span class="app-info-label">Support:</span>
                        <span class="app-info-value">${app.supportLevel}</span>
                    </div>
                </div>
            </div>
            <div class="app-actions">
                <button class="btn btn-primary" onclick="event.stopPropagation(); showApplicationDetails('${app.id}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
            </div>
        </div>
    `).join('');
}

// Show application details modal
async function showApplicationDetails(appId) {
    try {
        const response = await fetch(`/api/applications/${appId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const app = await response.json();
        
        const modal = document.getElementById('application-modal');
        const modalName = document.getElementById('modal-app-name');
        const modalDetails = document.getElementById('modal-app-details');
        
        modalName.textContent = app.name;
        modalDetails.innerHTML = `
            <div class="app-detail-section">
                <h3>Basic Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Application ID:</span>
                        <span class="detail-value">${app.id}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Category:</span>
                        <span class="detail-value">${app.category}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Support Category:</span>
                        <span class="detail-value">${app.supportCategory}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Support Level:</span>
                        <span class="detail-value">${app.supportLevel}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Version:</span>
                        <span class="detail-value">${app.version}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Last Updated:</span>
                        <span class="detail-value">${new Date(app.lastUpdated).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <div class="app-detail-section">
                <h3>Team Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Application Owner:</span>
                        <span class="detail-value">${app.owner}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Support Team:</span>
                        <span class="detail-value">${app.supportTeam}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Application Lead:</span>
                        <span class="detail-value">${app.lead}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Vendor Contact:</span>
                        <span class="detail-value">${app.vendorContact}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Infra Support:</span>
                        <span class="detail-value">${app.infraSupport}</span>
                    </div>
                </div>
            </div>

            <div class="app-detail-section">
                <h3>Infrastructure</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Server Name:</span>
                        <span class="detail-value">${app.serverName}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Configuration:</span>
                        <span class="detail-value">${app.serverConfig}</span>
                    </div>
                </div>
            </div>

            <div class="app-detail-section">
                <h3>Architecture</h3>
                <p style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
                    ${app.architecture}
                </p>
            </div>

            <div class="app-detail-section">
                <h3>Functionality</h3>
                <p style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745;">
                    ${app.functionality}
                </p>
            </div>

            <div class="app-detail-section">
                <h3>Escalation Matrix</h3>
                <p style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
                    ${app.escalationMatrix}
                </p>
            </div>
        `;
        
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error loading application details:', error);
        showMessage('Error loading application details: ' + error.message, 'error');
    }
}

// Close modal
function closeModal() {
    document.getElementById('application-modal').style.display = 'none';
}

// Show add application modal
function showAddApplicationModal() {
    document.getElementById('add-application-modal').style.display = 'block';
}

// Close add application modal
function closeAddModal() {
    document.getElementById('add-application-modal').style.display = 'none';
    document.getElementById('add-application-form').reset();
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

// Load documents from API
async function loadDocuments() {
    try {
        const response = await fetch('/api/documents');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        documents = await response.json();
        displayDocuments(documents);
        updateDashboard();
    } catch (error) {
        console.error('Error loading documents:', error);
        showMessage('Error loading documents: ' + error.message, 'error');
    }
}

// Display documents
function displayDocuments(docs) {
    const container = document.getElementById('documents-list');
    if (!container) return;

    if (docs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <h3>No Documents Found</h3>
                <p>Upload your first document to get started.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = docs.map(doc => `
        <div class="document-card">
            <div class="document-icon">
                <i class="fas fa-file-pdf"></i>
            </div>
            <div class="document-name">${doc.filename}</div>
            <div class="document-meta">
                <div>Size: ${formatFileSize(doc.size)}</div>
                <div>Uploaded: ${new Date(doc.uploadedAt).toLocaleDateString()}</div>
                ${doc.description ? `<div>Description: ${doc.description}</div>` : ''}
                ${doc.category ? `<div>Category: ${doc.category}</div>` : ''}
            </div>
            <div class="document-actions">
                <button class="btn btn-primary" onclick="downloadDocument('${doc.id}')">
                    <i class="fas fa-download"></i> Download
                </button>
                <button class="btn btn-danger" onclick="deleteDocument('${doc.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
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
            a.download = documents.find(d => d.id === docId).filename;
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
            loadDocuments();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Delete failed');
        }
    } catch (error) {
        console.error('Error deleting document:', error);
        showMessage('Error deleting document: ' + error.message, 'error');
    }
}

// Show upload modal
function showUploadModal() {
    // Populate application dropdown
    const appSelect = document.getElementById('document-app');
    appSelect.innerHTML = '<option value="">No Association</option>' +
        applications.map(app => `<option value="${app.id}">${app.name}</option>`).join('');
    
    document.getElementById('upload-modal').style.display = 'block';
}

// Close upload modal
function closeUploadModal() {
    document.getElementById('upload-modal').style.display = 'none';
    document.getElementById('upload-form').reset();
}

// Handle upload form submission - IMPROVED VERSION
async function handleUpload(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const fileInput = document.getElementById('document-file');
    
    // Validate file selection
    if (!fileInput.files[0]) {
        showMessage('Please select a file to upload', 'error');
        return;
    }
    
    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (fileInput.files[0].size > maxSize) {
        showMessage('File size must be less than 10MB', 'error');
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
            loadDocuments();
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

// Search functionality
async function performSearch() {
    const query = document.getElementById('search-input').value;
    const category = document.getElementById('search-category').value;
    const supportCategory = document.getElementById('search-support').value;
    
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category) params.append('category', category);
    if (supportCategory) params.append('supportCategory', supportCategory);
    
    try {
        const response = await fetch(`/api/search?${params}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const results = await response.json();
        displaySearchResults(results);
    } catch (error) {
        console.error('Error performing search:', error);
        showMessage('Error performing search: ' + error.message, 'error');
    }
}

// Display search results
function displaySearchResults(results) {
    const container = document.getElementById('search-results');
    if (!container) return;

    if (results.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No Results Found</h3>
                <p>Try adjusting your search criteria.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="search-results-header">
            <h3>Search Results (${results.length} found)</h3>
        </div>
        <div class="applications-grid">
            ${results.map(app => `
                <div class="app-card" onclick="showApplicationDetails('${app.id}')">
                    <div class="app-header">
                        <div class="app-id">${app.id}</div>
                        <div class="app-name">${app.name}</div>
                        <div class="app-meta">
                            <span class="app-category ${app.category.toLowerCase()}">${app.category}</span>
                            <span class="app-support ${app.supportCategory.toLowerCase()}">${app.supportCategory}</span>
                        </div>
                    </div>
                    <div class="app-body">
                        <div class="app-info">
                            <div class="app-info-item">
                                <span class="app-info-label">Owner:</span>
                                <span class="app-info-value">${app.owner}</span>
                            </div>
                            <div class="app-info-item">
                                <span class="app-info-label">Version:</span>
                                <span class="app-info-value">${app.version}</span>
                            </div>
                            <div class="app-info-item">
                                <span class="app-info-label">Support:</span>
                                <span class="app-info-value">${app.supportLevel}</span>
                            </div>
                        </div>
                    </div>
                    <div class="app-actions">
                        <button class="btn btn-primary" onclick="event.stopPropagation(); showApplicationDetails('${app.id}')">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Clear search results
function clearSearchResults() {
    const container = document.getElementById('search-results');
    if (container) {
        container.innerHTML = '';
    }
}

// Filter applications
function filterApplications() {
    const category = document.getElementById('category-filter').value;
    const supportCategory = document.getElementById('support-filter').value;
    
    let filteredApps = applications;
    
    if (category) {
        filteredApps = filteredApps.filter(app => app.category === category);
    }
    
    if (supportCategory) {
        filteredApps = filteredApps.filter(app => app.supportCategory === supportCategory);
    }
    
    displayApplications(filteredApps);
}

// Update dashboard statistics
function updateDashboard() {
    const totalApps = applications.length;
    const platinumApps = applications.filter(app => app.supportCategory === 'Platinum').length;
    const support24x7 = applications.filter(app => app.supportLevel === '24x7').length;
    const totalDocs = documents.length;
    
    const totalAppsEl = document.getElementById('total-apps');
    const platinumAppsEl = document.getElementById('platinum-apps');
    const support24x7El = document.getElementById('support-24x7');
    const totalDocsEl = document.getElementById('total-docs');
    
    if (totalAppsEl) totalAppsEl.textContent = totalApps;
    if (platinumAppsEl) platinumAppsEl.textContent = platinumApps;
    if (support24x7El) support24x7El.textContent = support24x7;
    if (totalDocsEl) totalDocsEl.textContent = totalDocs;
    
    // Update recent applications
    const recentApps = applications.slice(0, 6);
    const recentContainer = document.getElementById('recent-apps-list');
    if (recentContainer) {
        recentContainer.innerHTML = recentApps.map(app => `
            <div class="app-card" onclick="showApplicationDetails('${app.id}')">
                <div class="app-header">
                    <div class="app-id">${app.id}</div>
                    <div class="app-name">${app.name}</div>
                    <div class="app-meta">
                        <span class="app-category ${app.category.toLowerCase()}">${app.category}</span>
                        <span class="app-support ${app.supportCategory.toLowerCase()}">${app.supportCategory}</span>
                    </div>
                </div>
                <div class="app-body">
                    <div class="app-info">
                        <div class="app-info-item">
                            <span class="app-info-label">Owner:</span>
                            <span class="app-info-value">${app.owner}</span>
                        </div>
                        <div class="app-info-item">
                            <span class="app-info-label">Version:</span>
                            <span class="app-info-value">${app.version}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Utility functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

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

// Test document persistence
async function testDocumentPersistence() {
    try {
        const response = await fetch('/api/health');
        const health = await response.json();
        console.log('System Health:', health);
        console.log(`Applications: ${health.applications}, Documents: ${health.documents}`);
    } catch (error) {
        console.error('Health check failed:', error);
    }
}

// Run health check on load
setTimeout(testDocumentPersistence, 1000);