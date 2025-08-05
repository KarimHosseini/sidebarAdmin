import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Dropdown,
  Modal,
  NumberInput,
  TextInput,
  UploadImage,
} from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_FACILITIES_PARENT,
  DELETE_FACILITIES_PARENT,
  EDIT_FACILITIES_PARENT,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const FaciltyParentModal = ({
  open,
  close,
  prevData = {},
  forEdit,
  setAllRows,
  allRows,
  GATES,
  financier,
  guarantors,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [selectedProductImage, setselectedProductImage] = useState();
  const { userPermissions } = useSelector((state) => state.relationals);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(prevData || {});
  const [avatar, setAvatar] = useState();
  const [avatar2, setAvatar2] = useState();
  const [selectedProductImage2, setselectedProductImage2] = useState();

  const { themeColor } = useSelector((state) => state.themeColor);
  const useDarkMode = themeColor === "dark";
  useEffect(() => {
    if (prevData) {
      setData({
        ...prevData,
        Title: prevData.title,
        IsActive: prevData.isActive,
        hasGurantor: Boolean(prevData.guarantorId),
      });
      setselectedProductImage(prevData.galleryId);
      setselectedProductImage2(prevData.cardImageId);

      setSelectedCategory(prevData.categoryIds || []);
    }
  }, [prevData]);
  const resetData = () => {
    setData({});
    setAvatar();
    setAvatar2();
    setselectedProductImage2();
    setselectedProductImage();
    setSelectedCategory([]);
  };
  const submitData = () => {
    const formData = new FormData();
    formData.append("Title", data.Title);
    formData.append("ChargeType", data.chargeType);
    formData.append("Description", data.description);
    formData.append("GetFacilityDescription", data.getFacilityDescription);
    formData.append("financierId", data.financierId);
    formData.append("shortName", data.shortName);
    formData.append("showChargeWallet", Boolean(data.showChargeWallet));

    formData.append("MaxLoanAmount", data.maxLoanAmount);
    if(data.guarantorId && data.hasGurantor) formData.append("guarantorId", data.guarantorId);

    formData.append("MonthCountPreview", data.monthCountPreview);
    formData.append("YearlyProfit", data.yearlyProfit);
    /*     formData.append("OnlyCanUseFacilityWallet", data.onlyCanUseFacilityWallet);
     */
    formData.append("HasPreFactor", Boolean(data.hasPreFactor));
    formData.append("Order", data.order);
    if (data.chargeTypeModel)
      formData.append("ChargeTypeModel", data.chargeTypeModel);
    formData.append("Link", data.link);

    formData.append("CanUseFacilityWallet", Boolean(data.canUseFacilityWallet));
    formData.append("maxAgeToSubmit",data.maxAgeToSubmit);
    if (avatar) formData.append("Files", avatar);
    formData.append("IsActive", Boolean(data.IsActive));
    if (selectedProductImage) {
      formData.append(
        "FromGallery",
        selectedProductImage ? selectedProductImage : ""
      );
    }
    if (selectedProductImage2) {
      formData.append(
        "CardImageId",
        selectedProductImage2 ? selectedProductImage2 : ""
      );
    }
    if (avatar2) formData.append("CardImage", avatar2);

    selectedCategory.map((item) => {
      formData.append("CategoryIds", JSON.stringify(item));
    });
    if (forEdit) {
      formData.append("Id", data.id);
    }
    var temp = [...allRows];
    if (data.Title) {
      setLoading(true);
      if (forEdit) {
        axiosInstance
          .put(
            `${baseUrl}/${EDIT_FACILITIES_PARENT}`,
            formData,
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
            `${baseUrl}/${CREATE_FACILITIES_PARENT}`,
            formData,
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
    } else if (!data.Title) {
      toast.error("نام  را وارد کنید");
    }
  };
  const deleteAttr = () => {
    setLoading(true);
    axiosInstance
      .delete(
        `${baseUrl}/${DELETE_FACILITIES_PARENT}?id=${data.id}`,
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
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCategory(typeof value === "string" ? value.split(",") : value);
  };
  useEffect(() => {
    var temp = [];
    selectedCategory.map((item) => {
      temp.push(GATES.find((it) => it.id === item).title);
    });
    setSelectedCategoryTitle(temp);
  }, [selectedCategory]);
  return (
    <Modal
      open={open}
      close={() => {
        close();
        resetData();
      }}
      autoWidth
      title={` ${forEdit ? "ویرایش" : "افزودن"}  تسهیلات`}
    >
      <div className="md:w-[800px] flex flex-col gap-4">
        <>
          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="نام  "
              change={(e) => setData({ ...data, Title: e })}
              currentValue={data.Title}
            />
            <TextInput
              label="نام  کوتاه"
              change={(e) => setData({ ...data, shortName: e })}
              currentValue={data.shortName}
            />{" "}
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              onClick={() => {
                setSelectedCategory([]);
              }}
            >
              حذف همه دسته بندی ها
            </Button>
            <Button
              onClick={() => {
                var temp = [];
                GATES.map((item) => temp.push(item.id));
                setSelectedCategory(temp);
              }}
            >
              انتخاب همه دسته بندی ها
            </Button>
          </div>
          <FormControl>
            <InputLabel id="demo-multiple-checkbox-label">
              دسته بندی ها
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={selectedCategory}
              onChange={handleChange}
              input={<OutlinedInput label="دسته بندی ها" />}
              renderValue={(selected) => selectedCategoryTitle.join(", ")}
            >
              {GATES.map((name) => (
                <MenuItem key={name.id} value={name.id}>
                  <Checkbox checked={selectedCategory.indexOf(name.id) > -1} />
                  <ListItemText primary={name.title} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-3">
            {/*         <>
            <span className="my-3 col-span-4 font-bold">-دسته بندی ها</span>
            {GATES.map((item, index) => {
              return (
                <div key={item.id} className="flex gap-2 items-center">
                  <Checkbox
                    checked={Boolean(
                      selectedCategory.find((it) => it === item.id)
                    )}
                    onChange={() => {
                      var temp = [...selectedCategory];
                      if (selectedCategory.find((it) => it === item.id)) {
                        temp = temp.filter((it) => it !== item.id);
                      } else {
                        temp.push(item.id);
                      }
                      setSelectedCategory(temp);
                    }}
                  />
                  <span>{item.title}</span>
                </div>
              );
            })}
          </> */}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Dropdown
              title="نوع شارژ "
              data={STATUS}
              value={STATUS.find((item) => item?.id === data?.chargeType)}
              change={(e) => setData({ ...data, chargeType: e.id })}
            />
            <Dropdown
              title=" تامین کننده"
              data={financier}
              value={financier.find((item) => item?.id === data?.financierId)}
              change={(e) => setData({ ...data, financierId: e.id })}
            />{" "}
            <div className="flex items-center gap-3">
              <span className="w-full">دارای تضمین کننده : </span>
              <Switch
                checked={data?.hasGurantor}
                onChange={() =>
                  setData({ ...data, hasGurantor: !data?.hasGurantor })
                }
              />
            </div>
            {data?.hasGurantor && (
              <Dropdown
                title=" تضمین کننده "
                data={guarantors}
                value={guarantors?.find(
                  (item) => item?.id === data?.guarantorId
                )}
                change={(e) => setData({ ...data, guarantorId: e.id })}
              />
            )}
            {data?.chargeType !== 2 && (
              <Dropdown
                title="مدل شارژ"
                data={STATUS2}
                value={STATUS2.find(
                  (item) => item?.id === data?.chargeTypeModel
                )}
                change={(e) => setData({ ...data, chargeTypeModel: e.id })}
                disabled={data.chargeType !== 1}
              />
            )}
            <NumberInput
              label="اولویت"
              change={(e) => setData({ ...data, order: e })}
              value={data.order}
            />
            <TextInput
              label="سقف وام  "
              change={(e) => setData({ ...data, maxLoanAmount: e })}
              currentValue={data.maxLoanAmount || ""}
              price
              number
            />{" "}
            <TextInput
              label="تعداد ماه نمایش  "
              change={(e) => setData({ ...data, monthCountPreview: e })}
              currentValue={data.monthCountPreview}
            />{" "}
            <TextInput
              label="سود سالیانه به درصد "
              change={(e) => setData({ ...data, yearlyProfit: e })}
              currentValue={data.yearlyProfit}
            />
             <TextInput
              label="حداکثر سن کاربر  "
              change={(e) => setData({ ...data, maxAgeToSubmit: e })}
              currentValue={data.maxAgeToSubmit || ""}
              number
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Box sx={{ direction: "ltr !important" }}>
              <span>توضیحات در صفحه محصول اخذ وام</span>
              <Editor
                tinymceScriptSrc="/js/tinymce/tinymce.min.js"
                onEditorChange={(e) => setData({ ...data, description: e })}
                value={data?.description || ""}
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
              <span>توضیحات در پنل کاربری</span>
              <Editor
                tinymceScriptSrc="/js/tinymce/tinymce.min.js"
                onEditorChange={(e) =>
                  setData({ ...data, getFacilityDescription: e })
                }
                value={data?.getFacilityDescription || ""}
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

          <div className="leftInput">
            {" "}
            <TextInput
              label="  (https://)   لینک درخواست اعتبار   "
              change={(e) => setData({ ...data, link: e })}
              currentValue={data.link}
              ltr
            />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex items-center gap-3">
              <span className="w-full">فعال/غیر فعال : </span>
              <Switch
                checked={data?.IsActive}
                onChange={() => setData({ ...data, IsActive: !data?.IsActive })}
              />
            </div>{" "}
            <div className="flex items-center gap-3">
              <span className="w-full ">خرید با کیف پول تسهیلاتی : </span>
              <Switch
                checked={data?.canUseFacilityWallet}
                onChange={() =>
                  setData({
                    ...data,
                    canUseFacilityWallet: !data?.canUseFacilityWallet,
                  })
                }
              />
            </div>{" "}
            <div className="flex items-center gap-3">
              <span className="w-full">دارای پیش فاکتور: </span>
              <Switch
                checked={data?.hasPreFactor}
                onChange={() =>
                  setData({ ...data, hasPreFactor: !data?.hasPreFactor })
                }
              />
            </div>{" "}
            <div className="flex items-center gap-3">
              <span className="w-full">
                {" "}
                نمایش شارژ کیف پول در صفحه سفارش:{" "}
              </span>
              <Switch
                checked={data?.showChargeWallet}
                onChange={() =>
                  setData({
                    ...data,
                    showChargeWallet: !data?.showChargeWallet,
                  })
                }
              />
            </div>{" "}
          </div>
        </>
        <div className="grid grid-cols-2">
          <div className="flex flex-col gap-2">
            <span className="font-bold"> - عکس تسهیلات</span>
            <UploadImage
              file={avatar}
              change={setAvatar}
              address={data.galleryId}
              selectedProductImage={selectedProductImage}
              setselectedProductImage={setselectedProductImage}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-bold"> - عکس کارت</span>{" "}
            <UploadImage
              file={avatar2}
              change={setAvatar2}
              address={data.cardImageId}
              selectedProductImage={selectedProductImage2}
              setselectedProductImage={setselectedProductImage2}
            />
          </div>
        </div>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {userPermissions?.LoanSettings?.delete && (
            <IconButton size="large" onClick={() => setConfirmDelete(true)}>
              <Delete sx={{ color: "red" }} />
            </IconButton>
          )}
          <div style={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            color="primary"
            onClick={submitData}
            disabled={loading}
            sx={{ width: { xs: "50%", md: "auto" } }}
          >
            {loading ? <CircularProgress /> : <>ثبت اطلاعات</>}
          </Button>{" "}
        </Box>

        <Confirm
          message="آیا از حذف این تسهیلات اطمینان دارید؟"
          close={() => setConfirmDelete(false)}
          submit={deleteAttr}
          open={confirmDelete}
        />
      </div>
    </Modal>
  );
};

export default FaciltyParentModal;
const STATUS = [
  {
    id: 1,
    title: "شارژشونده",
    style: null,
    styleDark: null,
  },
  {
    id: 2,
    title: "غیر شارژشونده",
    style: null,
    styleDark: null,
  },
];
const STATUS2 = [
  {
    id: 1,
    title: "تسهیم",
    style: null,
    styleDark: null,
  },
  {
    id: 2,
    title: "درگاه ",
    style: null,
    styleDark: null,
  },
];
