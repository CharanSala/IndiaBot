PERSONAL INDIA CHATBOT

Personal India Bot is a chatbot about India that answers questions on Indian history, culture, politics, leaders, and more. It uses chunked content and vector embeddings to provide accurate answers from a knowledge base. The chat UI is realistic, with a typing effect similar to ChatGPT.

FEATURES

The bot allows users to ask questions about India’s history, culture, politics, and leaders. It shows bot responses in real-time, word by word, creating a natural conversation flow. The interface is light-themed and responsive, with user and bot messages styled differently. The input box and send button remain fixed at the bottom of the chat container, and long conversations support smooth scrolling.

The backend handles async operations using Promises and await and intelligently retrieves answers using embeddings and a vector database such as ChromaDB or FAISS.

HOW IT WORKS

1. Large content about India is split into manageable text chunks.

2. Each chunk is converted into an embedding vector using a model like HuggingFace.

3. The chunks and embeddings are stored in a vector database for similarity search.

4. When a user asks a question, it is converted into an embedding vector.

5. The system performs a similarity search in the database to find the most relevant chunks.

6. The retrieved chunks are sent to the AI model, which generates an accurate answer. The bot displays this answer using a typing animation in the chat UI.

Tech Stack

Frontend: Next.js, React, TypeScript, Tailwind CSS
Backend: Next.js API routes or Node.js
Database: Vector database (ChromaDB or FAISS)
Features: Typing effect using setInterval, async API calls with Promises and await, and dynamic message rendering for both user and bot.
