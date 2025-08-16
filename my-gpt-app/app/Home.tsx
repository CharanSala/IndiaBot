"use client";
import { useState, useEffect, useRef } from "react";

export default function HomePage() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    { type: "user" | "bot"; text: string }[]
  >([]);
  const [typing, setTyping] = useState(false);
  const botTypingInterval = useRef<NodeJS.Timeout | null>(null);

  const handleSend = async () => {
    if (!question.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { type: "user", text: question }]);
    setQuestion("");
    setLoading(true);
    setTyping(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      const answer = data.answer || "No answer found";

      let index = 0;
      setMessages((prev) => [...prev, { type: "bot", text: "" }]);
      setTyping(false);

      botTypingInterval.current = setInterval(() => {
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];

          const words = answer.split(" "); // split once
          if (!lastMessage.text) lastMessage.text = "";

          if (index < words.length) {
            lastMessage.text += (lastMessage.text ? " " : "") + words[index];
            index++; // move to next word
          } else {
            // all words typed, stop interval
            if (botTypingInterval.current)
              clearInterval(botTypingInterval.current);
            setTyping(false);
            setLoading(false);
          }

          return newMessages;
        });
      }, 200); // adjust speed as needed
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Error fetching answer" },
      ]);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  bg-neutral-300">
      <div className="bg-white h-screen w-96 flex flex-col justify-between mx-auto">
        {/* Header */}
        <h1 className="text-3xl flex justify-center text-red-800 font-bold mb-6 mt-4">
          Ask about India
        </h1>

        {/* Messages */}
        <div className="flex-1 flex flex-col w-full px-4 overflow-y-auto space-y-2 mb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg max-w-[80%] break-words ${
                msg.type === "user"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-200 text-black self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {typing && (
            <div className="p-3 rounded-lg max-w-[80%] bg-gray-200 text-black self-start">
              Typing...
            </div>
          )}
        </div>

        {/* Input at bottom inside parent div */}
        <div className="flex w-full px-4 mb-4">
          <input
            type="text"
            placeholder="Type your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="border p-2 rounded-l w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
