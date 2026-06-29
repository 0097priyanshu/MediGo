const { getChatReply } = require("../services/chatService");

/**
 * Handle incoming chat questions and requests.
 */
const handleChat = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = await getChatReply(message);
    return res.status(200).json({ reply });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  handleChat,
};
