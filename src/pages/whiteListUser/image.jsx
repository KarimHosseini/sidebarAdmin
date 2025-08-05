import { Delete, Download, Visibility } from "@mui/icons-material";
import { CircularProgress, IconButton, Tooltip, Zoom } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  DOWNLOAD_FILE,
  REMOVE_IMAGE_WHITE_LIST_USER,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const ShowImageDocumnt = ({
  address,
  deleteId,
  id,
  refresh,
  buttonOnly = false,
}) => {
  const { token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { userPermissions } = useSelector((state) => state.relationals);

  // Existing functions remain unchanged
  const deleteImage = () => {
    setLoading(true);
    axiosInstance
      .delete(
        `${baseUrl}/${REMOVE_IMAGE_WHITE_LIST_USER}?whiteListGalleryId=${id}`,
        configReq(token)
      )
      .then((res) => {
        setLoading(false);
        refresh();
        toast.success("تصویر با موفقیت حذف شد");
      })
      .catch((err) => {
        setLoading(false);
        toast.error("خطا در حذف تصویر");
      });
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = `${baseUrl}/${DOWNLOAD_FILE}/${address}?size=small`;
    link.download = `document-${new Date().getTime()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const togglePreview = (e) => {
    e.stopPropagation();
    setShowPreview(!showPreview);
  };

  if (buttonOnly) {
    return (
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        {userPermissions?.whiteListUser?.editDoc && (
          <Tooltip title="حذف تصویر" TransitionComponent={Zoom}>
            <IconButton
              onClick={deleteImage}
              disabled={loading}
              size="small"
              className="text-red-500 hover:bg-red-50"
              sx={{
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                <Delete fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        )}
      </motion.div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <img
          src={`${baseUrl}/${DOWNLOAD_FILE}/${address}?size=small`}
          alt="document"
          className="w-full h-auto object-cover transition-all duration-500"
          style={{ aspectRatio: "16/9" }}
        />
      </motion.div>

      {/* Fixed action buttons at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent py-2 px-3">
        <div className="flex justify-between items-center">
          <div className="text-white text-xs font-medium truncate">
            سند : {id}
          </div>
          <div className="flex gap-2">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Tooltip
                title="مشاهده"
                TransitionComponent={Zoom}
                arrow
                placement="top"
              >
                <IconButton
                  size="small"
                  className="!bg-blue-500 !text-white hover:bg-blue-600"
                  onClick={togglePreview}
                  sx={{
                    width: 32,
                    height: 32,
                    minHeight: "unset",
                  }}
                >
                  <Visibility fontSize="small" />
                </IconButton>
              </Tooltip>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Tooltip
                title="دانلود"
                TransitionComponent={Zoom}
                arrow
                placement="top"
              >
                <IconButton
                  size="small"
                  className="!bg-green-500 !text-white hover:bg-green-600"
                  onClick={handleDownload}
                  sx={{
                    width: 32,
                    height: 32,
                    minHeight: "unset",
                  }}
                >
                  <Download fontSize="small" />
                </IconButton>
              </Tooltip>
            </motion.div>

            {userPermissions?.whiteListUser?.editDoc && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Tooltip
                  title="حذف"
                  TransitionComponent={Zoom}
                  arrow
                  placement="top"
                >
                  <IconButton
                    size="small"
                    className="!bg-red-500 !text-white hover:bg-red-600"
                    onClick={deleteImage}
                    disabled={loading}
                    sx={{
                      width: 32,
                      height: 32,
                      minHeight: "unset",
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <Delete fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[50000000000] flex items-center justify-center p-4"
            onClick={togglePreview}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-4xl max-h-[90vh] bg-white/5 p-1 rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`${baseUrl}/${DOWNLOAD_FILE}/${address}`}
                alt="Preview"
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />

              <motion.div
                className="absolute top-3 right-3 flex gap-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Tooltip title="دانلود" TransitionComponent={Zoom} arrow>
                    <IconButton
                      className="!bg-green-500 !text-white hover:bg-green-600"
                      onClick={handleDownload}
                      sx={{
                        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                      }}
                    >
                      <Download />
                    </IconButton>
                  </Tooltip>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Tooltip title="بستن" TransitionComponent={Zoom} arrow>
                    <IconButton
                      className="!bg-red-500 !text-white hover:bg-red-600"
                      onClick={togglePreview}
                      sx={{
                        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                      }}
                    >
                      ✕
                    </IconButton>
                  </Tooltip>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShowImageDocumnt;
