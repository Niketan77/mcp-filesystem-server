# MCP Filesystem Server

> A complete **Model Context Protocol (MCP) server** implementation for filesystem operations with AI-powered file editing capabilities.

## Demo Video: 
https://drive.google.com/file/d/18sCyVpAekMkDgUfsKi423VfPN6Rbuj9T/view?usp=drive_link

## 📋 Description

This project was built to fulfill the following requirements:

### Implemented:
1. **Implement a true Model Context Protocol (MCP) server** for filesystem operations
2. **Create file management tools** supporting create, edit, and delete operations
3. **Develop an MCP client** that communicates using proper MCP protocol
4. **Build a simple frontend application** for user interaction
5. **Enable folder upload functionality** for batch file management  
6. **Implement a prompt box** for AI-powered file editing using natural language

## 🎯 Project Overview

This implementation demonstrates a complete MCP ecosystem:
- **True MCP Protocol**: JSON-RPC 2.0 compliant server with proper tool registration
- **AI Integration**: Mixtral-8x7B-Instruct model for intelligent file editing
- **Modern Frontend**: Clean, responsive web interface with professional UX
- **File Management**: Complete CRUD operations for filesystem management
- **Download System**: Individual file downloads and bulk ZIP export

## 🏗️ Technical Architecture

### MCP Protocol Implementation
```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│Web Frontend │ ←→ │ Flask Bridge │ ←→ │ MCP Client  │ ←→ │ MCP Server  │ ←→ │ AI Service  │
│             │    │              │    │             │    │             │    │             │
│File Upload  │    │ REST API     │    │JSON-RPC 2.0 │    │ File Ops    │    │ AI Editing  │
│User Actions │    │ CORS Enabled │    │ Protocol    │    │ Tool Reg.   │    │ Mixtral-8x7B│
│Notifications│    │ File Serving │    │ stdio comm  │    │ Validation  │    │ Together AI │
└─────────────┘    └──────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Component Breakdown

1. **MCP Server** (`server/mcp_server.py`)
   - True JSON-RPC 2.0 protocol implementation
   - Tool registration and capability advertisement
   - File operation handlers with validation
   - AI integration for intelligent editing

2. **MCP Client** (`server/mcp_client.py`)
   - Protocol-compliant communication layer
   - Request/response handling with proper error management
   - Subprocess communication via stdio

3. **Flask Bridge** (`server/mcp_bridge.py`)
   - REST API endpoints for frontend communication
   - File upload/download handling
   - CORS configuration for cross-origin requests
   - Error handling and response formatting

4. **Frontend** (`frontend/`)
   - Modern HTML5/CSS3/JavaScript interface
   - Responsive design with professional styling
   - Real-time file management and notifications

## 📁 Project Structure

```
mcp-filesystem-server/
├── run.py                    # Main entry point
├── requirements.txt          # Dependencies
├── .env.example             # Environment configuration
├── server/
│   ├── mcp_server.py        # Core MCP server (JSON-RPC 2.0)
│   ├── mcp_client.py        # MCP protocol client
│   ├── mcp_bridge.py        # Flask bridge for frontend
│   └── tools/               # MCP tool implementations
├── frontend/                # Web interface
│   ├── index.html          # Main UI
│   ├── scripts/app.js      # Frontend logic
│   └── styles/main.css     # Styling
├── uploaded_files/          # File storage directory
└── test_mcp.py             # MCP protocol tests
```

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.7+** installed on your system
- **pip** package manager
- **Together AI API key** (optional, for AI editing features)

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Niketan77/mcp-filesystem-server.git
   cd mcp-filesystem-server
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your Together AI API key (optional)
   # TOGETHER_AI_API_KEY=your_api_key_here
   ```

5. **Run the server:**
   ```bash
   python run.py
   ```

6. **Access the application:**
   - Open your browser and navigate to: `http://localhost:5000`
   - The frontend interface will load automatically

### Getting Together AI API Key (Optional)
1. Visit [Together AI](https://together.ai) and sign up
2. Navigate to your dashboard and generate an API key or (https://api.together.ai/settings/api-keys)
3. create key and copy it
4. Add the key to your `.env` file:
   ```
   TOGETHER_AI_API_KEY=your_actual_api_key_here
   ```

## 🔧 MCP Tools Available

The server implements these MCP tools:

| Tool | Description | Parameters |
|------|-------------|------------|
| `create_file` | Create a new file | `filename`, `content` |
| `edit_file` | Edit file (manual or AI) | `filename`, `content`/`prompt`, `use_ai` |
| `delete_file` | Delete a file | `filename` |
| `read_file` | Read file content | `filename` |

## 🧪 Testing & Verification

### Automated Tests
Run the comprehensive MCP protocol test suite:
```bash
python test_mcp.py
```

This test verifies:
- ✅ MCP server startup and initialization
- ✅ Tool discovery and registration (5 tools)
- ✅ File creation, reading, editing, and deletion
- ✅ AI-powered editing functionality
- ✅ JSON-RPC 2.0 protocol compliance
- ✅ Error handling and edge cases

### Manual Testing
1. **Upload Test**: Upload various file types and folder structures
2. **Edit Test**: Use AI prompts to modify files
3. **Download Test**: Test individual and bulk downloads
4. **UI Test**: Verify notifications, responsive design, and user flow

### Expected Test Output
```
🔬 MCP Filesystem Server Test Suite
🧪 Testing MCP Filesystem Server...
==================================================
1. Starting MCP server... ✅
2. Testing tool discovery... ✅ Found 5 tools
3. Testing file creation... ✅
4. Testing file reading... ✅
5. Testing file listing... ✅
6. Testing manual file editing... ✅
7. Testing AI-powered editing... ✅
8. Testing file deletion... ✅
9. Verifying file deletion... ✅
==================================================
🎉 All MCP tests passed successfully!
```

## � How to Use

### 1. Upload Files
- **Folder Upload**: Click "Click to select folder" to upload entire directory structures
- **Individual Files**: Use "Click to select individual files" for specific files
- **Drag & Drop**: Simply drag files or folders onto the upload areas

### 2. File Management
- **Browse Files**: View all uploaded files in the file browser
- **File Count**: See total number of files in the header
- **Delete Files**: Remove individual files or delete all files at once

### 3. Edit Files with AI
- Click **"Edit"** on any file to open the editor
- Enter a **natural language prompt** describing your desired changes:
  - *"Add comments to this code"*
  - *"Fix any syntax errors"*
  - *"Convert this to TypeScript"*
  - *"Optimize this function for performance"*
- Click **"Apply AI Edit"** and watch the AI modify your file
- **Review and save** the changes

### 4. Manual File Editing
- Open any file in the editor
- Modify content directly in the text area
- Click **"Save"** to apply changes

### 5. Download Files
- **Individual Files**: Click the download icon (📥) next to any file
- **Bulk Download**: Use "📦 Download All as ZIP" to get all files in a ZIP archive
- **Current File**: Download the currently open file from the editor

## 🎨 Features Showcase

### File Operations
- **Smart Upload**: Handles both folders and individual files
- **File Type Support**: Text files, code files, configuration files, and more
- **Size Validation**: Configurable file size limits (default: 10MB)
- **Progress Feedback**: Real-time upload and operation status

### AI Integration
- **Natural Language Editing**: Describe changes in plain English
- **Mixtral Model**: Powered by Mixtral-8x7B-Instruct for high-quality results
- **Context Aware**: AI understands file types and provides appropriate modifications


### Supported File Types

The application supports text-based files including:

| Category | Extensions |
|----------|------------|
| **Code Files** | `.py`, `.js`, `.ts`, `.html`, `.css`, `.java`, `.cpp`, `.c`, `.h`, `.php`, `.rb`, `.go`, `.rs` |
| **Data Files** | `.txt`, `.md`, `.csv`, `.json`, `.xml`, `.yaml`, `.yml`, `.toml` |
| **Config Files** | `.ini`, `.cfg`, `.conf`, `.env`, `.gitignore`, `.dockerignore` |
| **Scripts** | `.sh`, `.bat`, `.ps1`, `.fish`, `.zsh` |
| **Documentation** | `.rst`, `.tex`, `.wiki` |
| **Logs** | `.log`, `.out`, `.err` |

### Configuration Limits

| Setting | Default | Description |
|---------|---------|-------------|
| **File Size** | 10MB | Maximum individual file size |
| **Upload Limit** | Unlimited | No limit on number of files |
| **AI Timeout** | 30s | Maximum time for AI operations |
| **Session Storage** | Local | Files stored in `uploaded_files/` |

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/Niketan77/mcp-filesystem-server.git`
3. Create a virtual environment: `python -m venv venv`
4. Install dependencies: `pip install -r requirements.txt`
5. Create a feature branch: `git checkout -b feature-name`

### Making Changes
1. **Backend**: Modify files in `server/` directory
2. **Frontend**: Update files in `frontend/` directory  
3. **Tests**: Add tests for new features
4. **Documentation**: Update README if needed

### Pull Request Process
1. Run tests: `python test_mcp.py`
2. Commit changes: `git commit -m "Add feature description"`
3. Push to fork: `git push origin feature-name`
4. Create pull request with detailed description

### Code Style
- Follow PEP 8 for Python code
- Use meaningful variable names
- Add comments for complex logic
- Maintain consistent indentation

⭐ **If you find this project helpful, please consider giving it a star on GitHub!**
