Personal India Bot

A chatbot about India that answers questions on Indian history, culture, politics, leaders, and more. The bot uses chunked content and vector embeddings to provide accurate answers from a knowledge base, with a realistic chat UI and typing effect similar to ChatGPT.

Features

Ask questions about India’s history, culture, politics, and leaders.

Real-time typing effect — bot answers appear word by word.

Light-themed responsive UI with user and bot messages styled differently.

Input box and send button fixed at the bottom of the chat container.

Smooth scrolling for long conversations.

Handles async API calls with Promises and await.

Intelligent retrieval of answers using embeddings and vector database (ChromaDB/FAISS).

How it Works

Split content into chunks

Large content about India (history, leaders, politics, etc.) is split into manageable text chunks using a text splitter.

Generate embeddings

Each chunk is converted into an embedding vector using an embedding model (e.g., HuggingFace).

Store embeddings in a vector database

Chunks and their embeddings are stored in ChromaDB or FAISS for similarity search.

User question → embedding

When a user asks a question, it is converted into an embedding vector.

Retrieve relevant chunks

The system performs a similarity search in the vector database to find the most relevant chunks.

Generate answer

The retrieved chunks are fed to the AI model to generate an accurate answer, which is displayed with typing animation in the chat UI.

Tech Stack

Frontend: Next.js, React, TypeScript, Tailwind CSS

Backend: Next.js API routes / Node.js

Database: Vector database using ChromaDB or FAISS

Features:

Typing effect using setInterval and state updates

Async API calls with Promises and await

Dynamic message rendering for user and bot

Getting Started
1. Clone the repository
git clone https://github.com/your-username/personal-india-bot.git
cd personal-india-bot

2. Install dependencies
npm install
# or
yarn install

3. Run the development server
npm run dev
# or
yarn dev


Open http://localhost:3000 to view your chatbot.

Project Structure
/app
  ├─ /api
  │    └─ ask.ts          # API route to handle user questions
  ├─ page.tsx             # Main chat UI page
  └─ components
       └─ ChatMessage.tsx # Optional chat message component

/vectorDB
  ├─ storeEmbeddings.ts    # Generate embeddings & store in ChromaDB or FAISS
  └─ retrieveChunks.ts     # Retrieve relevant chunks based on user question

/public
  └─ assets               # Static assets

Future Improvements

Add voice input/output for interactive chatting.

Integrate with LLMs for more advanced AI responses.

Add multi-language support for regional Indian languages.

Improve UI with better chat bubbles, animations, and emojis.
