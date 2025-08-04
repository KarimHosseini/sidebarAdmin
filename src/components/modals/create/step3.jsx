import { Computer, PhoneIphone } from "@mui/icons-material";
import { Alert, Box, Button, Dialog, Typography } from "@mui/material";
import { motion } from "framer-motion";
import React, { useCallback, useMemo, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ContentForm from "./components/step3/ContentForm";
import ContentGrid from "./components/step3/ContentGrid";
import { MESSAGES } from "./config/messages";
import { useAccessibility } from "./hooks/useAccessibility";
import { useShowcaseApi } from "./hooks/useShowcaseApi";

const DeviceToggle = React.memo(({ isMobile, onChange }) => (
  <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
    <Button
      variant={!isMobile ? "contained" : "outlined"}
      startIcon={<Computer />}
      onClick={() => onChange(false)}
      sx={{ minWidth: 140 }}
    >
      دسکتاپ
    </Button>
    <Button
      variant={isMobile ? "contained" : "outlined"}
      startIcon={<PhoneIphone />}
      onClick={() => onChange(true)}
      sx={{ minWidth: 140 }}
    >
      موبایل
    </Button>
  </Box>
));

const Step3ShowCase = ({
  desktopContents = [],
  setDesktopContents,
  mobileContents = [],
  setMobileContents,
  showCaseLimit = 7,
  isMobile = false,
  setIsMobile,
}) => {
  const { announce } = useAccessibility();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState(null);

  const { id } = useParams();

  const { token } = useSelector((state) => state.user);

  const { uploadShowcaseImage, editShowcaseImage } = useShowcaseApi(
    token,
    false
  );

  const currentContents = useMemo(() => {
    const contents = isMobile ? mobileContents : desktopContents;
    return [...contents].sort((a, b) => b.priority - a.priority);
  }, [isMobile, mobileContents, desktopContents]);

  const handleDragEnd = useCallback(
    async (result) => {
      if (!result.destination) return;

      const { source, destination } = result;
      const items = Array.from(currentContents);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      const updatedItems = items.map((item, index) => ({
        ...item,
        priority: items.length - index,
      }));
      if (id) {
        updatedItems.forEach(async (item) => {
          try {
            await editShowcaseImage(
              { ...item, screenSize: isMobile ? 0 : 1200 },
              id
            );
          } catch (err) {}
        });
      }
      if (isMobile) {
        setMobileContents(updatedItems);
      } else {
        setDesktopContents(updatedItems);
      }

      announce(MESSAGES.SUCCESS.ORDER_UPDATED);
    },
    [isMobile, currentContents, setMobileContents, setDesktopContents, announce]
  );

  const handleContentSubmit = useCallback(
    async (content) => {
      try {
        setError(null);
        var sumbited = {};
        if (id) {
          let fd3 = new FormData();
          fd3.append("showCaseId", id);
          fd3.append("screenSize", isMobile ? 0 : 1200);
          fd3.append("imageType", 1);
          fd3.append(
            "priority",
            currentContents.length ? currentContents.length + 1 : "0"
          );
          fd3.append(
            "imageStyle",
            JSON.stringify({
              position: content.position,
              priority: content.priority,
              right: content.right,
              showTitle: content.showTitle,
              description: content.description,

              titleColor: content.titleColor,

              top: content.top,
            })
          );
          if (content.title) fd3.append("title", content.title);
          if (content.description)
            fd3.append("description", content.description);
          if (content.link) fd3.append("link", content.link);
          if (content.avatar) fd3.append("files", content.avatar);
          if (content.selectedProductImage) {
            fd3.append("fromGallery", content.selectedProductImage);
          }
          sumbited = await uploadShowcaseImage(fd3);
        }
        const newContent = {
          ...content,
          id: Date.now().toString(),
          ...sumbited,
        };

        if (isMobile) {
          setMobileContents((prev) =>
            [...prev, newContent].sort((a, b) => b.priority - a.priority)
          );
        } else {
          setDesktopContents((prev) =>
            [...prev, newContent].sort((a, b) => b.priority - a.priority)
          );
        }

        setIsFormOpen(false);
        announce(MESSAGES.SUCCESS.CONTENT_ADDED);
      } catch (err) {
        setError(err.message);
      }
    },
    [isMobile, setMobileContents, setDesktopContents, announce]
  );

  const handleContentDelete = useCallback(
    (index) => {
      const updatedContents = currentContents.filter((_, i) => i !== index);

      if (isMobile) {
        setMobileContents(updatedContents);
      } else {
        setDesktopContents(updatedContents);
      }

      announce(MESSAGES.SUCCESS.CONTENT_DELETED);
    },
    [isMobile, currentContents, setMobileContents, setDesktopContents, announce]
  );

  const handleContentEdit = useCallback(
    (index, editedContent) => {
      const updatedContents = [...currentContents];
      updatedContents[index] = editedContent;

      if (isMobile) {
        setMobileContents(updatedContents);
      } else {
        setDesktopContents(updatedContents);
      }

      announce(MESSAGES.SUCCESS.CONTENT_UPDATED);
    },
    [isMobile, currentContents, setMobileContents, setDesktopContents, announce]
  );
  return (
    <Box dir={isMobile ? "rtl" : "ltr"}>
      {currentContents.length > showCaseLimit ? (
        <Alert
          variant="filled"
          sx={{ color: "#fff", mt: -3, mb: 1 }}
          severity="warning"
        >
          تعداد کل عناصر را {showCaseLimit} به عدد کاهش دادید که موجب میشود
          تعداد {currentContents.length - showCaseLimit} از موارد نمایش داده
          نشود
        </Alert>
      ) : (
        <></>
      )}
      <DeviceToggle isMobile={isMobile} onChange={setIsMobile} />

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="showcase-contents" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 min-h-[250px] p-4 bg-gray-50 rounded-lg shadow-inner ltrFor"
            >
              {currentContents.map((content, index) => (
                <Draggable
                  key={content.id}
                  draggableId={content.id.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ContentGrid
                        item={content}
                        index={index}
                        onDelete={handleContentDelete}
                        onEdit={handleContentEdit}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {currentContents.length < showCaseLimit && (
        <motion.div
          className="mt-4 h-[200px] cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-gray-100 transition-colors"
          onClick={() => setIsFormOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          <Typography variant="h6" color="primary">
            افزودن محتوا ({showCaseLimit - currentContents.length} باقی مانده)
          </Typography>
        </motion.div>
      )}

      <Dialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <ContentForm
          onSubmit={handleContentSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      </Dialog>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default React.memo(Step3ShowCase);
