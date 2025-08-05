/* eslint-disable react-hooks/exhaustive-deps */
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Tab,
  Tabs,
} from "@mui/material";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import ReactCrop from "react-image-crop";
import Resizer from "react-image-file-resizer";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { MultipleImages, NumberInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { ADD_GALLERY_IMAGE, baseUrl } from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const PIXEL_RATIO = 4;
const UploadImageGallery = ({ setAllRows, allRows, setOpen }) => {
  const [crop, setCrop] = useState({
    unit: "%",
    x: 0,
    y: 0,

    aspect: 12 / 12,
    width: 100,
    height: 100,
  });
  const { token } = useSelector((state) => state.user);

  const [src, setSrc] = useState();
  const [filename, setfilename] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [croping, setCroping] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [quality, setQuality] = useState(100);
  const [height, setHeight] = useState(500);
  const [ondrag, setOnDrag] = useState(false);

  const [loading, setLoading] = useState(false);
  const [blob, setBlob] = useState();
  const [blobType, setBlobType] = useState("");
  const [preview, setPreview] = useState();
  const [files, setFiles] = useState([]);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const onLoad = useCallback((img) => {
    /*     imgRef.current = img;
     */
  }, []);
  useEffect(() => {
    if (filename) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setSrc(reader.result));
      reader.readAsDataURL(filename);
    }
  }, [filename]);
  const blobUrlRef = useRef("");

  function onDownloadCropClick() {
    if (!previewCanvasRef.current) {
      throw new Error("Crop canvas does not exist");
    }

    previewCanvasRef.current.toBlob((bl) => {
      if (!bl) {
        throw new Error("Failed to create blob");
      }
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }

      setBlob(bl);
      blobUrlRef.current = URL.createObjectURL(bl);
      /*    setPreview(blobUrlRef.current); */
    });
  }

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const ctx = canvas.getContext("2d");

    canvas.width = crop.width * PIXEL_RATIO;
    canvas.height = crop.height * PIXEL_RATIO;

    ctx.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    canvas.toBlob((blob) => {
      const previewUrl = URL.createObjectURL(blob);

      setBlob(blob);
      setPreview(previewUrl);
      setBlobType(blob.type);
    }, blobType);
  }, [completedCrop]);

  const resizedCropedImage = (image) => {
    if (filename.type === "image/svg+xml" || filename.type === "image/gif") {
      var data = new FormData();
      data.append(
        "files",
        image,
        filename.name?.split(".")[0] +
          (filename.type === "image/svg+xml" ? ".svg" : ".gif")
      );
      uploadImageHandler(data);
    } else {
      if (image !== null) {
        try {
          Resizer.imageFileResizer(
            image,
            Number(height),
            Number(height),
            "webp",
            Number(quality) > 100 ? 100 : Number(quality),
            0,
            (uri) => {
              var data = new FormData();
              data.append("files", uri, filename.name?.split(".")[0] + ".webp");
              uploadImageHandler(data);
            },
            "blob"
          );
        } catch (err) {}
      }
    }
  };

  const handleUploadImage = () => {
    /*  var bl = blob ? blob : onDownloadCropClick(); */
    if (resizing && croping) {
      resizedCropedImage(blob ? blob : preview);
    } else if (resizing && !croping) {
      resizedCropedImage(preview);
    } else if (!resizing && croping) {
      var data = new FormData();
      data.append("files", blob ? blob : preview);
      uploadImageHandler(data);
    } else {
      resizedCropedImage(preview);
    }
  };
  const uploadMultiple = async () => {
    const resizedFiles = [];

    for (let x = 0; x < files.length; x++) {
      if (files[x].type === "image/svg+xml" || files[x].type === "image/gif") {
        resizedFiles.push(files[x]);
      } else {
        const resizedFile = await new Promise((resolve) => {
          Resizer.imageFileResizer(
            files[x],
            1000,
            1000,
            "webp",
            80,
            0,
            (uri) => {
              resolve(uri);
            },
            "blob"
          );
        });
        resizedFiles.push(resizedFile);
      }
    }

    const fd = new FormData();

    resizedFiles.forEach((file, index) => {
      if (
        files[index].type === "image/svg+xml" ||
        files[index].type === "image/gif"
      ) {
        fd.append(
          "files",
          file,
          files[index].name?.split(".")[0] +
            (files[index].type === "image/svg+xml" ? ".svg" : ".gif")
        );
      } else {
        fd.append("files", file, files[index].name?.split(".")[0] + ".webp");
      }
    });
  };
  const uploadDirect = () => {
    const fd = new FormData();
    for (let x = 0; x < files.length; x++) {
      fd.append("files", files[x]);
    }
    uploadImageHandler(fd);
  };
  const uploadImageHandler = (data) => {
    setLoading(true);
    axiosInstance
      .post(`${baseUrl}/${ADD_GALLERY_IMAGE}`, data, configReq(token))
      .then((res) => {
        setLoading(false);
        toast.success("با موفقیت آپلود شد");
        var temp = [...res.data.data, ...allRows];

        setAllRows(temp);
        setOpen(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  return (
    <div>
      <Box
        sx={{ borderBottom: 1, borderColor: "divider" }}
        className="relative z-10"
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="  آپلود تکی و تجمیعی عادی" {...a11yProps(0)} />
          <Tab label="  آپلود تکی با امکانات" {...a11yProps(1)} />
          <Tab label="  آپلود جمعی (تغییر فرمت به webp)" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <div className="croper-wrpaer">
        <TabPanel value={value} index={0}>
          <div className="flex w-full max-w-[400px] mt-5 justify-center">
            {" "}
            <MultipleImages files={files} setFiles={setFiles} noMedia />
          </div>
          <div className="flex justify-center mt-5 gap-6">
            <Button
              sx={{ width: "140px" }}
              disabled={loading}
              onClick={uploadDirect}
              variant="contained"
            >
              {loading ? <CircularProgress /> : <> ثبت اطلاعات</>}
            </Button>
            <Button
              onClick={() => setOpen(false)}
              sx={{ width: "140px" }}
              disabled={loading}
              variant="contained"
              color="error"
            >
              انصراف
            </Button>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <>
            {" "}
            <Alert variant="outlined" severity="info">
              تمامی عکس ها جز تایپ svg و gif به webp تبدیل میشوند
            </Alert>
            <div className="flex w-full justify-center">
              <Dropzone
                onDrop={(acceptedFiles) => {
                  setfilename(acceptedFiles[0]);
                  setPreview(acceptedFiles[0]);
                }}
                onDragEnter={() => setOnDrag(true)}
                onDragLeave={() => setOnDrag(false)}
              >
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <Box
                      {...getRootProps()}
                      style={{
                        width: "165px",
                        height: "165px",
                        backgroundColor: "#fff",
                        border: ondrag ? "" : "1px solid #ccc",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "36px",
                        flexDirection: "column",
                      }}
                      className={ondrag ? "enterDrag" : ""}
                    >
                      <input {...getInputProps()} />
                      <AddAPhotoOutlinedIcon
                        className=" text-gray-500"
                        fontSize="inherit"
                      />
                      <span className="text-xs text-center text-gray-500 mt-3">
                        فایل بکشید و رها کنید یا کلیک کنید
                      </span>
                    </Box>
                  </section>
                )}
              </Dropzone>
            </div>
            {croping ? (
              <>
                {" "}
                {src && (
                  <>
                    {" "}
                    <div className="img-croper-body my-5">
                      {filename && (
                        <ReactCrop
                          style={{ maxHeight: "100%" }}
                          crop={crop}
                          onChange={(crop, percentCrop) => setCrop(percentCrop)}
                          onComplete={(c) => setCompletedCrop(c)}
                        >
                          {" "}
                          <img
                            ref={imgRef}
                            alt="Crop me"
                            src={src}
                            onLoad={onLoad}
                          />
                        </ReactCrop>
                      )}
                    </div>
                    <canvas
                      style={{ width: 0, height: 0, display: "none" }}
                      ref={previewCanvasRef}
                      width="0"
                      height="0"
                    />
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center my-3">
                {src && <img src={src} alt="" width={200} height={200} />}
              </div>
            )}
            <div className="flex justify-center mt-5 gap-6">
              <FormControlLabel
                control={<Checkbox checked={croping} />}
                onChange={() => {
                  setCroping(!croping);
                }}
                label={<h2 className=" text-[0.78rem]"> استفاده از کراپر</h2>}
              />
              <FormControlLabel
                control={<Checkbox checked={resizing} />}
                onChange={() => {
                  setResizing(!resizing);
                }}
                label={<h2 className=" text-[0.78rem]"> کم کردن حجم عکس </h2>}
              />
            </div>
            {resizing ? (
              <div className="grid md:grid-cols-2 gap-7 mt-7">
                {" "}
                <NumberInput
                  label=" درصد کیفیت عکس"
                  change={setQuality}
                  value={quality}
                />{" "}
                <NumberInput
                  label="  حداکثر ارتفاع"
                  change={setHeight}
                  value={height}
                />
              </div>
            ) : (
              <></>
            )}
            <div className="flex justify-center mt-5 gap-6">
              <Button
                sx={{ width: "140px" }}
                disabled={loading}
                onClick={handleUploadImage}
                variant="contained"
              >
                {loading ? <CircularProgress /> : <> ثبت اطلاعات</>}
              </Button>
              <Button
                sx={{ width: "140px" }}
                disabled={loading}
                variant="contained"
                color="error"
                onClick={() => setOpen(false)}
              >
                انصراف
              </Button>
            </div>
          </>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Alert variant="outlined" severity="info">
            تمامی عکس ها جز تایپ svg و gif به webp تبدیل میشوند
          </Alert>
          <div className="flex w-full max-w-[400px] justify-center">
            {" "}
            <MultipleImages files={files} setFiles={setFiles} noMedia />
          </div>

          <div className="flex justify-center mt-5 gap-6">
            <Button
              sx={{ width: "140px" }}
              disabled={loading}
              onClick={uploadMultiple}
              variant="contained"
            >
              {loading ? <CircularProgress /> : <> ثبت اطلاعات</>}
            </Button>
            <Button
              onClick={() => setOpen(false)}
              sx={{ width: "140px" }}
              disabled={loading}
              variant="contained"
              color="error"
            >
              انصراف
            </Button>
          </div>
        </TabPanel>
      </div>
    </div>
  );
};
export default UploadImageGallery;
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ px: 3 }}>
          <>{children}</>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
