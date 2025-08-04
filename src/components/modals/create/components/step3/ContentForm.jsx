import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NumberInput, UploadImage } from "../../../../common";
import { MESSAGES } from "../../config/messages";

const ContentForm = ({
  onSubmit,
  onCancel,
  initialValues,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    showTitle: true,
    priority: "",
    Image: null,
    position: "down",
    top: 0,
    right: 0,
    titleColor: "#000",
    ...initialValues,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [selectedProductImage, setSelectedProductImage] = useState(null);
  const [removePreview, setRemovePreview] = useState(false);

  const { themeColor } = useSelector((state) => state.themeColor);
  const useDarkMode = themeColor === "dark";

  useEffect(() => {
    if (initialValues?.selectedProductImage) {
      setSelectedProductImage(initialValues.selectedProductImage);
    }
  }, [initialValues]);

  const handleInputChange = (field) => (event) => {
    const value = event.target?.value ?? event;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title?.trim()) {
      newErrors.title = MESSAGES.ERRORS.REQUIRED_FIELD;
    }
    if (!formData.link?.trim()) {
      newErrors.link = MESSAGES.ERRORS.INVALID_URL;
    }
    if (!avatar && !selectedProductImage && !isEditing) {
      newErrors.image = MESSAGES.ERRORS.REQUIRED_FIELD;
    }
    /*     if (!formData.priority && !isEditing) {
      newErrors.priority = MESSAGES.ERRORS.REQUIRED_FIELD;
    } else if (
      formData.priority &&
      (formData.priority < 1 || formData.priority > 100)
    ) {
      newErrors.priority = MESSAGES.ERRORS.INVALID_PRIORITY;
    } */
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        ...formData,
        avatar,
        selectedProductImage,
      });
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {isEditing ? MESSAGES.LABELS.EDIT_CONTENT : MESSAGES.LABELS.ADD_CONTENT}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label={MESSAGES.LABELS.TITLE}
          value={formData.title}
          onChange={handleInputChange("title")}
          error={!!errors.title}
          helperText={errors.title}
          sx={{ mb: 2 }}
        />{" "}
        <div className="leftInput">
          <TextField
            fullWidth
            label={MESSAGES.LABELS.LINK}
            value={formData.link}
            onChange={handleInputChange("link")}
            error={!!errors.link}
            helperText={errors.link}
            sx={{ mb: 2 }}
          />
        </div>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            {MESSAGES.LABELS.DESCRIPTION}
          </Typography>
          <Editor
            tinymceScriptSrc="/js/tinymce/tinymce.min.js"
            onEditorChange={handleInputChange("description")}
            value={formData?.description || ""}
            init={{
              menubar: false,
              selector: "textarea#open-source-plugins",
              plugins:
                "print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen codesample hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount textpattern noneditable charmap",
              imagetools_cors_hosts: ["picsum.photos"],
              toolbar:
                "undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen preview save print | ltr rtl",
              toolbar_sticky: true,
              autosave_ask_before_unload: true,
              directionality: "rtl",
              autosave_interval: "30s",
              autosave_prefix: "{path}{query}-{id}-",
              autosave_restore_when_empty: false,
              autosave_retention: "2m",
              importcss_append: true,
              height: 300,
              image_caption: true,
              quickbars_selection_toolbar:
                "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
              noneditable_noneditable_class: "mceNonEditable",
              toolbar_mode: "sliding",
              skin: useDarkMode ? "oxide-dark" : "oxide",
              content_css: useDarkMode ? "dark" : "default",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
          />
          {errors.description && (
            <Typography color="error" variant="caption">
              {errors.description}
            </Typography>
          )}
        </Box>
        <div className="flex text-center justify-between px-3">
          <div className="flex items-center">
            <span className="text-xs">نمایش متن :</span>
            <Checkbox
              checked={formData.showTitle}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  showTitle: !prev.showTitle,
                }))
              }
            />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-xs font-bold">موقعیت نوشته در تصویر :</span>
          <div className="flex gap-5 items-center mt-2">
            <div
              onClick={() =>
                setFormData((prev) => ({ ...prev, position: "up" }))
              }
              className="flex gap-3 items-center"
            >
              <Radio checked={formData.position === "up"} />
              <span className="text-xs">نمایش متن بالا تصویر</span>
            </div>
            <div
              onClick={() =>
                setFormData((prev) => ({ ...prev, position: "down" }))
              }
              className="flex gap-3 items-center"
            >
              <Radio checked={formData.position === "down"} />
              <span className="text-xs">نمایش متن پایین تصویر</span>
            </div>
            <div
              onClick={() =>
                setFormData((prev) => ({ ...prev, position: "in" }))
              }
              className="flex gap-3 items-center"
            >
              <Radio checked={formData.position === "in"} />
              <span className="text-xs">نمایش متن درون تصویر</span>
            </div>
          </div>
        </div>
        {formData.position === "in" && (
          <div className="md:grid gap-3 grid-cols-2 flex flex-col mt-4">
            <NumberInput
              min={-100}
              value={formData.top}
              change={(e) => setFormData((prev) => ({ ...prev, top: e }))}
              label="فاصله از بالا (درصد)"
            />
            <NumberInput
              min={-100}
              value={formData.right}
              change={(e) => setFormData((prev) => ({ ...prev, right: e }))}
              label="فاصله از راست (درصد)"
            />
          </div>
        )}
        {/* 
        {!isEditing && (
          <NumberInput
            min={1}
            max={100}
            value={formData.priority}
            change={(e) => setFormData((prev) => ({ ...prev, priority: e }))}
            label="اولویت"
            error={!!errors.priority}
            helperText={errors.priority}
          />
        )} */}
        <Box sx={{ mt: 4 }}>
          <UploadImage
            file={avatar}
            change={(e) => {
              setAvatar(e);
              setRemovePreview(false);
            }}
            selectedProductImage={selectedProductImage}
            setselectedProductImage={(e) => {
              setSelectedProductImage(e);
              setRemovePreview(false);
            }}
            needPreview={true}
            setNeedPreview={(e) =>
              setFormData((prev) => ({ ...prev, Image: e }))
            }
            removePreview={removePreview}
            error={!!errors.image}
            helperText={errors.image}
          />
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button onClick={onCancel}>{MESSAGES.LABELS.CANCEL}</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? (
            <CircularProgress size={24} />
          ) : isEditing ? (
            MESSAGES.LABELS.SAVE
          ) : (
            MESSAGES.LABELS.SAVE
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(ContentForm);
