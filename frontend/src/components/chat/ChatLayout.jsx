import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import MessageBubble from './MessageBubble';
import { Send, Plus, Trash2, MessageSquare, Sparkles, Loader2 } from 'lucide-react';

const PREDEFINED_PROMPTS = [
  "What should I cultivate this season?",
  "I have 2 acres and limited water. Give me a farming plan.",
  "Why was tomato price high last February?",
  "Should I grow pomegranate on my land?",
  "Which crops have stable constant demand?",
  "Calculate investment cost for Badam"
];

export default function ChatLayout() {
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConvId) {
      fetchMessages(activeConvId);
    } else {
      setMessages([]);
    }
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/ai/conversations');
      if (res.data.success) {
        setConversations(res.data.data);
        if (res.data.data.length > 0 && !activeConvId) {
          setActiveConvId(res.data.data[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  };

  const fetchMessages = async (convId) => {
    try {
      const res = await api.get(`/ai/conversations/${convId}`);
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || loading) return;

    setInputPrompt('');
    setLoading(true);

    // Optimistic user message append
    const tempUserMsg = { role: 'USER', content: text, created_at: new Date().toISOString() };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await api.post('/ai/chat', {
        conversationId: activeConvId,
        message: text
      });

      if (res.data.success) {
        const { conversationId, response } = res.data.data;
        if (!activeConvId) {
          setActiveConvId(conversationId);
          await fetchConversations();
        }

        const assistantMsg = {
          role: 'ASSISTANT',
          content: JSON.stringify(response),
          parsedContent: response,
          created_at: new Date().toISOString()
        };

        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setActiveConvId(null);
    setMessages([]);
  };

  const handleDeleteConv = async (e, convId) => {
    e.stopPropagation();
    try {
      await api.delete(`/ai/conversations/${convId}`);
      if (activeConvId === convId) {
        setActiveConvId(null);
        setMessages([]);
      }
      fetchConversations();
    } catch (err) {
      console.error('Error deleting conversation:', err);
    }
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm">
      {/* Conversations Drawer Sidebar */}
      <div className="hidden md:flex w-72 flex-col border-r border-gray-200 bg-gray-50/70 p-3">
        <button
          onClick={handleNewChat}
          className="flex items-center justify-center space-x-2 w-full rounded-xl bg-agri-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-agri-700 transition mb-3"
        >
          <Plus className="h-4 w-4" />
          <span>New Farming Analysis</span>
        </button>

        <div className="text-xs font-bold uppercase tracking-wider text-gray-400 px-2 mb-2">
          Saved Conversations
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveConvId(c.id)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                activeConvId === c.id
                  ? 'bg-white text-agri-700 shadow-sm border border-agri-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2 truncate pr-2">
                <MessageSquare className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <span className="truncate">{c.title}</span>
              </div>
              <button
                onClick={(e) => handleDeleteConv(e, c.id)}
                className="text-gray-400 hover:text-red-600 p-1 transition"
                title="Delete Conversation"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {conversations.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-6">No previous conversations.</p>
          )}
        </div>
      </div>

      {/* Main Chat Thread Area */}
      <div className="flex-1 flex flex-col justify-between bg-gray-50/30">
        {/* Messages Scroll View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-xl mx-auto py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-agri-100 text-agri-700 mb-4 shadow-md">
                <Sparkles className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">ChatGPT for Farmers</h2>
              <p className="text-xs text-gray-600 leading-relaxed mb-6">
                Ask any question about what to cultivate, historical market prices, 10-year demand trends, water requirements, climate risks, or multi-year financial returns.
              </p>

              {/* Predefined Quick Prompts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                {PREDEFINED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="text-left rounded-xl border border-gray-200 bg-white p-3 text-xs font-semibold text-gray-700 hover:border-agri-400 hover:bg-agri-50/50 transition shadow-sm"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg} onSendPrompt={handleSend} />
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-gray-500 bg-white border border-gray-200 rounded-xl p-3 max-w-xs shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin text-agri-600" />
              <span>Analyzing 500+ agricultural products & market trends...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t border-gray-200 bg-white p-3 sm:p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask anything (e.g., 'I have 2 acres and limited water. What should I cultivate?')..."
              className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-agri-600 focus:outline-none bg-gray-50/50 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={loading || !inputPrompt.trim()}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-agri-600 text-white hover:bg-agri-700 transition disabled:opacity-50 shadow-md shadow-agri-600/20"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
