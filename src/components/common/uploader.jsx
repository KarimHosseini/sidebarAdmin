import { Delete } from "@mui/icons-material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Box, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import Lightbox from "react-image-lightbox";
import { baseUrl, DOWNLOAD_FILE } from "../../helpers/api-routes";
const Uploader = ({
  title = "انتخاب فایل",
  setFiles,
  type = "file",
  defualt,
  check,
}) => {
  const [preview, setPreview] = useState();
  const [ondrag, setOnDrag] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (defualt) {
      setPreview(`${baseUrl}/${DOWNLOAD_FILE}/${defualt}`);
    }
  }, [defualt]);
  const readURL = (file) => {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = (e) => res(e.target.result);
      reader.onerror = (e) => rej(e);
      reader.readAsDataURL(file);
    });
  };
  return (
    <form className=" relative rounded-md w-full flex justify-center border-[#0000003b]">
      {!preview ? (
        <div className="flex items-center">
          <Dropzone
            onDrop={async (acceptedFiles) => {
              setFiles(acceptedFiles[0]);
              if (type === "image") {
                setPreview(await readURL(acceptedFiles[0]));
              } else {
                setPreview(acceptedFiles[0]);
              }
            }}
            onDragEnter={() => setOnDrag(true)}
            onDragLeave={() => setOnDrag(false)}
            accept={check && { "image/*": [".jpeg", ".png", ".jpg", ".webp"] }}
          >
            {({ getRootProps, getInputProps }) => (
              <section>
                <Box
                  {...getRootProps()}
                  style={{
                    width: "340px",
                    height: "56px",
                    backgroundColor: "#fff",
                    border: ondrag ? "" : "1px solid #ccc",
                    borderRadius: "5px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "16px",
                  }}
                  className={ondrag ? "enterDrag" : ""}
                >
                  <input {...getInputProps()} />
                  <AttachFileIcon
                    className=" text-gray-500"
                    fontSize="inherit"
                  />
                  <span className="text-xs text-gray-500">
                    فایل بکشید و رها کنید یا کلیک کنید
                  </span>
                </Box>
              </section>
            )}
          </Dropzone>
        </div>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            /*   justifyContent: "flex-end", */
            width: "100%",
          }}
        >
          {type === "file" ? (
            <span>{preview?.name}</span>
          ) : (
            <img
              src={preview}
              onClick={() => setOpen(true)}
              alt=""
              className="cursor-pointer"
              style={{ width: "60px", height: "60px", objectFit: "cover" }}
            />
          )}

          <IconButton
            onClick={() => {
              setFiles();
              setPreview();
            }}
            sx={{ margin: "0 !important", padding: "0 !important" }}
          >
            <Delete />
          </IconButton>
        </Box>
      )}
      {open && (
        <Lightbox mainSrc={preview} onCloseRequest={() => setOpen(false)} />
      )}
    </form>
  );
};

export default Uploader;
