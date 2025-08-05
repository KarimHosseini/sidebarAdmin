import { Delete } from "@mui/icons-material";
import { Box, Button, CircularProgress, IconButton } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Dropdown, Modal, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_CATEGORY_INSURANCE,
  DELETE_CATEGORY_INSURANCE,
  EDIT_CATEGORY_INSURANCE,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const CategoryInsuranceModal = ({
  open,
  close,
  prevData = {},
  forEdit,
  setAllRows,
  allRows,
  GATES,
  TYPES,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [selectedProductImage, setselectedProductImage] = useState();
  const { userPermissions } = useSelector((state) => state.relationals);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(prevData || { totalExpirationDay: 365 });
  const [avatar, setAvatar] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { themeColor } = useSelector((state) => state.themeColor);
  const useDarkMode = themeColor === "dark";
  useEffect(() => {
    setData(prevData?.id ? prevData : { totalExpirationDay: 365 });
  }, [prevData]);
  const resetData = () => {
    setData({ totalExpirationDay: 365 });
    setAvatar([]);
    setselectedProductImage();
  };

  const submitData = () => {
    var sendingData = {
      categoryId: id,
      discountInsuranceMarkup: data.discountInsuranceMarkup,
      insuranceMarkup: data.insuranceMarkup,
      insuranceId: data.insuranceId,
      categoryType: data.categoryType,
      totalExpirationDay: data.totalExpirationDay,
      coverage: data.coverage,
      termsAndConditions: data.termsAndConditions,
    };
    if (forEdit) {
      sendingData = { ...sendingData, id: data.id };
    }
    var temp = [...allRows];

    setLoading(true);
    if (forEdit) {
      axiosInstance
        .put(
          `${baseUrl}/${EDIT_CATEGORY_INSURANCE}`,
          sendingData,
          configReq(token)
        )
        .then((res) => {
          setLoading(false);
          toast.success("با موفقیت ویرایش شد");
          var index = temp.findIndex((item) => item.id === data.id);
          temp[index] = res.data.data;
          setAllRows(temp);
          close();
          resetData();
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
          if (err.response.status === 401) {
            dispatch(logout());
          }
        });
    } else {
      axiosInstance
        .post(
          `${baseUrl}/${CREATE_CATEGORY_INSURANCE}`,
          sendingData,
          configReq(token)
        )
        .then((res) => {
          temp.unshift(res.data.data);

          setAllRows(temp);
          setLoading(false);
          toast.success("با موفقیت اضافه شد");
          close();
          resetData();
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
          if (err.response.status === 401) {
            dispatch(logout());
          }
        });
    }
  };
  const deleteAttr = () => {
    setLoading(true);
    axiosInstance
      .delete(
        `${baseUrl}/${DELETE_CATEGORY_INSURANCE}?id=${data.id}`,
        configReq(token)
      )
      .then((res) => {
        setLoading(false);
        var temp = [...allRows];
        var newData = temp.filter((item) => item.id !== data.id);
        setAllRows(newData);
        setConfirmDelete(false);
        toast.success("با موفقیت حذف شد");
        close();
        resetData();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);

        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  return (
    <Modal
      open={open}
      close={() => {
        close();
        resetData();
      }}
      title={` ${forEdit ? "ویرایش" : "افزودن"}  خدمات ${searchParams.get(
        "title"
      )}`}
    >
      <div className="md:grid grid-cols-2 gap-3">
        <TextInput
          label="مارک آپ خدمات"
          change={(e) => setData({ ...data, insuranceMarkup: e })}
          currentValue={data.insuranceMarkup || ""}
          number
          price
          allowZero
        />
        <TextInput
          label="تخفیف خدمات"
          change={(e) => setData({ ...data, discountInsuranceMarkup: e })}
          currentValue={data.discountInsuranceMarkup || ""}
          number
          allowZero
          priceLabel="%"
          price
        />
        <Dropdown
          value={GATES?.find((g) => g.id === data?.insuranceId)}
          change={(e) => setData({ ...data, insuranceId: e.id })}
          data={GATES}
          title="خدمات "
        />{" "}
        <TextInput 
          label="مهلت انقضا"
          change={(e) => setData({ ...data, totalExpirationDay: e })}
          currentValue={data.totalExpirationDay || ""}
          number
          allowZero
          priceLabel="روز"
          price
        />
        {GATES?.find((g) => g.id === data?.insuranceId)?.type !== 1 && prevData?.isInsurance ? (
          <Dropdown
            value={TYPES?.find((g) => g.id === data?.categoryType)}
            change={(e) => setData({ ...data, categoryType: e.id })}
            data={TYPES}
            title="نوع دسته بندی "
          />
        ) : (
          <>
            {" "}
            <div className="col-span-2 grid grid-cols-2 gap-2">
              <Box sx={{ direction: "ltr !important" }}>
                <span>سطح پوشش</span>
                <Editor
                  tinymceScriptSrc="/js/tinymce/tinymce.min.js"
                  onEditorChange={(e) => setData({ ...data, coverage: e })}
                  value={data?.coverage || ""}
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
              <Box sx={{ direction: "ltr !important" }}>
                <span>شرایط و قوانین</span>
                <Editor
                  tinymceScriptSrc="/js/tinymce/tinymce.min.js"
                  onEditorChange={(e) =>
                    setData({ ...data, termsAndConditions: e })
                  }
                  value={data?.termsAndConditions || ""}
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
            </div>
          </>
        )}
      </div>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {userPermissions?.categoryInsurance?.delete && (
          <IconButton size="large" onClick={() => setConfirmDelete(true)}>
            <Delete sx={{ color: "red" }} />
          </IconButton>
        )}
        <div style={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          color="primary"
          onClick={submitData}
          disabled={loading || !data.totalExpirationDay}
          sx={{ width: { xs: "50%", md: "auto" } }}
        >
          {loading ? <CircularProgress /> : <>ثبت اطلاعات</>}
        </Button>{" "}
      </Box>
      <Confirm
        message="آیا از حذف این خدمات اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteAttr}
        open={confirmDelete}
      />
    </Modal>
  );
};

export default CategoryInsuranceModal;
