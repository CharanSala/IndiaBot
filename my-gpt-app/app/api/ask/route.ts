import { GoogleGenerativeAI } from "@google/generative-ai";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { ChromaClient } from "chromadb";

async function generateWithRetry(model: any, prompt: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await model.generateContent(prompt);
    } catch (err: any) {
      if (err.message?.includes("503") && i < retries - 1) {
        console.warn(`Retrying... attempt ${i + 2}`);
        await new Promise((res) => setTimeout(res, 2000));
      } else {
        throw err;
      }
    }
  }
}

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    if (!question) {
      return new Response(JSON.stringify({ error: "Question is required" }), {
        status: 400,
      });
    }

    // 1️⃣ Convert question to embedding
    const embeddings = new HuggingFaceInferenceEmbeddings({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      apiKey: process.env.HUGGINGFACE_API_KEY,
    });
    const questionVector = await embeddings.embedQuery(question);

    // 2️⃣ Query ChromaDB
    const client = new ChromaClient();
    const collection = await client.getOrCreateCollection({
      name: "india_history",
    });

    const results = await collection.query({
      queryEmbeddings: [questionVector],
      nResults: 3,
      include: ["metadatas", "documents"],
    });

    const relevantTexts = results.metadatas[0]
      .map((m: any) => m.text)
      .join("\n");

    // 3️⃣ Generate answer using Google Gemini AI
    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GEMINI_API_KEY!
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a historian AI. Answer questions strictly using the content below.
If the answer is not found, respond exactly with:
"Sorry, I can't answer this question."

Content:
${relevantTexts}

Question:
${question}
`;

    const result = await generateWithRetry(model, prompt);
    const responseText = result.response.text();

    return new Response(JSON.stringify({ answer: responseText }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
