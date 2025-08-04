import { TextField } from "@mui/material";

const NumberInput = (props) => {
  const {
    label = "",
    min = 0,
    max,
    startAdornment = null,
    change,
    value,
    disabled = false,
    float = false
  } = props;

  return (
    <TextField
      value={value}
      onChange={(e) => change( float ?Number(e.target.value) :parseInt(e.target.value))}
      sx={styles.input}
      label={label}
      type="number"
      variant="outlined"
      fullWidth
      disabled={disabled}
      InputProps={{
        inputProps: {
          max,
          min,
        },
        startAdornment,
      }}
    />
  );
};

const styles = {
  input: {
    direction: "rtl",
    textAlign: "right",
  },
};

export default NumberInput;
