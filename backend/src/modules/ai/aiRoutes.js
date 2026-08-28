const express = require('express');
const router = express.Router();
const aiController = require('./aiController');
const { authenticateToken } = require('../../middleware/authMiddleware');

router.post('/chat', authenticateToken, aiController.handleChat);
router.get('/conversations', authenticateToken, aiController.getConversations);
router.get('/conversations/:id', authenticateToken, aiController.getConversationById);
router.delete('/conversations/:id', authenticateToken, aiController.deleteConversation);

module.exports = router;
