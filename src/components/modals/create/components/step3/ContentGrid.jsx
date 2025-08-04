import { Delete, DragHandle, Edit as EditIcon } from "@mui/icons-material";
import { Dialog } from "@mui/material";
import { motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { MESSAGES } from "../../config/messages";
import { useShowcaseApi } from "../../hooks/useShowcaseApi";
import ContentForm from "./ContentForm";

const ContentGrid = ({ item, index, onDelete, onEdit }) => {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const { deleteShowcaseImage, editShowcaseImage } = useShowcaseApi(
    token,
    false
  );

  const processedContent = useMemo(() => {
    const processText = (text, maxLength) => {
      if (!text) return "";
      return (
        text.replace(/<[^>]*>/g, "").substring(0, maxLength) +
        (text.length > maxLength ? "..." : "")
      );
    };

    return {
      ...item,
      title: processText(item.title, 100),
      description: processText(item.description, 200),
      imageUrl: item.Image,
    };
  }, [item]);

  const handleDelete = async () => {
    if (window.confirm(MESSAGES.LABELS.CONFIRM_DELETE)) {
      if (id) {
        try {
          await deleteShowcaseImage(item.id);
          onDelete(index);
        } catch (err) {}
      } else {
        onDelete(index);
      }
    }
  };

  const handleEdit = () => {
    setIsEditFormOpen(true);
  };

  const handleEditSubmit = async (editedContent) => {
    if (id) {
      try {
        await editShowcaseImage(
          {
            ...item,
            ...editedContent,
            priority: item.priority,
          },
          id
        );

        onEdit(index, {
          ...item,
          ...editedContent,
          priority: item.priority,
        });
        setIsEditFormOpen(false);
      } catch (err) {}
    } else {
      onEdit(index, {
        ...item,
        ...editedContent,
        priority: item.priority,
      });
      setIsEditFormOpen(false);
    }
  };

  return (
    <>
      <motion.div
        className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <DragHandle className="absolute top-2 right-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors" />
        <motion.div
          className="absolute top-2 right-8 bg-primary-500 text-white px-2 py-0.5 rounded-full text-sm shadow-sm"
          whileHover={{ scale: 1.1 }}
        >
          {processedContent.priority}
        </motion.div>

        <div className="aspect-video overflow-hidden rounded-t-lg">
          <motion.img
            src={processedContent.imageUrl}
            alt={processedContent.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        </div>

        <div className="p-4">
          <h3 className="font-medium text-gray-900 line-clamp-1 mb-2">
            {processedContent.title}
          </h3>
          {processedContent.showTitle && processedContent.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {processedContent.description}
            </p>
          )}
        </div>

        <div className="absolute bottom-2 left-2 flex gap-1 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={handleDelete}
            className="p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm"
            title={MESSAGES.LABELS.DELETE}
          >
            <Delete className="w-5 h-5 text-red-500" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={handleEdit}
            className="p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm"
            title={MESSAGES.LABELS.EDIT}
          >
            <EditIcon className="w-5 h-5 text-blue-500" />
          </motion.button>
        </div>
      </motion.div>

      <Dialog
        open={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <ContentForm
          initialValues={item}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditFormOpen(false)}
          isEditing={true}
        />
      </Dialog>
    </>
  );
};

export default React.memo(ContentGrid);
