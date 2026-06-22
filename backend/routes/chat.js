import { RequestHandler } from "express";

export const handleChat= async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error});

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (OPENAI_KEY) {
      // Proxy to OpenAI Chat completions (if key provided)
      const resp = await fetch("https, {
        method,
        headers{
          Authorization{OPENAI_KEY}`,
          "Content-Type",
        },
        body{
          model,
          messages[
            { role, content},
            { role, content},
          ],
          max_tokens,
        }),
      });
      const data = await resp.json();
      const text = data?.choices?.[0]?.message?.content ?? data?.error?.message ?? "Sorry, I couldn't get a response.";
      return res.json({ reply});
    }

    // Fallback simple rule-based responses
    const lower = message.toLowerCase();
    let reply = "I'm here to help You can ask about order status, payments or returns.";
    if (lower.includes("order")) reply = "To track your order, go to Orders → Track Order and enter your order id.";
    if (lower.includes("payment")) reply = "We support Razorpay. You can pay from the cart using the Pay button.";
    if (lower.includes("chat")) reply = "This chat supports basic help; provide details and we'll assist.";

    return res.json({ reply });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error});
  }
};
