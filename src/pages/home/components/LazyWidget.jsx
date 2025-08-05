import React, { Suspense, lazy } from 'react';
import { Box, CircularProgress } from '@mui/material';

const LazyWidget = ({ componentPath, ...props }) => {
  const Component = lazy(() => import(`../${componentPath}`));

  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            minHeight: 200
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default LazyWidget;