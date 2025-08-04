import { Collections, Delete, PhotoCamera } from "@mui/icons-material";
import { Box, Button, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { baseUrl, DOWNLOAD_FILE } from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { Gallery } from "../../pages";
import { Modal } from "../common";
import axiosInstance from "../dataFetch/axiosInstance";
import UploadImageHandler from "./uploadHandler";

const UploadImage = ({
  title = "انتخاب تصویر",
  change,
  file,
  address = null,
  selectedProductImage,
  setselectedProductImage,
  icons = false,
  needPreview = false,
  setNeedPreview,
  removePreview,
  removeApi,
  id,
  setFileNames,
  hasRemoved,
  justGallery = false,
  noUpload = false,
}) => {
  const [preview, setPreview] = useState();
  const [openImageModal, setOpenImageModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    if (address) {
      setPreview(`${baseUrl}/${DOWNLOAD_FILE}/${address}`);
    }
  }, [address]);
  useEffect(() => {
    if (removePreview) setPreview();
  }, [removePreview]);
  const removeImage = () => {
    if (removeApi && id) {
      axiosInstance
        .delete(
          `${baseUrl}/${removeApi}?id=${id}`,

          configReq(token)
        )
        .then((res) => {
          if (res.data.code === 200) {
            toast.success("با موفقیت حذف شد");
            change("");
            setselectedProductImage(null);
            setPreview();
            if (needPreview) {
              setNeedPreview();
              hasRemoved();
            }
          }
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
        });
    } else {
      change("");
      setselectedProductImage(null);
      setPreview();
      if (needPreview) {
        setNeedPreview();
      }
    }
  };
  return (
    <form>
      {(file?.length === 0 || !file) && !preview && !selectedProductImage ? (
        /*  <div className={`flex items-center ${col ? "flex-col" :""} `}>
          <Button variant="outlined">
         آپلود
            <IconButton color="primary" component="label">
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={(e) => {
                  change(e.target.files[0]);
                  let reader = new FileReader();
                  reader.onload = (e) => {
                    setPreview(e.target.result);
                  };
                  reader.readAsDataURL(e.target.files[0]);
                }}
              />
              <PhotoCamera />
            </IconButton>
          </Button>
          <Button onClick={() => setOpenImageModal(true)} variant="outlined">
            انتخاب  از گالری
          </Button>
        </div> */
        <div className={`flex items-center gap-2 flex-wrap`}>
          {icons ? (
            <>
              <IconButton
                onClick={() => setUploadModal(true)}
                color="primary"
                component="label"
              >
                <PhotoCamera />
              </IconButton>

              {/*       <IconButton
                color="primary"
                onClick={() => setOpenImageModal(true)}
              >
                <Collections />
              </IconButton> */}
            </>
          ) : (
            <>
              {noUpload === false && (
                <Button
                  sx={{ width: "78px", padding: "0 !important" }}
                  variant="outlined"
                  onClick={() => setUploadModal(true)}
                >
                  <label
                    className="flex items-center justify-center"
                    style={{ width: "100%", height: "100%" }}
                  >
                    {" "}
                    آپلود
                  </label>
                </Button>
              )}

              {justGallery === false && (
                <Button
                  sx={{ width: "78px" }}
                  onClick={() => setOpenImageModal(true)}
                  variant="outlined"
                >
                  انتخاب از گالری
                </Button>
              )}
            </>
          )}
        </div>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {selectedProductImage ? (
            <img
              src={`${baseUrl}/${DOWNLOAD_FILE}/${selectedProductImage}?size=tiny`}
              alt=""
              className="md:w-[60px] md:h-[60px] w-[40px] h-[40px]"
            />
          ) : (
            <img
              src={preview}
              alt=""
              className="md:w-[60px] md:h-[60px] w-[40px] h-[40px]"
            />
          )}

          <IconButton onClick={removeImage} sx={{ mr: 1 }}>
            <Delete />
          </IconButton>
        </Box>
      )}
      <Modal
        open={openImageModal}
        close={() => {
          setOpenImageModal(false);
        }}
        title="انتخاب عکس از گالری"
        autoWidth={true}
      >
        <div className="h-full overflow-y-auto">
          {/*    <div className="flex">
            <span></span>
          </div> */}
          <Gallery
            choosable={true}
            setSelceted={(e) => {
              setselectedProductImage(e);
              setOpenImageModal(false);
              if (needPreview) {
                setNeedPreview(`${baseUrl}/${DOWNLOAD_FILE}/${e}`);
                setselectedProductImage(e);
              }
            }}
          />
        </div>
      </Modal>
      <Modal
        open={uploadModal}
        close={() => {
          setUploadModal(false);
        }}
        title="آپلود"
        autoWidth={true}
      >
        <div className="h-full overflow-y-auto">
          <UploadImageHandler
            setOpen={setUploadModal}
            setData={(e) => {
              change(e);
            }}
            setFileNames={setFileNames}
            setPreviewH={(e) => {
              setPreview(e);
              if (needPreview) {
                setNeedPreview(e);
              }
            }}
          />
        </div>
      </Modal>
    </form>
  );
};

export default UploadImage;
