/**
 * Chat service that communicates with OpenAI or utilizes rule-based responses if no API key is set.
 * @param {string} message - The message input from the user.
 */
const getChatReply = async (message) => {
  const OPENAI_KEY = process.env.OPENAI_API_KEY;

  if (OPENAI_KEY) {
    try {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: message },
          ],
          max_tokens: 150,
        }),
      });

      const data = await resp.json();
      return data?.choices?.[0]?.message?.content ?? data?.error?.message ?? "Sorry, I couldn't get a response.";
    } catch (err) {
      console.error("[chatService] OpenAI API request failed, falling back:", err);
    }
  }

  // Fallback simple rule-based responses
  const lower = message.toLowerCase();
  let reply = "I'm here to help. You can ask about order status, payments or returns.";
  if (lower.includes("order")) {
    reply = "To track your order, go to Orders → Track Order and enter your order id.";
  } else if (lower.includes("payment")) {
    reply = "We support Razorpay. You can pay from the cart using the Pay button.";
  } else if (lower.includes("chat")) {
    reply = "This chat supports basic help; provide details and we'll assist.";
  }

  return reply;
};

module.exports = {
  getChatReply,
};
