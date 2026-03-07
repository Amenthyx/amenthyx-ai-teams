import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Radio, GitCommitHorizontal, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  type: 'event' | 'commit' | 'decision';
  title: string;
  description?: string;
  link?: string;
  agent?: string;
}

interface GroupedResults {
  events: SearchResult[];
  commits: SearchResult[];
  decisions: SearchResult[];
}

const TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode }> = {
  events: { label: 'Events', icon: <Radio size={12} /> },
  commits: { label: 'Commits', icon: <GitCommitHorizontal size={12} /> },
  decisions: { label: 'Decisions', icon: <Lightbulb size={12} /> },
};

export const GlobalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GroupedResults>({ events: [], commits: [], decisions: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults({ events: [], commits: [], decisions: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults({
          events: data.events || [],
          commits: data.commits || [],
          decisions: data.decisions || [],
        });
      }
    } catch {
      // Search endpoint may not be available — clear results silently
      setResults({ events: [], commits: [], decisions: [] });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults({ events: [], commits: [], decisions: [] });
      return;
    }
    debounceRef.current = setTimeout(() => fetchResults(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchResults]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    if (result.link) {
      navigate(result.link);
    } else if (result.type === 'event') {
      navigate('/events');
    } else if (result.type === 'commit') {
      navigate('/git');
    } else if (result.type === 'decision') {
      navigate('/decisions');
    }
  };

  const totalResults = results.events.length + results.commits.length + results.decisions.length;
  const hasResults = totalResults > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* Search input */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-gray-500 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search events, commits, decisions..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-9 pr-8 py-2 text-sm rounded-lg dark:bg-gray-700 bg-gray-100 dark:text-gray-200 text-gray-700 border dark:border-gray-600 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors duration-200"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults({ events: [], commits: [], decisions: [] });
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded dark:hover:bg-gray-600 hover:bg-gray-200"
          >
            <X size={14} className="dark:text-gray-400 text-gray-500" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border dark:border-gray-700 border-gray-200 dark:bg-gray-800 bg-white shadow-xl z-50 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">
              <span className="text-xs dark:text-gray-400 text-gray-500">Searching...</span>
            </div>
          ) : !hasResults ? (
            <div className="p-4 text-center">
              <span className="text-xs dark:text-gray-400 text-gray-500">
                No results for &quot;{query}&quot;
              </span>
            </div>
          ) : (
            (Object.entries(results) as [string, SearchResult[]][]).map(([type, items]) => {
              if (items.length === 0) return null;
              const config = TYPE_CONFIG[type];
              return (
                <div key={type}>
                  {/* Group header */}
                  <div className="flex items-center gap-2 px-3 py-1.5 dark:bg-gray-700/50 bg-gray-50 border-b dark:border-gray-700 border-gray-200">
                    <span className="dark:text-gray-400 text-gray-500">{config.icon}</span>
                    <span className="text-[10px] font-semibold dark:text-gray-400 text-gray-500 uppercase tracking-wider">
                      {config.label}
                    </span>
                    <span className="text-[10px] dark:text-gray-500 text-gray-400">
                      ({items.length})
                    </span>
                  </div>

                  {/* Results */}
                  {items.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full text-left px-3 py-2 dark:hover:bg-gray-700 hover:bg-gray-50 transition-colors duration-100 border-b dark:border-gray-800 border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        {result.agent && (
                          <span className="text-[10px] font-bold dark:text-gray-400 text-gray-500 shrink-0">
                            [{result.agent}]
                          </span>
                        )}
                        <span className="text-xs font-medium dark:text-gray-200 text-gray-700 truncate">
                          {result.title}
                        </span>
                      </div>
                      {result.description && (
                        <p className="text-[10px] dark:text-gray-500 text-gray-400 truncate mt-0.5">
                          {result.description}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
