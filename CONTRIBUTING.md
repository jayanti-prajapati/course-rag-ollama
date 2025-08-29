# Contributing to Course RAG Ollama

Thank you for your interest in contributing to the Course RAG Ollama project! 🎉

## 🚀 Quick Start

1. **Fork** the repository
2. **Clone** your fork locally
3. **Install** dependencies: `npm install`
4. **Start** Ollama: `ollama serve`
5. **Run** the project: `npm start`

## 🛠️ Development Setup

### Prerequisites
- Node.js 16+
- Ollama installed locally
- Git

### Local Development
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/course-rag-ollama.git
cd course-rag-ollama

# Install dependencies
npm install

# Start Ollama service
ollama serve

# Download required model
ollama pull llama3.1

# Start development server
npm run dev
```

## 📝 How to Contribute

### 1. Course Data Contributions
- Add new courses to `courses.json`
- Follow the existing format:
```json
{
  "id": "unique-course-id",
  "title": "Course Title",
  "description": "Detailed description with learning objectives...",
  "topics": ["topic1", "topic2"],
  "difficulty": "beginner|intermediate|advanced"
}
```

### 2. Code Contributions
- **Bug fixes**: Create an issue first, then submit a PR
- **New features**: Discuss in issues before implementing
- **Documentation**: Always welcome!

### 3. Testing Your Changes
```bash
# Test basic functionality
npm run health

# Test with sample queries
curl "http://localhost:3001/ask?q=test%20query"

# Verify course indexing
curl "http://localhost:3001/health"
```

## 📋 Contribution Guidelines

### Code Style
- Use ES6+ features
- Follow existing code formatting
- Add comments for complex logic
- Use descriptive variable names

### Commit Messages
Use conventional commits:
```
feat: add new course recommendation algorithm
fix: resolve embedding generation issue
docs: update API documentation
test: add unit tests for similarity search
```

### Pull Request Process
1. **Create a branch**: `git checkout -b feature/your-feature-name`
2. **Make changes** with clear, focused commits
3. **Test thoroughly** - ensure all endpoints work
4. **Update documentation** if needed
5. **Submit PR** with clear description

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Tested locally
- [ ] All endpoints working
- [ ] Course indexing verified

## Checklist
- [ ] Code follows project style
- [ ] Self-review completed
- [ ] Documentation updated
```

## 🐛 Reporting Issues

### Bug Reports
Include:
- **Environment**: OS, Node.js version, Ollama version
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Error logs** (if any)
- **Sample query** that fails

### Feature Requests
Include:
- **Use case**: Why is this needed?
- **Proposed solution**
- **Alternative solutions considered**
- **Additional context**

## 🏷️ Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to docs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `question` - Further information requested

## 🔧 Development Tips

### Adding New Models
```javascript
// In index.js, update the model validation
const supportedModels = ['llama3.1', 'phi3:mini', 'your-new-model'];
```

### Improving Embeddings
- Experiment with different embedding models
- Adjust similarity thresholds
- Test with various query types

### Performance Optimization
- Profile embedding generation time
- Optimize vector similarity calculations
- Consider caching strategies

## 🧪 Testing

### Manual Testing
```bash
# Health check
curl http://localhost:3001/health

# Course-specific query
curl "http://localhost:3001/ask?q=react%20basics"

# General query (should fallback)
curl "http://localhost:3001/ask?q=weather%20today"
```

### Adding Test Cases
We welcome contributions to add automated testing:
- Unit tests for embedding functions
- Integration tests for API endpoints
- Performance benchmarks

## 📚 Resources

- [Ollama Documentation](https://ollama.ai/docs)
- [Transformers.js Guide](https://huggingface.co/docs/transformers.js)
- [Express.js Documentation](https://expressjs.com/)
- [RAG System Concepts](https://arxiv.org/abs/2005.11401)

## 🤝 Community

- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Report bugs and request features
- **PRs**: Submit code contributions

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributor graphs

---

**Questions?** Feel free to open an issue or start a discussion. We're here to help! 🚀
