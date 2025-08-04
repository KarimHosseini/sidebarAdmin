import { Delete } from "@mui/icons-material";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  Radio,
} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  baseUrl,
  CREATE_SHOWCASE_IMAGE,
  DOWNLOAD_FILE,
  UPDATE_SHOWCASE_IMAGE,
} from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";
import { Modal, NumberInput, TextInput, UploadImage } from "../../common";
import axiosInstance from "../../dataFetch/axiosInstance";

const ImageContent = ({
  data,
  setData,
  deleteHandler,
  index,
  mobile,
  forEdit,
  limit,
  noText,
  storyIndex,
}) => {
  const [openImageModal, setOpenImageModal] = useState(false);
  const { themeColor } = useSelector((state) => state.themeColor);
  const useDarkMode = themeColor === "dark";
  const [datas, setDatas] = useState({});
  const [selectedProductImage, setselectedProductImage] = useState();
  const [avatar, setAvatar] = useState();
  const [removePreview, setRemovePreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const handleUpload = () => {
    if (forEdit) {
      setLoading(true);
      if (data?.id) {
        let fd2 = new FormData();
        /*   fd2.append("showCaseId", id); */

        fd2.append("id", data?.id);
        fd2.append("screenSize", mobile ? 0 : 1200);
        fd2.append("imageType", data?.type ? data?.type : 1);
        fd2.append("priority", index && !isNaN(Number(index)) ? index : "1");
        fd2.append("title", datas?.title);
        // fd2.append("description", datas?.description);
        fd2.append("link", datas?.link);
        fd2.append(
          "imageStyle",
          JSON.stringify({
            showTitle: datas?.showTitle,
            titleColor: datas?.titleColor,
            storyNumber: storyIndex,
            possiton: datas?.possiton,

            possition: datas?.possition,
            NumberInput: datas?.NumberInput,
            top: datas?.top,

            right: datas?.right,
          })
        );
        if (avatar) fd2.append("files", avatar);
        if (selectedProductImage || data?.galleryId)
          fd2.append("fromGallery", selectedProductImage || data?.galleryId);
        axiosInstance
          .put(`${baseUrl}/${UPDATE_SHOWCASE_IMAGE}`, fd2, configReq(token))
          .then((res) => {
            toast.success("با موفقیت ثبت شد");
            setData({ ...datas, selectedProductImage, avatar });
            setOpenImageModal(false);
            setDatas({});
            setLoading(false);
          })
          .catch((err) => {
            toast.error(err.response?.data?.message);
            setLoading(false);
          });
      } else {
        let fd2 = new FormData();
        fd2.append("screenSize", mobile ? 0 : 1200);
        fd2.append("imageType", noText ? 2 : data?.type ? data?.type : 1);
        fd2.append("priority", index ? index : "0");
        fd2.append("showCaseId", id);
        fd2.append("title", datas?.title || "");
        fd2.append("description", datas?.description || "");
        fd2.append("link", datas?.link);
        fd2.append(
          "imageStyle",
          JSON.stringify({
            showTitle: datas?.showTitle,
            titleColor: datas?.titleColor,
            storyNumber: storyIndex,
            possiton: datas?.possiton,
            possition: datas?.possition,
            NumberInput: datas?.NumberInput,
            right: datas?.right,
            top: datas?.top,
          })
        );
        if (avatar) fd2.append("files", avatar);
        if (selectedProductImage || data?.galleryId)
          fd2.append("fromGallery", selectedProductImage || data?.galleryId);
        axiosInstance
          .post(`${baseUrl}/${CREATE_SHOWCASE_IMAGE}`, fd2, configReq(token))
          .then((res) => {
            toast.success("با موفقیت ثبت شد");
            setData({
              ...datas,
              selectedProductImage,
              avatar,
              id: res?.data?.data?.id,
              galleryId: res?.data?.data?.galleryId,
            });
            setOpenImageModal(false);
            setDatas({});
            setLoading(false);
          })
          .catch((err) => {
            toast.error(err.response?.data?.message);
            setLoading(false);
          });
      }
    } else {
      setData({ ...datas, selectedProductImage, avatar });
      setOpenImageModal(false);
      setDatas({});
    }
  };

  useEffect(() => {
    if (!selectedProductImage && data) setselectedProductImage(data?.galleryId);
    if (!datas?.link && data) {
      setDatas(data);
    } else {
      if (mobile) {
        setDatas({
          top: 10,
          right: 10,
          possition: "down",
        });
      } else {
        setDatas({
          top: 5,
          right: 10,
          possition: "down",
        });
      }
    }
  }, [data]);
  return (
    <Fragment>
      {data ? (
        <div className="flex flex-col justify-between  h-[250px] border p-3 rounded-md">
          <img
            src={
              data.Image
                ? data.Image
                : `${baseUrl}/${DOWNLOAD_FILE}/${data?.galleryId}`
            }
            alt=""
            className="w-full h-60 rounded-t-md object-cover max-h-32"
          />
          <div className="flex items-center mt-3 justify-end">
            <a
              href={process.env.REACT_APP_DOMAIN_URL + data?.link}
              target="_blank"
              rel="noreferrer"
            >
              <RemoveRedEyeOutlinedIcon
                sx={{ fontSize: "1.4rem !important" }}
              />
            </a>
          </div>
          <div className="p-4 h-12 flex-col flex gap-2">
            {/*        <span className="text-base font-bold">{data.title}</span>
            <span className="text-xs ">
              {data?.description?.length > 100
                ? data?.description.slice(0, 100) + "..."
                : data?.description}
            </span> */}
          </div>
          <Box
            sx={{ justifyContent: forEdit ? "end" : "space-between" }}
            className="flex w-full mt-9 px-4"
          >
            <IconButton onClick={deleteHandler}>
              <Delete color="error" />
            </IconButton>

            <Button onClick={() => setOpenImageModal(true)}>ویرایش</Button>
          </Box>
        </div>
      ) : (
        <div
          onClick={() => setOpenImageModal(true)}
          className="w-full h-[250px] p-3 border rounded-md flex flex-col justify-between"
        >
          <div className="w-full h-[80px] items-center justify-center flex border rounded-md cursor-pointer">
            ویرایش
          </div>
          <span className="text-xs">
            اولویت :‌ {mobile ? index - 999 : index + 1}
          </span>
        </div>
      )}
      <Modal
        open={openImageModal}
        close={() => {
          setOpenImageModal(false);
        }}
        title={
          noText
            ? "  تنظیمات بنر "
            : `  ${mobile ? "موبایل" : "دسکتاپ"}  تنظیمات محتوای `
        }
        autoWidth={false}
      >
        <div className="h-full overflow-y-auto ">
          <div className="flex flex-col gap-4  p-3 mb-5 rounded-md">
            {!noText && (
              <>
                {" "}
                <div className="leftInput">
                  <TextInput
                    label=" لینک تصویر"
                    ltr
                    change={(e) => setDatas({ ...datas, link: e })}
                    currentValue={datas?.link}
                  />
                </div>
                <Box sx={{ direction: "ltr !important" }}>
                  <Editor
                    tinymceScriptSrc="/js/tinymce/tinymce.min.js"
                    onEditorChange={(e) => setDatas({ ...datas, title: e })}
                    value={datas?.title}
                    init={{
                      menubar: false,
                      selector: "textarea#open-source-plugins",
                      plugins:
                        "print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen     codesample   hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount  textpattern noneditable  charmap  ",
                      imagetools_cors_hosts: ["picsum.photos"],
                      toolbar:
                        "undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | ltr rtl",
                      toolbar_sticky: true,
                      autosave_ask_before_unload: true,
                      directionality: "rtl",
                      autosave_interval: "30s",
                      autosave_prefix: "{path}{query}-{id}-",
                      autosave_restore_when_empty: false,
                      autosave_retention: "2m",

                      importcss_append: true,

                      templates: [
                        {
                          title: "New Table",
                          description: "creates a new table",
                          content:
                            '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>',
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
                </Box>
                {/*      <TextInput
                  label="  متن"
                  change={(e) => setDatas({ ...datas, title: e })}
                  currentValue={datas?.title}
                />
                <TextInput
                  label="  توضیحات"
                  change={(e) => setDatas({ ...datas, description: e })}
                  currentValue={datas?.description}
                /> */}
                <div className="flex text-center justify-between px-3">
                  <div className="flex items-center">
                    <span className="text-xs">نمایش متن :</span>
                    <Checkbox
                      checked={datas?.showTitle}
                      onClick={() =>
                        setDatas({ ...datas, showTitle: !datas?.showTitle })
                      } /* checked={item.active} */
                    />
                  </div>
                  {/*           <ColorModal
                    label="رنگ متن"
                    color={datas?.titleColor || "#000"}
                    setColor={(e) => setDatas({ ...datas, titleColor: e })}
                  /> */}
                </div>
                <span className="text-xs font-bold">
                  موقعیت نوشته در تصویر :
                </span>
                <div className="flex gap-5 items-center">
                  <div
                    onClick={() => setDatas({ ...datas, possition: "up" })}
                    className="flex gap-3 items-center"
                  >
                    <Radio checked={datas.possition === "up"} />
                    <span className="text-xs">نمایش متن بالا تصویر</span>
                  </div>
                  <div
                    onClick={() => setDatas({ ...datas, possition: "down" })}
                    className="flex gap-3 items-center"
                  >
                    <Radio checked={datas.possition === "down"} />
                    <span className="text-xs">نمایش متن پایین تصویر</span>
                  </div>
                  <div
                    onClick={() => setDatas({ ...datas, possition: "in" })}
                    className="flex gap-3 items-center"
                  >
                    <Radio checked={datas.possition === "in"} />
                    <span className="text-xs">نمایش متن درون تصویر</span>
                  </div>
                </div>
                {datas.possition !== "in" ? (
                  <></>
                ) : (
                  <div className="md:grid gap-3 grid-cols-2 flex flex-col">
                    <NumberInput
                      min={-100}
                      value={datas?.top || 0}
                      change={(e) => setDatas({ ...datas, top: e })}
                      label="فاصله از بالا  (درصد)"
                    />

                    <NumberInput
                      min={-100}
                      value={datas?.right || 0}
                      change={(e) => setDatas({ ...datas, right: e })}
                      label="فاصله از راست  (درصد)"
                    />
                  </div>
                )}
              </>
            )}

            <UploadImage
              file={avatar}
              change={(e) => {
                setAvatar(e);
                setRemovePreview(false);
              }}
              address={null}
              selectedProductImage={selectedProductImage}
              setselectedProductImage={(e) => {
                setselectedProductImage(e);
                setRemovePreview(false);
              }}
              needPreview={true}
              setNeedPreview={(e) => setDatas({ ...datas, Image: e })}
              removePreview={removePreview}
            />
            <div className="flex justify-end">
              <Button
                /*                 disabled={loading}
                 */ onClick={handleUpload}
                variant="contained"
              >
                <>{loading ? <CircularProgress /> : <>ثبت اطلاعات</>}</>
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};

export default React.memo(ImageContent);
const fontWeight = [300, 400, 500, 600, 700, 800];
