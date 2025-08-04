import { Alert, Snackbar } from "@mui/material";
import { useDispatch } from "react-redux";
import { removeSnack } from "../redux/slices/snacks";

const Snack = ({ data }) => {
  const dispatch = useDispatch();
  const { type, message } = data;
  return (
    <Snackbar
      open={true}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={2500}
      onClose={() => dispatch(removeSnack())}
    >
      <Alert severity={type} sx={{ width: "100%", fontSize: "18px" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Snack;
