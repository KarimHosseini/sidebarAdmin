import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Button, CircularProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import { Modal } from "../common";

const Confirm = ({
  message,
  open,
  close,
  submit,
  type = "warning",
  loading,
  confirmText = "ثبت اطلاعات",
  cancelText = "انصراف",
  description = "",
}) => {
  // Define icon and colors based on type
  const getTypeConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircleOutlineIcon />,
          color: "#10b981",
          bgColor: "rgba(16, 185, 129, 0.1)",
        };
      case "error":
        return {
          icon: <ErrorOutlineIcon />,
          color: "#ef4444",
          bgColor: "rgba(239, 68, 68, 0.1)",
        };
      case "warning":
        return {
          icon: <WarningAmberIcon />,
          color: "#f59e0b",
          bgColor: "rgba(245, 158, 11, 0.1)",
        };
      case "info":
        return {
          icon: <InfoOutlinedIcon />,
          color: "#3b82f6",
          bgColor: "rgba(59, 130, 246, 0.1)",
        };
      default:
        return {
          icon: <ErrorOutlineIcon />,
          color: "#ef4444",
          bgColor: "rgba(239, 68, 68, 0.1)",
        };
    }
  };

  const typeConfig = getTypeConfig();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 50 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.1 } },
    tap: { scale: 0.98 },
  };

  return (
    <Modal
      title=""
      open={open}
      close={() => {
        if (!loading) close();
      }}
      noPadding={true}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center px-6 py-5"
      >
        {/* Icon */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-4"
        >
          <div
            style={{
              backgroundColor: typeConfig.bgColor,
              color: typeConfig.color,
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {React.cloneElement(typeConfig.icon, {
              style: { fontSize: "36px" },
            })}
          </div>
        </motion.div>

        {/* Title */}
        <motion.div variants={itemVariants} className="text-center mb-2">
          <Typography variant="h6" component="h2" fontWeight="600">
            {message}
          </Typography>
        </motion.div>

        {/* Description if provided */}
        {description && (
          <motion.div variants={itemVariants} className="text-center mb-5">
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </motion.div>
        )}

        {/* Buttons */}
        <motion.div variants={itemVariants} className="flex gap-3 w-full mt-4">
          <motion.div className="w-1/2">
            <Button
              color="inherit"
              variant="outlined"
              fullWidth
              onClick={() => {
                if (!loading) close();
              }}
              disabled={loading}
              component={motion.button}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              sx={{
                borderRadius: "8px",
                py: 1.2,
                borderColor: "rgba(0,0,0,0.23)",
                "&:hover": {
                  borderColor: "rgba(0,0,0,0.5)",
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
              }}
            >
              {cancelText}
            </Button>
          </motion.div>
          <motion.div className="w-1/2">
            <Button
              variant="contained"
              fullWidth
              onClick={submit}
              disabled={loading}
              component={motion.button}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              sx={{
                borderRadius: "8px",
                py: 1.2,
                backgroundColor: typeConfig.color,
                "&:hover": {
                  backgroundColor: typeConfig.color,
                  filter: "brightness(0.9)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                confirmText
              )}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </Modal>
  );
};

export default Confirm;
