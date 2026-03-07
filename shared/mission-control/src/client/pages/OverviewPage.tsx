import React from 'react';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { AgentActivityPanel } from '../components/panels/AgentActivityPanel';
import { CostMonitorPanel } from '../components/panels/CostMonitorPanel';
import { PlanningPanel } from '../components/panels/PlanningPanel';
import { TestResultsPanel } from '../components/panels/TestResultsPanel';
import { EventStreamPanel } from '../components/panels/EventStreamPanel';
import { SessionSummaryCard } from '../components/panels/SessionSummaryCard';
import { ErrorRatePanel } from '../components/panels/ErrorRatePanel';
import { ResourceAllocationPanel } from '../components/panels/ResourceAllocationPanel';
import { ServiceStatusPanel } from '../components/panels/ServiceStatusPanel';

export const OverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Session summary at top */}
      <ErrorBoundary>
        <SessionSummaryCard />
      </ErrorBoundary>

      {/* Planning timeline */}
      <ErrorBoundary>
        <PlanningPanel compact />
      </ErrorBoundary>

      {/* Agent activity */}
      <ErrorBoundary>
        <AgentActivityPanel compact />
      </ErrorBoundary>

      {/* Two-column: cost + tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ErrorBoundary>
          <CostMonitorPanel compact />
        </ErrorBoundary>
        <ErrorBoundary>
          <TestResultsPanel compact />
        </ErrorBoundary>
      </div>

      {/* Three-column: error rate, resource allocation, service status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ErrorBoundary>
          <ErrorRatePanel />
        </ErrorBoundary>
        <ErrorBoundary>
          <ResourceAllocationPanel />
        </ErrorBoundary>
        <ErrorBoundary>
          <ServiceStatusPanel />
        </ErrorBoundary>
      </div>

      {/* Mini event stream */}
      <ErrorBoundary>
        <EventStreamPanel compact maxEvents={20} />
      </ErrorBoundary>
    </div>
  );
};
