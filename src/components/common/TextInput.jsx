import { TextField } from "@mui/material";
import { useState } from "react";
import { persianToEnglish, separate } from "../../helpers/functions";

const TextInput = ({
  number = false,
  change,
  currentValue,
  readOnly = false,
  disabled = false,
  label = "",
  smallerthan = null,
  errors = null,
  allowZero = false,
  noSepreate = false,
  err = false,
  price = false,
  noError = false,
  priceLabel = "تومان",
  ltr,
  InputLabelProps,
}) => {
  const [error, setError] = useState(null);
  return (
    <div className={`relative min-h-[39.91px] ${ltr ? "leftInput" : ""}`}>
      <TextField
        disabled={readOnly || disabled}
        value={
          number && !noSepreate ? separate(String(currentValue)) : currentValue
        }
        type="text"
        variant="outlined"
        sx={{ position: "relative" }}
        label={label}
        InputLabelProps={InputLabelProps}
        fullWidth={true}
        onChange={(e) => {
          if (currentValue?.length === 0 && e.target.value === " ") {
            return;
          } else {
            if (number) {
              change(persianToEnglish(e.target.value));
              if (Number(e.target.value) > 0) {
                setError(null);
              }

              if (smallerthan) {
                if (Number(smallerthan) <= Number(e.target.value)) {
                  setError(errors);
                }
              }
            } else {
              change(e.target.value);
            }
          }
        }}
        onInput={(e) => {
          if (number) {
            e.target.value = e.target.value
              .replace(/[^0-9.]/g, "")
              .replace(/(\..*?)\..*/g, "$1");
          }
        }}
        onBlur={() => {
          if (number) {
            if (Number(currentValue) < 1 && !allowZero) {
              setError("عدد مثبت وارد کنید");
            } else if (Number(smallerthan) <= Number(currentValue)) {
              setError(errors);
            } else {
              setError(null);
            }
          }
        }}
        error={Boolean(error || err)}
        helperText={
          <div className="text-left">
            {!noError && <> {err ? "این فیلد را به درستی پر کنید" : error}</>}
          </div>
        }
      />
      {price && (
        <div className="absolute top-1/2 -translate-y-1/2 left-5 text-xs">
          {priceLabel}
        </div>
      )}
    </div>
  );
};

export default TextInput;
