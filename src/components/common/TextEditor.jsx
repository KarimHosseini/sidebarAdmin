import { Paper } from "@mui/material";
import { Box } from "@mui/system";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import Resizer from "react-image-file-resizer";
import { useSelector } from "react-redux";
import {
  ADD_GALLERY_IMAGE,
  baseUrl,
  DOWNLOAD_FILE,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const TextEditor = ({
  value,
  change,
  hint = "",
  noBorder = false,
  smaller,
}) => {
  const { themeColor } = useSelector((state) => state.themeColor);
  const { token } = useSelector((state) => state.user);

  const useDarkMode = themeColor === "dark";
  return (
    <Paper
      sx={{
        border: noBorder ? "" : "1px solid #dbdfea",
        mb: 1,
        padding: noBorder ? "" : "15px 16px 15px 16px",
      }}
      elevation={0}
    >
      {" "}
      <Box sx={{ direction: "ltr !important" }}>
        <Editor
          tinymceScriptSrc="/js/tinymce/tinymce.min.js"
          onEditorChange={change}
          value={value}
          init={{
            selector: "textarea#open-source-plugins",
            plugins:
              "print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons",
            imagetools_cors_hosts: ["picsum.photos"],
            menubar: "file edit view insert format tools table help",
            toolbar:
              "undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen preview save print | insertfile image media template link anchor codesample | ltr rtl",
            toolbar_sticky: true,
            autosave_ask_before_unload: true,
            directionality: "rtl",
            autosave_interval: "30s",
            autosave_prefix: "{path}{query}-{id}-",
            autosave_restore_when_empty: false,
            autosave_retention: "2m",
            image_advtab: true,
            images_replace_blob_uris: true,
            images_reuse_filename: true,
            // ADD THIS LINE: This prevents TinyMCE from embedding data images (Base64)
            // for dragged/pasted images and forces them through the images_upload_handler.
            paste_data_images: false,

            images_upload_handler: async function (blobInfo, progress) {
              try {
                const formData = new FormData();
                const resizedFile = await new Promise((resolve) => {
                  Resizer.imageFileResizer(
                    blobInfo.blob(), // The Blob object from TinyMCE
                    10000,
                    10000,
                    "webp",
                    80,
                    0,
                    (uri) => {
                      resolve(uri);
                    },
                    "blob"
                  );
                });

                formData.append(
                  "files",
                  resizedFile,
                  blobInfo.filename().split(".")[0] + ".webp"
                );

                const response = await axios.post(
                  `${baseUrl}/${ADD_GALLERY_IMAGE}`,
                  formData,
                  {
                    ...configReq(token),
                    onUploadProgress: (event) => {
                      const percentCompleted = Math.round(
                        (event.loaded * 100) / event.total
                      );
                      progress(percentCompleted);
                    },
                  }
                );

                return `${baseUrl}/${DOWNLOAD_FILE}/${response.data.data[0].id}`;
              } catch (error) {
                console.error("Image upload failed:", error);
                // Important: Throw an error to TinyMCE if upload fails,
                // otherwise, it might still try to insert a broken image.
                throw new Error("Image upload failed. " + error.message);
              }
            },

            file_picker_callback: function (callback, value, meta) {
              if (meta.filetype === "image") {
                const input = document.createElement("input");
                input.setAttribute("type", "file");
                input.setAttribute("accept", "image/*");

                input.onchange = async function () {
                  const file = input.files[0];
                  if (!file) {
                    return; // User cancelled file selection
                  }

                  const formData = new FormData();
                  const resizedFile = await new Promise((resolve) => {
                    Resizer.imageFileResizer(
                      file,
                      10000,
                      10000,
                      "webp",
                      80,
                      0,
                      (uri) => {
                        resolve(uri);
                      },
                      "blob"
                    );
                  });
                  formData.append(
                    "files",
                    resizedFile,
                    file.name?.split(".")[0] + ".webp"
                  );

                  axios
                    .post(
                      `${baseUrl}/${ADD_GALLERY_IMAGE}`,
                      formData,
                      configReq(token)
                    )
                    .then((response) => {
                      const imageUrl = `${baseUrl}/${DOWNLOAD_FILE}/${response.data.data.id}`;
                      callback(imageUrl, { alt: file.name });
                    })
                    .catch((error) => {
                      console.error(
                        "Error uploading image from file picker:",
                        error
                      );
                      alert("Failed to upload image. Please try again."); // Provide user feedback
                    });
                };

                input.click();
              }
            },
            templates: [
              {
                title: "New Table",
                description: "creates a new table",
                content:
                  '<div class="mceTmpl"><table width="98%%" border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>',
              },
              {
                title: "Starting my story",
                description: "A cure for writers block",
                content: "Once upon a time...",
              },
              {
                title: "New list with dates",
                description: "New List with dates",
                content:
                  '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>',
              },
            ],
            template_cdate_format:
              "[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]",
            template_mdate_format:
              "[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]",
            height: smaller ? 200 : 600,
            image_caption: true,
            quickbars_selection_toolbar:
              "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
            noneditable_noneditable_class: "mceNonEditable",
            toolbar_mode: "sliding",
            contextmenu: "link image imagetools table",
            skin: useDarkMode ? "oxide-dark" : "oxide",
            content_css: useDarkMode ? "dark" : "default",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
        />
      </Box>
    </Paper>
  );
};

export default TextEditor;
