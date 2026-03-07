import React, { useState } from 'react';
import { MessageSquare, User } from 'lucide-react';
import { Interview, InterviewCategory } from '../../stores/interviewStore';

const CATEGORIES: { id: InterviewCategory; label: string }[] = [
  { id: 'business', label: 'Business' },
  { id: 'technical', label: 'Technical' },
  { id: 'constraints', label: 'Constraints' },
  { id: 'stakeholders', label: 'Stakeholders' },
];

interface InterviewDisplayPanelProps {
  interviews: Interview[];
}

export const InterviewDisplayPanel: React.FC<InterviewDisplayPanelProps> = ({
  interviews,
}) => {
  const [activeCategory, setActiveCategory] = useState<InterviewCategory | 'all'>('all');

  const filtered =
    activeCategory === 'all'
      ? interviews
      : interviews.filter((i) => i.category === activeCategory);

  return (
    <div className="rounded-xl border dark:border-gray-700 border-gray-200 dark:bg-gray-800/50 bg-white p-4">
      <h3 className="text-sm font-semibold dark:text-gray-200 text-gray-800 mb-3">
        Discovery Interviews
      </h3>

      {/* Category tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
            activeCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'dark:bg-gray-700/30 bg-gray-100 dark:text-gray-400 text-gray-500 dark:hover:bg-gray-700/50 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-blue-600 text-white'
                : 'dark:bg-gray-700/30 bg-gray-100 dark:text-gray-400 text-gray-500 dark:hover:bg-gray-700/50 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Q&A cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <MessageSquare size={32} className="dark:text-gray-600 text-gray-300 mb-2" />
          <p className="text-xs dark:text-gray-600 text-gray-400 italic">
            No interviews recorded
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((interview) => (
            <div
              key={interview.id}
              className="rounded-lg dark:bg-gray-700/30 bg-gray-50 p-3 space-y-2"
            >
              {/* Category badge */}
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-blue-500/20 text-blue-400">
                  {interview.category}
                </span>
                <span className="text-[10px] dark:text-gray-500 text-gray-400">
                  {new Date(interview.created_at).toLocaleDateString()}
                </span>
              </div>

              {/* Question */}
              <div>
                <span className="text-[10px] font-semibold uppercase dark:text-gray-500 text-gray-400">
                  Question
                </span>
                <p className="text-sm font-medium dark:text-gray-200 text-gray-700">
                  {interview.question}
                </p>
              </div>

              {/* Answer */}
              <div>
                <span className="text-[10px] font-semibold uppercase dark:text-gray-500 text-gray-400">
                  Answer
                </span>
                <p className="text-xs dark:text-gray-300 text-gray-600">
                  {interview.answer}
                </p>
              </div>

              {/* Meta */}
              {(interview.asked_by || interview.answered_by) && (
                <div className="flex items-center gap-3 pt-1 border-t dark:border-gray-600 border-gray-200">
                  {interview.asked_by && (
                    <span className="flex items-center gap-1 text-[10px] dark:text-gray-500 text-gray-400">
                      <User size={10} />
                      Asked by {interview.asked_by}
                    </span>
                  )}
                  {interview.answered_by && (
                    <span className="flex items-center gap-1 text-[10px] dark:text-gray-500 text-gray-400">
                      <User size={10} />
                      Answered by {interview.answered_by}
                    </span>
                  )}
                </div>
              )}

              {/* Tags */}
              {interview.tags && interview.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {interview.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 rounded text-[10px] dark:bg-gray-600/50 bg-gray-200 dark:text-gray-400 text-gray-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
