import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import React, { useState } from "react";

const HeaderSelectionModal = ({ open, onClose, headers, onConfirm }) => {
  const [selectedHeaders, setSelectedHeaders] = useState(headers);

  // Handle checkbox toggle
  const handleToggle = (header) => {
    const currentIndex = selectedHeaders.indexOf(header);
    const newSelected = [...selectedHeaders];

    if (currentIndex === -1) {
      // Limit selection to 7 headers
      if (newSelected.length < 7) {
        newSelected.push(header);
      }
    } else {
      newSelected.splice(currentIndex, 1);
    }
    setSelectedHeaders(newSelected);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="text-xl font-bold">Select Headers</DialogTitle>
      <DialogContent>
        <FormGroup>
          {headers.map((header, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={selectedHeaders.includes(header)}
                  onChange={() => handleToggle(header)}
                />
              }
              label={header}
            />
          ))}
        </FormGroup>
        <p className="text-sm text-gray-500 mt-2">
          برای خروجی پی دی اف لطفا حداکثر ۷ تا ستون لازم را رانتخاب کنید
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          انصرف
        </Button>
        <Button
          onClick={() => onConfirm(selectedHeaders)}
          color="primary"
          disabled={selectedHeaders.length === 0}
        >
          تایید
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HeaderSelectionModal;
