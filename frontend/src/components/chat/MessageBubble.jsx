import React from 'react';
import { Bot, User } from 'lucide-react';
import RecommendationCard from './RecommendationCard';
import LandAllocationWidget from './LandAllocationWidget';
import MissingInfoCard from './MissingInfoCard';
import DataCompletenessCard from './DataCompletenessCard';
import SuggestionButtons from './SuggestionButtons';

export default function MessageBubble({ message, onSendPrompt }) {
  const isUser = message.role === 'USER';
  const data = message.parsedContent || {};

  return (
    <div className={`flex space-x-3 ${isUser ? 'justify-end' : 'justify-start'} my-4`}>
      {!isUser && (
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-agri-600 text-white shadow-md shadow-agri-600/30">
          <Bot className="h-5 w-5" />
        </div>
      )}

      <div className={`max-w-3xl rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
        isUser ? 'bg-agri-700 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none'
      }`}>
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div>
            {/* AI Text Message */}
            <p className="whitespace-pre-wrap font-medium text-gray-800 mb-2">
              {data.message || message.content}
            </p>

            {/* Structured Recommendation Options */}
            {data.recommendations && data.recommendations.length > 0 && (
              <RecommendationCard recommendations={data.recommendations} />
            )}

            {/* Land Allocation Visualizer */}
            {data.landAllocation && (
              <LandAllocationWidget allocation={data.landAllocation} />
            )}

            {/* Missing Info Form */}
            {data.missingInformation && data.missingInformation.length > 0 && (
              <MissingInfoCard missingInfo={data.missingInformation} onRecalculate={onSendPrompt} />
            )}

            {/* Data Completeness */}
            {data.dataCompleteness && (
              <DataCompletenessCard completeness={data.dataCompleteness} confidence={data.confidence} />
            )}

            {/* Quick Suggestions */}
            {data.followUpOptions && (
              <SuggestionButtons suggestions={data.followUpOptions} onSelect={onSendPrompt} />
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gray-800 text-white font-bold">
          <User className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}
