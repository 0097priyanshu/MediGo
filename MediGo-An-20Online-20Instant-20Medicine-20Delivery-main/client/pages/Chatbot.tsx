import { Layout } from "@/components/Layout";
import { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState<Array<{ from: "user" | "bot"; text: string }>>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text }) });
      const d = await res.json();
      const reply = d.reply ?? d.error ?? "Sorry, no response.";
      setMessages((m) => [...m, { from: "bot", text: reply }]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setMessages((m) => [...m, { from: "bot", text: "There was an error processing your message." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Help Assistant</h1>

        <div className="border rounded-lg p-4 mb-4 h-[60vh] overflow-auto space-y-3">
          {messages.length === 0 && <div className="text-muted-foreground">Ask me about orders, payments or medicines.</div>}
          {messages.map((m, i) => (
            <div key={i} className={m.from === "user" ? "text-right" : "text-left"}>
              <div className={`inline-block p-3 rounded-lg ${m.from === "user" ? "bg-primary text-white" : "bg-muted/80 text-foreground"}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 px-4 py-2 border rounded" placeholder="Type your question..." />
          <button onClick={send} disabled={loading} className="bg-primary text-white px-4 py-2 rounded">{loading ? "Sending..." : "Send"}</button>
        </div>
      </div>
    </Layout>
  );
}
