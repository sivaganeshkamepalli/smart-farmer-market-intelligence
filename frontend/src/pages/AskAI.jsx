import React from 'react';
import ChatLayout from '../components/chat/ChatLayout';

export default function AskAI() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Ask AI Assistant</h1>
        <p className="text-xs text-gray-500">ChatGPT for Farmers decision support interface powered by 500+ product market database.</p>
      </div>
      <ChatLayout />
    </div>
  );
}
