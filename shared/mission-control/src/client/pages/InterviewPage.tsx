import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { InterviewDisplayPanel } from '../components/panels/InterviewDisplayPanel';
import { useInterviewStore, Interview } from '../stores/interviewStore';

export const InterviewPage: React.FC = () => {
  const interviews = useInterviewStore((s) => s.interviews);
  const setInterviews = useInterviewStore((s) => s.setInterviews);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/interviews');
        if (!response.ok) {
          throw new Error(`Failed to fetch interviews: ${response.statusText}`);
        }
        const json = await response.json();
        const data: Interview[] = json.interviews || json;
        setInterviews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load interviews');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [setInterviews]);

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin dark:text-gray-400 text-gray-500" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      ) : (
        <InterviewDisplayPanel interviews={interviews} />
      )}
    </div>
  );
};
