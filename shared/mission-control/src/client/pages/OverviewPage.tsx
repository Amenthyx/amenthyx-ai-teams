import React from 'react';
import { AgentActivityPanel } from '../components/panels/AgentActivityPanel';
import { CostMonitorPanel } from '../components/panels/CostMonitorPanel';
import { PlanningPanel } from '../components/panels/PlanningPanel';
import { TestResultsPanel } from '../components/panels/TestResultsPanel';
import { EventStreamPanel } from '../components/panels/EventStreamPanel';

export const OverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Planning timeline — full width */}
      <PlanningPanel compact />

      {/* Agent activity — full width */}
      <AgentActivityPanel compact />

      {/* Two-column layout for cost and tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CostMonitorPanel compact />
        <TestResultsPanel compact />
      </div>

      {/* Mini event stream */}
      <EventStreamPanel compact maxEvents={20} />
    </div>
  );
};
