import { CharacterTextSplitter } from "langchain/text_splitter";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { ChromaClient } from "chromadb";
import { indiaHistory } from "@/data/indiaData";

export async function POST(req: Request) {
  try {
    // 1️⃣ Split text into chunks
    const splitter = new CharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });
    const chunks = await splitter.splitText(indiaHistory);

    // 2️⃣ Create embeddings
    const embeddings = new HuggingFaceInferenceEmbeddings({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      apiKey: process.env.HUGGINGFACE_API_KEY,
    });

    const chunkEmbeddings = await Promise.all(
      chunks.map(async (text) => ({
        text,
        vector: await embeddings.embedQuery(text),
      }))
    );

    // 3️⃣ Initialize ChromaDB
    const client = new ChromaClient({ path: "http://localhost:8000" });
    const collection = await client.getOrCreateCollection({
      name: "india_history",
    });

    // 4️⃣ Add chunks
    for (let i = 0; i < chunkEmbeddings.length; i++) {
      await collection.add({
        ids: [`chunk-${i}`],
        embeddings: [chunkEmbeddings[i].vector],
        metadatas: [{ text: chunkEmbeddings[i].text }],
        documents: [chunkEmbeddings[i].text],
      });
    }

    return new Response(
      JSON.stringify({ message: "Chunks stored successfully!" }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to store chunks" }), {
      status: 500,
    });
  }
}
