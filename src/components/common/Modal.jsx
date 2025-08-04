import CloseIcon from "@mui/icons-material/Close";
import { Box, Dialog, Drawer, useMediaQuery } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";

const Modal = ({
  children,
  open,
  close,
  title,
  autoWidth = false,
  noPadding = false,
}) => {
  const { themeColor } = useSelector((state) => state.themeColor);
  const isMd = useMediaQuery("(min-width:756px)");

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: 30,
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  };
  const closeButtonVariants = {
    hover: {
      scale: 1.1,
      rotate: 90,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <>
      {isMd ? (
        <Dialog
          sx={{
            ".MuiPaper-root": {
              maxWidth: autoWidth ? "initial !important" : "600px",
              marginY: { md: "12px !important", xs: "0 !important" },
              width: { md: "auto", xs: "95%" },
              maxHeight: "calc(100vh - 64px)",
              background: "transparent",
              boxShadow: "none",
              overflow: "hidden",
            },
          }}
          onClose={close}
          open={open}
          dir="rtl"
          TransitionComponent={undefined}
        >
          <AnimatePresence mode="wait">
            {open && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={modalVariants}
                style={{
                  background: themeColor === "dark" ? "#1e1e2d" : "#fff",
                  borderRadius: "8px",
                  boxShadow:
                    themeColor === "dark"
                      ? "0 8px 32px rgba(0, 0, 0, 0.5)"
                      : "0 8px 32px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  maxHeight: "calc(100vh - 64px)",
                }}
              >
                <Box
                  sx={{
                    px: {
                      md: 5,
                      xs: 1,
                    },
                    pt: 2,
                    flexShrink: 0,
                    zIndex: 10,
                    backdropFilter: "blur(8px)",
                    backgroundColor:
                      themeColor === "dark"
                        ? "rgba(30, 30, 30, 0.95)"
                        : "rgba(202, 192, 192, 0.15)",
                  }}
                  className={`flex justify-between   items-center mb-3  w-full border-b  pb-4 `}
                >
                  {/*       <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              > */}
                  <Box className="text-base md:text-lg font-bold">{title}</Box>
                  {/*       </motion.div> */}

                  <motion.div
                    variants={closeButtonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Box
                      className="justify-center items-center cursor-pointer"
                      sx={{
                        background: "#d32f2f",
                        width: "15px",
                        height: "15px",
                        borderRadius: "50%",
                        display: "flex",
                      }}
                      onClick={close}
                    >
                      <CloseIcon
                        sx={{ color: "#fff", fontSize: "13px!important" }}
                      />
                    </Box>
                  </motion.div>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    justifyContent: "flex-start",
                    px: { md: noPadding ? 0 : 3, xs: 1 },
                    pb: 2,
                    minWidth: { md: "420px", xs: "98%" },
                    overflowY: "auto",
                    overflowX: "hidden",
                    flexGrow: 1,
                    pt: 2,
                    "&::-webkit-scrollbar": {
                      width: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: themeColor === "dark" ? "#2d2d3d" : "#f1f1f1",
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: themeColor === "dark" ? "#4b4b65" : "#c1c1c1",
                      borderRadius: "4px",
                      "&:hover": {
                        background:
                          themeColor === "dark" ? "#5d5d7d" : "#a1a1a1",
                      },
                    },
                  }}
                  className={`${themeColor === "dark" ? "darkMode" : ""}`}
                >
                  {/*       <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.25 }}
                className="flex flex-col gap-7"
              > */}
                  {children}
                  {/*     </motion.div> */}
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Dialog>
      ) : (
        <Drawer
          anchor="bottom"
          open={open}
          onClose={close}
          PaperProps={{
            sx: {
              width: "100%",
              maxWidth: "100%",
            },
          }}
        >
          {" "}
          {open && (
            <div>
              <Box
                sx={{
                  px: {
                    md: 5,
                    xs: 1,
                  },
                  pt: 2,
                  flexShrink: 0,
                  zIndex: 10,
                  backdropFilter: "blur(8px)",
                  backgroundColor:
                    themeColor === "dark"
                      ? "rgba(30, 30, 30, 0.95)"
                      : "rgba(202, 192, 192, 0.15)",
                }}
                className={`flex justify-between   items-center mb-3  w-full border-b  pb-4 `}
              >
                {/*       <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          > */}
                <Box className="text-base md:text-lg font-bold">{title}</Box>
                {/*       </motion.div> */}
                <Box
                  className="justify-center items-center cursor-pointer"
                  sx={{
                    background: "#d32f2f",
                    width: "15px",
                    height: "15px",
                    borderRadius: "50%",
                    display: "flex",
                  }}
                  onClick={close}
                >
                  <CloseIcon
                    sx={{ color: "#fff", fontSize: "13px!important" }}
                  />
                </Box>{" "}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  justifyContent: "flex-start",
                  px: { md: noPadding ? 0 : 3, xs: 1 },
                  pb: 2,
                  minWidth: { md: "420px", xs: "98%" },
                  overflowY: "auto",
                  overflowX: "hidden",
                  flexGrow: 1,
                  pt: 2,
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: themeColor === "dark" ? "#2d2d3d" : "#f1f1f1",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: themeColor === "dark" ? "#4b4b65" : "#c1c1c1",
                    borderRadius: "4px",
                    "&:hover": {
                      background: themeColor === "dark" ? "#5d5d7d" : "#a1a1a1",
                    },
                  },
                }}
                className={`${themeColor === "dark" ? "darkMode" : ""}`}
              >
                {/*       <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.25 }}
            className="flex flex-col gap-7"
          > */}
                {children}
                {/*     </motion.div> */}
              </Box>
            </div>
          )}
        </Drawer>
      )}
    </>
  );
};

export default Modal;
