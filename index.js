// rag_courses.js
import fs from "fs";
import express from "express";
import bodyParser from "body-parser";
import { pipeline } from "@xenova/transformers";
import { Ollama } from "ollama";
import cors from "cors";

// 1. Load courses.json
const courseData = JSON.parse(fs.readFileSync("courses.json", "utf-8"));

// 2. Load embedding model
const embedder = await pipeline(
  "feature-extraction",
  "Xenova/all-MiniLM-L6-v2"
);

// Helper: generate embedding for text
async function embed(text) {
  const output = await embedder(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}

// 3. Create comprehensive course context string
function createCourseContextString(course) {
  const contextParts = [
    `Course: ${course}`,
  ];
  return contextParts.join('\n');
}

// Create the complete course context as a single string
const courseContextString = createCourseContextString(courseData);
const courseVector = await embed(courseContextString);

console.log(`✅ Course indexed: "${courseData}"`);
console.log(`📝 Context length: ${courseContextString.length} characters`);

// Cosine similarity
function cosineSim(a, b) {
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

// 4. Initialize Ollama client
const ollama = new Ollama({ host: 'http://localhost:11434' });

// Function to call Ollama locally with better error handling
async function queryOllama(prompt, model = 'llama3.1') {
  try {
    const response = await ollama.chat({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      stream: false
    });
    return response.message.content.trim();
  } catch (error) {
    console.error('Ollama query failed:', error.message);
    throw new Error(`LLM query failed: ${error.message}`);
  }
}

// 5. Setup Express server
const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173", // React dev server
    methods: ["GET", "POST"],
  })
);

// Enhanced similarity search function
function findSimilarCourses(queryVector, topK = 5, threshold = 0.3) {
  const similarity = cosineSim(queryVector, courseVector);

  if (similarity > threshold) {
    return [{
      id: courseData,
      title: courseData,
      score: similarity,
      text: courseContextString
    }];
  }

  return [];
}

// Enhanced RAG endpoint with better error handling
app.get("/ask", async (req, res) => {
  const { q: query, model = 'llama3.1' } = req.query;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({
      error: "Please provide a valid query parameter ?q=your_question"
    });
  }

  const startTime = Date.now();
  console.log(`📝 Processing query: "${query}"`);

  try {
    // Generate query embedding
    const queryVector = await embed(query);

    // Find similar courses with dynamic threshold
    const similarCourses = findSimilarCourses(queryVector, 5, 0.2);

    let answer, mode, usedContext = [];
    const courseRelevanceThreshold = 0.3;

    if (similarCourses.length > 0 && similarCourses[0].score > courseRelevanceThreshold) {
      // Course-relevant query - provide answer using course context
      const context = similarCourses[0].text;

      const prompt = `You are an expert course advisor. Answer the student's question using ONLY the provided course information.

Course Information:
${context}

Student Question: ${query}

Provide a helpful, specific answer based on the course content. If the question cannot be answered with the given course information, say "I'm sorry, I cannot answer that question based on the available course content."`;

      answer = await queryOllama(prompt, model);
      mode = "Course-Specific";
      usedContext = [similarCourses[0]];

    } else {
      // Query not relevant to course content
      answer = "I'm sorry, I cannot answer that question. I can only provide information about the available course content.";
      mode = "Not Course-Related";
    }

    const processingTime = Date.now() - startTime;
    console.log(`✅ Query processed in ${processingTime}ms using ${mode}`);

    res.json({
      question: query,
      answer: answer.trim(),
      mode,
      processingTimeMs: processingTime,
      similarCourses: similarCourses.slice(0, 5).map(course => ({
        id: course.id,
        title: course.title,
        similarity: Math.round(course.score * 100) / 100,
        used: usedContext.some(used => used.id === course.id)
      })),
      metadata: {
        totalCourses: 1,
        model: model,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`❌ Query failed after ${processingTime}ms:`, error.message);

    res.status(500).json({
      error: "Failed to process query",
      details: error.message,
      processingTimeMs: processingTime
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    coursesLoaded: 1,
    timestamp: new Date().toISOString(),
    endpoints: {
      ask: "GET /ask?q=your_question&model=llama3.1",
      health: "GET /health"
    }
  });
});

// 6. Start server with enhanced logging
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Enhanced RAG server running at http://localhost:${PORT}`);
  console.log(`📚 Loaded 1 course`);
  console.log(`🔍 Available endpoints:`);
  console.log(`   - GET /ask?q=your_question`);
  console.log(`   - GET /health`);
});
