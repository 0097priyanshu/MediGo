import { RequestHandler } from "express";

export const handleChat: RequestHandler = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "missing message" });

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (OPENAI_KEY) {
      // Proxy to OpenAI Chat completions (if key provided)
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a helpful assistant for a medicine delivery app." },
            { role: "user", content: message },
          ],
          max_tokens: 300,
        }),
      });
      const data = await resp.json();
      const text = data?.choices?.[0]?.message?.content ?? data?.error?.message ?? "Sorry, I couldn't get a response.";
      return res.json({ reply: text });
    }

    // Fallback simple rule-based responses
    const lower = message.toLowerCase();
    let reply = "I'm here to help! You can ask about order status, payments or returns.";
    if (lower.includes("order")) reply = "To track your order, go to Orders → Track Order and enter your order id.";
    if (lower.includes("payment")) reply = "We support Razorpay. You can pay from the cart using the Pay button.";
    if (lower.includes("chat")) reply = "This chat supports basic help; provide details and we'll assist.";

    return res.json({ reply });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: "chat failed" });
  }
};
