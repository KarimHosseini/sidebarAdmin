import React from 'react';
import { Stepper, Step, StepLabel, Button } from '@mui/material';
import { SHOWCASE_STEPS } from '../config/constants';

const ShowcaseStepper = ({
  currentStep,
  onNext,
  onBack,
  onSubmit,
  isValid,
  isLoading,
}) => {
  return (
    <div>
      <Stepper activeStep={currentStep - 1} alternativeLabel>
        {SHOWCASE_STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className="flex justify-between mt-4">
        <Button
          onClick={onBack}
          disabled={currentStep === 1 || isLoading}
        >
          قبلی
        </Button>

        {currentStep === SHOWCASE_STEPS.length ? (
          <Button
            variant="contained"
            onClick={onSubmit}
            disabled={!isValid || isLoading}
          >
            {isLoading ? 'در حال ذخیره...' : 'ذخیره'}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={onNext}
            disabled={!isValid || isLoading}
          >
            بعدی
          </Button>
        )}
      </div>
    </div>
  );
};

export default React.memo(ShowcaseStepper);
