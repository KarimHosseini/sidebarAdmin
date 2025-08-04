import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
const ActionButton = ({
  title = "ثبت اطلاعات",
  click,
  color = "primary",
  disable = false,
  plus = false,
}) => {
  return (
    <Button
      disabled={disable}
      variant="contained"
      disableElevation
      onClick={click}
      /*      size="small" */

      color={color}
      className="flex items-center justify-center gap-1"
    >
      {plus && <AddIcon />}
      {title}
    </Button>
  );
};

export default ActionButton;
