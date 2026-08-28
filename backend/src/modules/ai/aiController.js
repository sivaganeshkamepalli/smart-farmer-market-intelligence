const { processFarmerQuery } = require('../../services/aiService');
const conversationService = require('../../services/conversationService');
const { query } = require('../../config/db');

async function handleChat(req, res) {
  try {
    const userId = req.user.id;
    const { conversationId, message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message text is required.' });
    }

    // 1. Get or create conversation
    let convId = conversationId;
    if (!convId) {
      const title = message.slice(0, 40) + '...';
      convId = await conversationService.createConversation(userId, title);
    }

    // 2. Fetch Farmer Profile
    const profiles = await query('SELECT * FROM farmer_profiles WHERE user_id = ?', [userId]);
    const farms = await query('SELECT * FROM farms WHERE user_id = ?', [userId]);

    const farmerProfile = profiles[0] ? {
      ...profiles[0],
      total_area: farms[0]?.total_area || 2.0,
      water_availability: farms[0]?.water_availability || 'MEDIUM',
      annual_budget: farms[0]?.annual_budget || 100000
    } : null;

    // 3. Save User Message
    const userMsgId = await conversationService.saveMessage(convId, 'USER', message);

    // 4. Process Query via AI Reasoning Layer
    const aiResult = await processFarmerQuery(message, farmerProfile);

    // 5. Save Assistant Message
    const assistantMsgId = await conversationService.saveMessage(convId, 'ASSISTANT', JSON.stringify(aiResult));

    return res.json({
      success: true,
      data: {
        conversationId: convId,
        userMessageId: userMsgId,
        assistantMessageId: assistantMsgId,
        response: aiResult
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getConversations(req, res) {
  try {
    const userId = req.user.id;
    const convs = await conversationService.getFarmerConversations(userId);
    return res.json({ success: true, data: convs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getConversationById(req, res) {
  try {
    const userId = req.user.id;
    const convId = req.params.id;
    const messages = await conversationService.getConversationMessages(convId, userId);
    
    const parsedMessages = messages.map(m => {
      if (m.role === 'ASSISTANT') {
        try {
          return { ...m, parsedContent: JSON.parse(m.content) };
        } catch (e) {
          return { ...m, parsedContent: { message: m.content } };
        }
      }
      return m;
    });

    return res.json({ success: true, data: parsedMessages });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function deleteConversation(req, res) {
  try {
    const userId = req.user.id;
    const convId = req.params.id;
    await conversationService.deleteConversation(convId, userId);
    return res.json({ success: true, message: 'Conversation deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  handleChat,
  getConversations,
  getConversationById,
  deleteConversation
};
