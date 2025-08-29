# 🎓 Course RAG System with Local LLM

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-brightgreen)](https://nodejs.org/)
[![Ollama](https://img.shields.io/badge/Ollama-Compatible-blue)](https://ollama.ai/)
[![AI Powered](https://img.shields.io/badge/AI-Powered-purple)](https://github.com/jay/course-rag-ollama)
[![Open Source](https://img.shields.io/badge/Open%20Source-❤️-red)](https://github.com/jay/course-rag-ollama)

> 🚀 **A powerful Retrieval-Augmented Generation (RAG) system that combines local course data with Ollama LLM for intelligent, privacy-first course recommendations and Q&A.**

**⭐ If you find this project helpful, please give it a star! ⭐**

## 🚀 Features

- **Local LLM Integration**: Uses Ollama with llama3.1 for private, offline AI responses
- **Course-Specific RAG**: Semantic search through course catalog with confidence-based routing
- **Multi-tier Response System**: 
  - High confidence: Course-specific answers
  - Medium confidence: Hybrid responses
  - Low confidence: General knowledge fallback
- **Real-time Embeddings**: Uses Xenova transformers for semantic similarity
- **Enhanced API**: Detailed responses with similarity scores and processing metrics

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **macOS/Linux** (for Ollama installation)
- **4GB+ RAM** (recommended for LLM models)

## 🛠️ Installation & Setup

### Step 1: Install Ollama

**For macOS:**
```bash
# Method 1: Official installer
curl -fsSL https://ollama.com/install.sh | sh

# Method 2: Homebrew
brew install ollama
```

**For Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Step 2: Start Ollama Service

```bash
# Start Ollama service (keep this running)
ollama serve
```

The service will run on `http://localhost:11434`

### Step 3: Download LLM Model

In a **new terminal window**:
```bash
# Download llama3.1 model (this will take several minutes)
ollama pull llama3.1

# Verify installation
ollama list

# Test the model
ollama run llama3.1 "Hello, how are you?"
```

**Note**: The model download is ~4.9GB and may take 10-15 minutes depending on your internet speed.

### Step 4: Install Project Dependencies

```bash
# Navigate to project directory
cd /path/to/course-rag/backend

# Install Node.js dependencies
npm install
# or
yarn install
```

### Step 5: Start the RAG Server

```bash
# Start the RAG server
node index.js
```

You should see:
```
✅ 5 courses indexed into memory with enhanced embeddings
🚀 Enhanced RAG server running at http://localhost:3001
📚 Loaded 5 courses
🔍 Available endpoints:
   - GET /ask?q=your_question
   - GET /health
```

## 🔧 Usage

### Basic Query
```bash
curl "http://localhost:3001/ask?q=what%20is%20react"
```

### Query with Specific Model
```bash
curl "http://localhost:3001/ask?q=how%20to%20learn%20nodejs&model=llama3.1"
```

### Health Check
```bash
curl "http://localhost:3001/health"
```

## 📡 API Endpoints

### `GET /ask`

Query the RAG system with course-related questions.

**Parameters:**
- `q` (required): Your question
- `model` (optional): LLM model to use (default: `llama3.1`)

**Example Response:**
```json
{
  "question": "what is react",
  "answer": "React is a JavaScript library for building user interfaces...",
  "mode": "Course-Specific (High Confidence)",
  "processingTimeMs": 1247,
  "similarCourses": [
    {
      "id": 1,
      "title": "React Basics",
      "similarity": 0.89,
      "used": true
    }
  ],
  "metadata": {
    "totalCourses": 5,
    "model": "llama3.1",
    "timestamp": "2025-08-29T12:14:53.000Z"
  }
}
```

### `GET /health`

Check system status and configuration.

**Example Response:**
```json
{
  "status": "healthy",
  "coursesLoaded": 5,
  "timestamp": "2025-08-29T12:14:53.000Z",
  "endpoints": {
    "ask": "GET /ask?q=your_question&model=llama3.1",
    "health": "GET /health"
  }
}
```

## 🧠 How It Works

### 1. Course Indexing
- Loads course data from `courses.json`
- Creates enhanced text representations with titles, descriptions, and topics
- Generates embeddings using `Xenova/all-MiniLM-L6-v2`

### 2. Query Processing
- Converts user query to embedding vector
- Performs cosine similarity search against course vectors
- Routes to appropriate response mode based on confidence scores

### 3. Response Modes

| Mode | Confidence Threshold | Behavior |
|------|---------------------|----------|
| **Course-Specific** | > 0.45 | Uses top 3 matching courses for context |
| **Hybrid** | 0.25 - 0.45 | Combines course data with general knowledge |
| **General Knowledge** | < 0.25 | Pure LLM response without course context |

## 📁 Project Structure

```
course-rag/backend/
├── index.js           # Main RAG server
├── package.json       # Dependencies
├── courses.json       # Course catalog data
├── README.md          # This file
└── node_modules/      # Dependencies
```

## 🔧 Configuration

### Environment Variables
```bash
# Optional: Set custom port
export PORT=3001

# Optional: Set Ollama host
export OLLAMA_HOST=http://localhost:11434
```

### Course Data Format
Edit `courses.json` to add your own courses:
```json
[
  {
    "id": 1,
    "title": "Course Title",
    "description": "Detailed course description with learning objectives..."
  }
]
```

## 🐛 Troubleshooting

### Common Issues

**1. "LLM query failed: fetch failed"**
- Ensure Ollama service is running: `ollama serve`
- Check if model is downloaded: `ollama list`
- Verify Ollama is accessible: `curl http://localhost:11434`

**2. "403 Forbidden" on port 5000**
- macOS AirPlay uses port 5000. The project now uses port 3001.
- If needed, change port in `index.js`: `const PORT = 3002;`

**3. Model download interrupted**
- Resume download: `ollama pull llama3.1`
- Try smaller model: `ollama pull llama3.2:1b`

**4. Out of memory errors**
- Use smaller model: `ollama pull phi3:mini`
- Close other applications
- Increase system RAM if possible

### Performance Tips

- **Faster responses**: Use `phi3:mini` or `llama3.2:1b`
- **Better accuracy**: Use `llama3.1:70b` (requires 16GB+ RAM)
- **GPU acceleration**: Install CUDA drivers for NVIDIA GPUs

## 🔄 Alternative Models

```bash
# Lightweight models (faster, less accurate)
ollama pull phi3:mini          # ~2GB
ollama pull llama3.2:1b        # ~1GB

# Balanced models
ollama pull llama3.1           # ~5GB (default)
ollama pull llama3.2:3b        # ~2GB

# High-performance models (slower, more accurate)
ollama pull llama3.1:70b       # ~40GB
ollama pull codellama          # ~7GB (code-focused)
```

## 🚀 Quick Start Commands

```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Download model (one-time setup)
ollama pull llama3.1

# Terminal 3: Start RAG server
cd course-rag/backend
node index.js

# Terminal 4: Test the system
curl "http://localhost:3001/ask?q=what%20courses%20are%20available"
```

## 📝 Example Queries

```bash
# Course-specific queries
curl "http://localhost:3001/ask?q=how%20to%20learn%20React"
curl "http://localhost:3001/ask?q=what%20is%20covered%20in%20Node.js%20course"
curl "http://localhost:3001/ask?q=full%20stack%20development%20path"

# General queries (fallback mode)
curl "http://localhost:3001/ask?q=what%20is%20machine%20learning"
curl "http://localhost:3001/ask?q=best%20programming%20practices"
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

**Quick Start:**
1. Fork the repository
2. Add new courses to `courses.json`
3. Test with various queries
4. Submit a pull request

## 📊 Project Stats

- **Language**: JavaScript (Node.js)
- **AI Model**: Ollama + Xenova Transformers
- **License**: MIT
- **Status**: Active Development

## 🌟 Show Your Support

If this project helped you, please:
- ⭐ **Star this repository**
- 🍴 **Fork it** for your own projects
- 📢 **Share it** with others
- 🐛 **Report issues** to help improve it
- 💡 **Suggest features** for future development

## 📄 License

MIT License - feel free to use and modify for your projects. See [LICENSE](LICENSE) for details.

## 🔗 Links

- **Repository**: [GitHub](https://github.com/jay/course-rag-ollama)
- **Issues**: [Report Bugs](https://github.com/jay/course-rag-ollama/issues)
- **Discussions**: [Community](https://github.com/jay/course-rag-ollama/discussions)
- **Ollama**: [Official Website](https://ollama.ai/)

---

**Need help?** Check the troubleshooting section or [open an issue](https://github.com/jay/course-rag-ollama/issues) with your error logs and system information.
