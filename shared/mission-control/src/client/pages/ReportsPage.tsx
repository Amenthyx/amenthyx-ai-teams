import React from 'react';
import { ReportBuilderPanel } from '../components/panels/ReportBuilderPanel';
import { ErrorRatePanel } from '../components/panels/ErrorRatePanel';

export const ReportsPage: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ReportBuilderPanel />
      <ErrorRatePanel />
    </div>
  );
};
