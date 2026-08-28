const { query } = require('../config/db');

async function getFarmerConversations(userId) {
  return await query(`
    SELECT * FROM conversations 
    WHERE user_id = ? AND deleted_at IS NULL 
    ORDER BY updated_at DESC
  `, [userId]);
}

async function createConversation(userId, title = 'Agri Intelligence Chat') {
  const res = await query(`
    INSERT INTO conversations (user_id, title) 
    VALUES (?, ?)
  `, [userId, title]);
  return res.insertId;
}

async function getConversationMessages(conversationId, userId) {
  // Security check: verify owner
  const convs = await query('SELECT id FROM conversations WHERE id = ? AND user_id = ? AND deleted_at IS NULL', [conversationId, userId]);
  if (convs.length === 0) throw new Error('Conversation not found or unauthorized');

  return await query(`
    SELECT * FROM messages 
    WHERE conversation_id = ? 
    ORDER BY created_at ASC
  `, [conversationId]);
}

async function saveMessage(conversationId, role, content) {
  const res = await query(`
    INSERT INTO messages (conversation_id, role, content) 
    VALUES (?, ?, ?)
  `, [conversationId, role, content]);

  await query('UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [conversationId]);
  return res.insertId;
}

async function deleteConversation(conversationId, userId) {
  await query('UPDATE conversations SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?', [conversationId, userId]);
}

module.exports = {
  getFarmerConversations,
  createConversation,
  getConversationMessages,
  saveMessage,
  deleteConversation
};
