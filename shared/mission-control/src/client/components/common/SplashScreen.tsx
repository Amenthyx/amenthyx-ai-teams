import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onProjectReady: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onProjectReady }) => {
  const [dots, setDots] = useState('');
  const [statusMessage, setStatusMessage] = useState('Initializing Mission Control...');
  const [fadeOut, setFadeOut] = useState(false);

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Cycle through status messages
  useEffect(() => {
    const messages = [
      'Initializing Mission Control...',
      'Waiting for team activation...',
      'Run amenthyx --team <name> to start',
      'Listening for project config...',
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % messages.length;
      setStatusMessage(messages[idx]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Poll /api/config for projectActive
  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch('/api/config');
        if (!res.ok) return;
        const data = await res.json();
        if (data.projectActive && !cancelled) {
          setStatusMessage(`Project ready: ${data.projectName}`);
          setFadeOut(true);
          setTimeout(() => {
            if (!cancelled) onProjectReady();
          }, 800);
        }
      } catch {
        // Server not ready yet — keep polling
      }
    };

    // Initial check
    poll();
    const interval = setInterval(poll, 3000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [onProjectReady]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-700 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      }}
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            animation: 'gridMove 20s linear infinite',
          }}
        />
      </div>

      {/* Logo / Brand */}
      <div className="relative mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                boxShadow: '0 0 40px rgba(59,130,246,0.3)',
              }}
            >
              A
            </div>
            {/* Pulse ring */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                border: '2px solid rgba(59,130,246,0.4)',
                animation: 'pulse-ring 2s ease-out infinite',
              }}
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Mission Control</h1>
            <p className="text-sm text-blue-400 font-medium">Amenthyx AI Teams</p>
          </div>
        </div>
      </div>

      {/* Loading spinner */}
      <div className="relative mb-8">
        <div
          className="w-12 h-12 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: '#3b82f6',
            borderRightColor: '#8b5cf6',
            animation: 'spin 1s linear infinite',
          }}
        />
        <div
          className="absolute inset-1 rounded-full border-2 border-transparent"
          style={{
            borderBottomColor: '#3b82f6',
            borderLeftColor: '#8b5cf6',
            animation: 'spin 1.5s linear infinite reverse',
          }}
        />
      </div>

      {/* Status message */}
      <p className="text-gray-400 text-sm font-mono">
        {statusMessage}{dots}
      </p>

      {/* Bottom hint */}
      <div className="absolute bottom-8 text-center">
        <p className="text-gray-600 text-xs">
          Dashboard will appear automatically when a team is activated
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
      `}</style>
    </div>
  );
};
