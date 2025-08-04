import { FormControlLabel, Checkbox as MUICheckbox } from "@mui/material";
import { indigo } from "@mui/material/colors";

const Checkbox = ({ change, label , checked }) => {
  return (
    <FormControlLabel
      control={
        <MUICheckbox
          onChange={(e) => change(e.target.checked)}
          sx={{
            "&.Mui-checked": {
              color: indigo[600],
            },
          }}
          checked={checked}
        />
      }
      label={label}
      labelPlacement="end"
     /*  sx={{ my: 2 }} */
   
    />
  );
};

export default Checkbox;
