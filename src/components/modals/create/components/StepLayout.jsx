import React from 'react';
import { Paper } from '@mui/material';

const StepLayout = ({ children, className = '' }) => {
  return (
    <Paper className={`p-4 ${className}`}>
      <div className="grid md:grid-cols-12 gap-4 mt-4">
        {children}
      </div>
    </Paper>
  );
};

export default StepLayout;
