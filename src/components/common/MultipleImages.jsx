import { Close } from "@mui/icons-material";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import { Box, Button, Checkbox, FormControlLabel } from "@mui/material";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { baseUrl, DOWNLOAD_FILE } from "../../helpers/api-routes";
import { Gallery } from "../../pages";
import { Modal } from "../common";
const MultipleImages = ({
  files,
  setFiles,
  selectedProductImage,
  setselectedProductImage,
  noMedia = false,
  resizing,
  setResizing,
  returnArrayGallery = false,
}) => {
  const removeFile = (name) => {
    setFiles([...files].filter((file) => file.name !== name));
  };
  const [ondrag, setOnDrag] = useState(false);
  const [files2, setFiles2] = useState([]);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  /*   const [selectedProductImage, setselectedProductImage] = useState([]);
   */
  return (
    <Box
      sx={{ display: "flex", alignItems: "flex-end", gap: 3, flexWrap: "wrap" }}
    >
      {" "}
      {noMedia ? (
        <>
          <Dropzone
            onDrop={(acceptedFiles) => {
              setFiles([...files, ...acceptedFiles]);
            }}
            onDragEnter={() => setOnDrag(true)}
            onDragLeave={() => setOnDrag(false)}
          >
            {({ getRootProps, getInputProps }) => (
              <section>
                <Box
                  {...getRootProps()}
                  sx={{
                    width: "130px",
                    height: "130px",
                    backgroundColor: (theme) =>
                      theme.palette.mode === "light"
                        ? "#fff"
                        : theme.palette.background.paper,
                    border: ondrag ? "" : "1px solid #ccc",
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "36px",
                    flexDirection: "column",
                    padding: "10px",
                  }}
                  className={ondrag ? "enterDrag" : ""}
                >
                  <input {...getInputProps()} accept="image/*" />
                  <AddAPhotoOutlinedIcon
                    sx={{
                      color: (theme) =>
                        theme.palette.mode === "light"
                          ? "rgb(107 114 128)"
                          : "rgba(255, 255, 255, 0.7)",
                    }}
                    fontSize="large"
                  />
                  <Box
                    sx={{
                      color: (theme) =>
                        theme.palette.mode === "light"
                          ? "rgb(107 114 128)"
                          : "rgba(255, 255, 255, 0.7)",
                    }}
                    className="text-xs text-center  mt-3 "
                    style={{ lineHeight: "23px" }}
                  >
                    فایل بکشید و رها کنید یا کلیک کنید
                  </Box>
                </Box>
              </section>
            )}
          </Dropzone>
        </>
      ) : (
        <>
          <Box
            onClick={() => setOpenUploadModal(true)}
            sx={{
              width: "130px",
              height: "130px",
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? "#fff"
                  : theme.palette.background.paper,
              border: ondrag ? "" : "1px solid #ccc",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "36px",
              flexDirection: "column",
              padding: "10px",
            }}
            className={ondrag ? "enterDrag" : ""}
          >
            <AddAPhotoOutlinedIcon
              sx={{
                color: (theme) =>
                  theme.palette.mode === "light"
                    ? "rgb(107 114 128)"
                    : "rgba(255, 255, 255, 0.7)",
              }}
              fontSize="large"
            />
            <Box
              sx={{
                color: (theme) =>
                  theme.palette.mode === "light"
                    ? "rgb(107 114 128)"
                    : "rgba(255, 255, 255, 0.7)",
              }}
              className="text-xs text-center  mt-3 "
              style={{ lineHeight: "23px" }}
            >
              جهت اپلود عکس کلیک کنید
            </Box>
          </Box>
        </>
      )}
      {/*     */}
      {!noMedia && (
        <Box
          sx={{
            width: "130px",
            height: "130px",
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? "#fff"
                : theme.palette.background.paper,
            border: ondrag ? "" : "1px solid #ccc",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "36px",
            flexDirection: "column",
            padding: "10px",
          }}
          onClick={() => setOpenImageModal(true)}
          className="cursor-pointer"
        >
          <CollectionsOutlinedIcon
            sx={{
              color: (theme) =>
                theme.palette.mode === "light"
                  ? "rgb(107 114 128)"
                  : "rgba(255, 255, 255, 0.7)",
            }}
            fontSize="large"
          />
          <Box
            className="text-xs text-center  mt-3"
            style={{ lineHeight: "23px" }}
            sx={{
              color: (theme) =>
                theme.palette.mode === "light"
                  ? "rgb(107 114 128)"
                  : "rgba(255, 255, 255, 0.7)",
            }}
          >
            برای انتخاب عکس از گالری کلیک کنید
          </Box>
        </Box>
      )}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}
      >
        {files
          .map((file) => [URL.createObjectURL(file), file.name])
          .map((preview) => (
            <Box sx={{ position: "relative" }} key={preview[1]}>
              <Close
                onClick={() => removeFile(preview[1])}
                sx={{
                  backgroundColor: "error.main",
                  color: "#FFF",
                  fontSize: "16px",
                  borderRadius: "10px",
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.2)",
                  },
                  zIndex: "2",
                }}
              />
              <img
                src={preview[0]}
                alt=""
                style={{
                  height: "130px",
                  width: "130px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </Box>
          ))}
        {!noMedia &&
          selectedProductImage?.map((item, index) => (
            <Box sx={{ position: "relative" }} key={index}>
              <Close
                onClick={() => {
                  var temp = [...selectedProductImage];
                  var nf = temp.filter((r) => r !== item);
                  setselectedProductImage(nf);
                }}
                sx={{
                  backgroundColor: "error.main",
                  color: "#FFF",
                  fontSize: "16px",
                  borderRadius: "10px",
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.2)",
                  },
                  zIndex: "2",
                }}
              />
              <img
                src={`${baseUrl}/${DOWNLOAD_FILE}/${
                  returnArrayGallery ? item.id : item
                }?size=tiny`}
                alt=""
                style={{
                  height: "130px",
                  width: "130px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </Box>
          ))}
      </Box>
      <Modal
        open={openImageModal}
        close={() => {
          setOpenImageModal(false);
        }}
        title="انتخاب عکس از گالری"
        autoWidth={true}
        noPadding={true}
      >
        <div className="h-full overflow-y-auto pl-12 xl:min-w-[95vw]">
          {/*    <div className="flex">
            <span></span>
          </div> */}
          <Gallery
            choosable={true}
            returnArrayGallery={returnArrayGallery}
            setSelceted={(e) => {
              if (returnArrayGallery) {
                // If receiving multiple images (as array)
                if (Array.isArray(e)) {
                  const newImages = e.map((id) => ({
                    id: id,
                    fullObject: true,
                  }));
                  setselectedProductImage([
                    ...selectedProductImage,
                    ...newImages,
                  ]);
                } else {
                  // Single image case
                  var temp = [...selectedProductImage];
                  temp.push({ id: e, fullObject: true });
                  setselectedProductImage(temp);
                }
                setOpenImageModal(false);
              } else {
                // Original behavior for single image
                var temp = [...selectedProductImage];
                temp.push(e);
                setselectedProductImage(temp);
                setOpenImageModal(false);
              }
            }}
          />
        </div>
      </Modal>
      <Modal
        open={openUploadModal}
        close={() => {
          setOpenUploadModal(false);
        }}
        title="اپلود عکس  "
        autoWidth={true}
        noPadding={true}
      >
        <div className="flex flex-col justify-center items-center gap-2">
          <Dropzone
            onDrop={(acceptedFiles) => {
              setFiles2([...files2, ...acceptedFiles]);
            }}
            onDragEnter={() => setOnDrag(true)}
            onDragLeave={() => setOnDrag(false)}
          >
            {({ getRootProps, getInputProps }) => (
              <section>
                <Box
                  {...getRootProps()}
                  sx={{
                    width: "130px",
                    height: "130px",
                    backgroundColor: (theme) =>
                      theme.palette.mode === "light"
                        ? "#fff"
                        : theme.palette.background.paper,
                    border: ondrag ? "" : "1px solid #ccc",
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "36px",
                    flexDirection: "column",
                    padding: "10px",
                    cursor: "pointer",
                  }}
                  className={ondrag ? "enterDrag" : ""}
                >
                  <input {...getInputProps()} accept="image/*" />
                  <AddAPhotoOutlinedIcon
                    sx={{
                      color: (theme) =>
                        theme.palette.mode === "light"
                          ? "rgb(107 114 128)"
                          : "rgba(255, 255, 255, 0.7)",
                    }}
                    fontSize="large"
                  />
                  <Box
                    sx={{
                      color: (theme) =>
                        theme.palette.mode === "light"
                          ? "rgb(107 114 128)"
                          : "rgba(255, 255, 255, 0.7)",
                    }}
                    className="text-xs text-center  mt-3 "
                    style={{ lineHeight: "23px" }}
                  >
                    فایل بکشید و رها کنید یا کلیک کنید
                  </Box>
                </Box>
              </section>
            )}
          </Dropzone>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            {files2
              .map((file) => [URL.createObjectURL(file), file.name])
              .map((preview) => (
                <Box sx={{ position: "relative" }} key={preview[1]}>
                  <Close
                    onClick={() => removeFile(preview[1])}
                    sx={{
                      backgroundColor: "error.main",
                      color: "#FFF",
                      fontSize: "16px",
                      borderRadius: "10px",
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "scale(1.2)",
                      },
                      zIndex: "2",
                    }}
                  />
                  <img
                    src={preview[0]}
                    alt=""
                    style={{
                      height: "130px",
                      width: "130px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                </Box>
              ))}
          </Box>
          <FormControlLabel
            control={<Checkbox checked={resizing} />}
            onChange={() => {
              setResizing(!resizing);
            }}
            label={<h2 className=" text-[0.78rem]"> تبدیل عکس ها به webp </h2>}
          />
          <div className="flex justify-between items-center gap-7">
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setFiles2([]);
                setOpenUploadModal(false);
              }}
            >
              انصراف
            </Button>
            <Button
              onClick={() => {
                setFiles(files2);
                setFiles2([]);
                setOpenUploadModal(false);
              }}
              variant="contained"
            >
              تایید
            </Button>
          </div>
        </div>
      </Modal>
    </Box>
  );
};

export default MultipleImages;
