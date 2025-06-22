// frontend/scripts/app.js

class FilesystemApp {
    constructor() {
        this.currentFile = null;
        this.files = [];
        this.aiServiceAvailable = false;
        this.initializeEventListeners();
        this.loadFiles();
        this.checkAIService();
    }

    async checkAIService() {
        try {
            const response = await fetch('/api/health');
            const result = await response.json();
            
            if (result.success) {
                this.aiServiceAvailable = result.ai_service === 'available';
                this.updateAIServiceStatus(result);
            }
        } catch (error) {
            console.warn('Could not check AI service status:', error);
            this.aiServiceAvailable = false;
        }
    }

    updateAIServiceStatus(healthData) {
        const aiButton = document.getElementById('apply-ai-edit');
        const promptSection = document.querySelector('.prompt-section');
        
        if (this.aiServiceAvailable) {
            aiButton.disabled = false;
            aiButton.textContent = `Apply AI Edit (${healthData.model})`;
            promptSection.style.opacity = '1';
        } else {
            aiButton.disabled = true;
            aiButton.textContent = 'AI Service Unavailable';
            promptSection.style.opacity = '0.5';
            
            // Add warning message
            const warningDiv = document.createElement('div');
            warningDiv.className = 'ai-warning';
            warningDiv.innerHTML = '⚠️ AI service is not available. Check server logs for API key configuration.';
            warningDiv.style.cssText = 'background: #fed7d7; color: #742a2a; padding: 10px; border-radius: 6px; margin-bottom: 15px;';
            promptSection.insertBefore(warningDiv, promptSection.firstChild);
        }
    }

    initializeEventListeners() {
        // File upload
        const folderUpload = document.getElementById('folder-upload');
        const filesUpload = document.getElementById('files-upload');
        
        folderUpload.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileUpload();
            }
        });
        
        filesUpload.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileUpload(e.target.files);
            }
        });
        
        // File management
        document.getElementById('refresh-files').addEventListener('click', () => this.loadFiles());
        document.getElementById('create-file').addEventListener('click', () => this.showCreateFileModal());
        document.getElementById('download-all').addEventListener('click', () => this.downloadAllFiles());
        document.getElementById('delete-all-files').addEventListener('click', () => this.deleteAllFiles());
        
        // Editor
        document.getElementById('apply-ai-edit').addEventListener('click', () => this.applyAIEdit());
        document.getElementById('save-file').addEventListener('click', () => this.saveFile());
        document.getElementById('close-editor').addEventListener('click', () => this.closeEditor());
        document.getElementById('download-current').addEventListener('click', () => this.downloadCurrentFile());
        
        // Create file modal
        document.getElementById('confirm-create').addEventListener('click', () => this.createNewFile());
        document.getElementById('cancel-create').addEventListener('click', () => this.hideCreateFileModal());
        
        // Drag and drop
        this.setupDragAndDrop();
    }

    setupDragAndDrop() {
        const uploadAreas = document.querySelectorAll('.upload-area');
        
        uploadAreas.forEach(uploadArea => {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                uploadArea.addEventListener(eventName, this.preventDefaults, false);
            });
            
            ['dragenter', 'dragover'].forEach(eventName => {
                uploadArea.addEventListener(eventName, () => uploadArea.classList.add('dragover'), false);
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('dragover'), false);
            });
            
            uploadArea.addEventListener('drop', (e) => {
                const files = e.dataTransfer.files;
                this.handleFileUpload(files);
            }, false);
        });
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    async handleFileUpload(files = null) {
        if (!files) {
            const folderInput = document.getElementById('folder-upload');
            const filesInput = document.getElementById('files-upload');
            files = folderInput.files.length > 0 ? folderInput.files : filesInput.files;
        }
        
        if (files.length === 0) {
            this.showStatus('Please select files to upload', 'error');
            return;
        }

        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('files', file);
        });

        this.showStatus('Uploading files...', 'info');
        
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                const fileCount = result.files.length;
                const fileText = fileCount === 1 ? 'file' : 'files';
                this.showStatus(`Successfully uploaded ${fileCount} ${fileText}`, 'success');
                this.loadFiles();
                // Clear file inputs
                document.getElementById('folder-upload').value = '';
                document.getElementById('files-upload').value = '';
            } else {
                this.showStatus(`Upload failed: ${result.message}`, 'error');
            }
        } catch (error) {
            this.showStatus(`Upload error: ${error.message}`, 'error');
        }
    }

    async loadFiles() {
        try {
            const response = await fetch('/api/files');
            const result = await response.json();
            
            if (result.success) {
                this.files = result.files;
                this.renderFileList();
            } else {
                this.showStatus(`Failed to load files: ${result.message}`, 'error');
            }
        } catch (error) {
            this.showStatus(`Error loading files: ${error.message}`, 'error');
        }
    }

    renderFileList() {
        const fileList = document.getElementById('file-list');
        const fileCount = document.getElementById('file-count');
        
        // Update file count
        const count = this.files.length;
        const fileText = count === 1 ? 'file' : 'files';
        fileCount.textContent = `(${count} ${fileText})`;
        
        if (this.files.length === 0) {
            fileList.innerHTML = '<div class="file-item">No files uploaded yet</div>';
            return;
        }

        fileList.innerHTML = this.files.map(file => `
            <div class="file-item">
                <span class="file-name">${file}</span>
                <div class="file-actions">
                    <button class="btn-download" onclick="app.downloadFile('${file}')">📥</button>
                    <button class="btn-edit" onclick="app.editFile('${file}')">Edit</button>
                    <button class="btn-delete" onclick="app.deleteFile('${file}')">Delete</button>
                </div>
            </div>
        `).join('');
    }

    async editFile(filename) {
        try {
            const response = await fetch(`/api/files/${encodeURIComponent(filename)}`);
            const result = await response.json();
            
            if (result.success) {
                this.currentFile = filename;
                document.getElementById('current-file').textContent = filename;
                document.getElementById('file-content').value = result.content;
                document.getElementById('editor-section').style.display = 'block';
                document.getElementById('ai-prompt').value = '';
                
                // Re-check AI service status when opening editor
                this.checkAIService();
                
                // Scroll to editor
                document.getElementById('editor-section').scrollIntoView({ behavior: 'smooth' });
            } else {
                this.showStatus(`Failed to load file: ${result.message}`, 'error');
            }
        } catch (error) {
            this.showStatus(`Error loading file: ${error.message}`, 'error');
        }
    }

    async applyAIEdit() {
        if (!this.currentFile) {
            this.showStatus('No file selected', 'error');
            return;
        }

        if (!this.aiServiceAvailable) {
            this.showStatus('AI service is not available', 'error');
            return;
        }

        const prompt = document.getElementById('ai-prompt').value.trim();
        if (!prompt) {
            this.showStatus('Please enter an edit prompt', 'error');
            return;
        }

        this.showLoading(true);

        try {
            const response = await fetch('/api/files/edit', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filename: this.currentFile,
                    prompt: prompt,
                    use_ai: true
                })
            });

            const result = await response.json();
            
            if (result.success) {
                document.getElementById('file-content').value = result.new_content;
                this.showStatus('File edited with AI assistance', 'success');
                document.getElementById('ai-prompt').value = '';
            } else {
                this.showStatus(`AI edit failed: ${result.message}`, 'error');
            }
        } catch (error) {
            this.showStatus(`Error applying AI edit: ${error.message}`, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async saveFile() {
        if (!this.currentFile) {
            this.showStatus('No file selected', 'error');
            return;
        }

        const content = document.getElementById('file-content').value;

        try {
            const response = await fetch('/api/files/edit', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filename: this.currentFile,
                    content: content,
                    use_ai: false
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.showStatus('File saved successfully', 'success');
            } else {
                this.showStatus(`Save failed: ${result.message}`, 'error');
            }
        } catch (error) {
            this.showStatus(`Error saving file: ${error.message}`, 'error');
        }
    }

    closeEditor() {
        this.currentFile = null;
        document.getElementById('editor-section').style.display = 'none';
        document.getElementById('file-content').value = '';
        document.getElementById('ai-prompt').value = '';
    }

    async deleteFile(filename) {
        if (!confirm(`Are you sure you want to delete "${filename}"?`)) {
            return;
        }

        try {
            const response = await fetch('/api/files/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filename: filename
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.showStatus('File deleted successfully', 'success');
                this.loadFiles();
                
                if (this.currentFile === filename) {
                    this.closeEditor();
                }
            } else {
                this.showStatus(`Delete failed: ${result.message}`, 'error');
            }
        } catch (error) {
            this.showStatus(`Error deleting file: ${error.message}`, 'error');
        }
    }

    showCreateFileModal() {
        document.getElementById('create-file-modal').style.display = 'flex';
        document.getElementById('new-filename').focus();
    }

    hideCreateFileModal() {
        document.getElementById('create-file-modal').style.display = 'none';
        document.getElementById('new-filename').value = '';
        document.getElementById('new-file-content').value = '';
    }

    async createNewFile() {
        const filename = document.getElementById('new-filename').value.trim();
        const content = document.getElementById('new-file-content').value;

        if (!filename) {
            this.showStatus('Please enter a filename', 'error');
            return;
        }

        try {
            const response = await fetch('/api/files/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filename: filename,
                    content: content
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.showStatus('File created successfully', 'success');
                this.hideCreateFileModal();
                this.loadFiles();
            } else {
                this.showStatus(`Create failed: ${result.message}`, 'error');
            }
        } catch (error) {
            this.showStatus(`Error creating file: ${error.message}`, 'error');
        }
    }

    showStatus(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // Add icon based on type
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        // Create toast content
        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-content">${message}</div>
            <button class="toast-close">×</button>
            <div class="toast-progress"></div>
        `;
        
        // Add close functionality
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.removeToast(toast);
        });
        
        // Add to container
        container.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            this.removeToast(toast);
        }, 5000);
        
        // Start progress bar animation
        const progressBar = toast.querySelector('.toast-progress');
        setTimeout(() => {
            progressBar.style.width = '0%';
        }, 100);
    }
    
    removeToast(toast) {
        if (!toast || !toast.parentNode) return;
        
        toast.classList.add('hide');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    showLoading(show) {
        document.getElementById('loading-overlay').style.display = show ? 'flex' : 'none';
    }

    // Download methods
    async downloadFile(filename) {
        try {
            const response = await fetch(`/api/download/${encodeURIComponent(filename)}`);
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                this.showStatus(`Downloaded ${filename}`, 'success');
            } else {
                this.showStatus(`Download failed for ${filename}`, 'error');
            }
        } catch (error) {
            this.showStatus(`Error downloading ${filename}: ${error.message}`, 'error');
        }
    }

    async downloadCurrentFile() {
        if (this.currentFile) {
            await this.downloadFile(this.currentFile);
        } else {
            this.showStatus('No file is currently open', 'error');
        }
    }

    async downloadAllFiles() {
        try {
            this.showStatus('Preparing download...', 'info');
            const response = await fetch('/api/download/all');
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'all_files.zip';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                this.showStatus('Downloaded all files as ZIP', 'success');
            } else {
                this.showStatus('Download failed', 'error');
            }
        } catch (error) {
            this.showStatus(`Error downloading files: ${error.message}`, 'error');
        }
    }

    async deleteAllFiles() {
        if (this.files.length === 0) {
            this.showStatus('No files to delete', 'error');
            return;
        }

        const fileCount = this.files.length;
        const fileText = fileCount === 1 ? 'file' : 'files';
        
        if (!confirm(`Are you sure you want to delete all ${fileCount} ${fileText}? This action cannot be undone.`)) {
            return;
        }

        try {
            this.showStatus('Deleting all files...', 'info');
            
            for (const filename of this.files) {
                await fetch('/api/files/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        filename: filename
                    })
                });
            }

            this.showStatus('All files deleted successfully', 'success');
            this.loadFiles();
            this.closeEditor();
        } catch (error) {
            this.showStatus(`Error deleting files: ${error.message}`, 'error');
        }
    }
}

// Initialize the app when the page loads
const app = new FilesystemApp();