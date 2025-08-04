import { Delete } from "@mui/icons-material";
import { Box, IconButton, Switch } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  baseUrl,
  CATEGORIES,
  DELETE_SHOWCASE,
  EDIT_SHOWCASE,
} from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";
import {
  ActionButton,
  Dropdown,
  Loading,
  Modal,
  MultipleImages,
  NumberInput,
  TextInput,
} from "../../common";
import axiosInstance from "../../dataFetch/axiosInstance";
import Confirm from "../Confirm";
import PulbicAtterbutites from "../dnd/pulbicAtterbutites";

const EditShowCaseModal = ({
  open,
  close,
  data,
  attributes,
  categoriesData,
  allRows,
  setAllRows,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);

  const [allData, setAllData] = useState([]);
  const [currentValue, setcurrentValue] = useState({});
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [openDelete, setOpenDelete] = useState(false);

  // form fields
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedProductImage, setselectedProductImage] = useState([]);
  const [viewType, setViewType] = useState("دسته بندی");
  const [filter, setFilter] = useState("دسته بندی");
  const [resizing, setresizing] = useState(false);

  const [link1, setLink1] = useState("");
  const [link2, setLink2] = useState("");
  const [link3, setLink3] = useState("");
  const [link4, setLink4] = useState("");
  const [priority, setPriority] = useState(1);
  const [limit, setLimit] = useState(10);
  const [category, setCategory] = useState("");
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (data && categories) {
      setTitle(data.title);
      setLink1(data.link1);
      setLink2(data.link2);
      setPriority(data.priority);
      setLimit(data.showCaseLimit);
      let currentCat = [...categories].find(
        (cat) => cat.id === parseInt(data.filterValue)
      );
      setCategory(currentCat || "");
      setActive(data.active);
      if (data.filter === "new") {
        setFilter("جدیدترین ها");
      } else if (data.filter === "recommend") {
        setFilter("پیشنهاد ها");
      } else if (data.filter === "category") {
        setFilter("دسته بندی");
      } else if (data.filter === "pattributes") {
        setFilter("ویژگی های عمومی");
      } else if (data.filter === "categorylist") {
        setFilter("دسته بندی ها");
      }
      var tempImage = [];
      if (data?.banner1GalleryId) {
        tempImage.push(data?.banner1GalleryId);
      }
      if (data?.banner2GalleryId) {
        tempImage.push(data?.banner2GalleryId);
      }
      if (data?.banner3GalleryId) {
        tempImage.push(data?.banner3GalleryId);
      }
      if (data?.banner4GalleryId) {
        tempImage.push(data?.banner4GalleryId);
      }
      setselectedProductImage(tempImage);
      var temp = [];
      data.filterValue?.split(",")?.map((items) => {
        if (data.filter === "pattributes") {
          const find = attributes?.data?.find(
            (item) => String(item.id) === items
          );

          if (find) {
            temp.push(find);
          }
        } else {
          const find = categoriesData?.data?.find(
            (item) => String(item.id) === items
          );

          if (find) {
            temp.push(find);
          }
        }
      });

      setcurrentValue({ data: temp });
    }
  }, [data, token, categories]);

  useEffect(() => {
    if (open) {
      setLoading(true);
      axiosInstance(
        `${baseUrl}/${CATEGORIES}?Page=${1}&Limit=${2000}`,
        configReq(token)
      )
        .then((res) => {
          const { data } = res;
          setLoading(false);
          if (data.code === 200) {
            setCategories(data.data);
          }
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  }, [open, token]);

  const submitData = () => {
    let fd = new FormData();
    fd.append("id", data.id);
    fd.append("title", title);
    fd.append("link1", link1);
    fd.append("link2", link2);
    fd.append("link3", link3);
    fd.append("link4", link4);
    fd.append("priority", parseInt(priority));
    fd.append("filter", data.filter);
    fd.append("active", active);
    fd.append("showCaseLimit", parseInt(limit));
    fd.append("filterValue", category?.id || null);
    fd.append("viewType", viewType === "لوازم جانبی" ? 1 : 0);

    if (files && files[0]) {
      fd.append("files", files[0]);
    }
    if (files && files[1]) {
      fd.append("files", files[1]);
    }
    if (files && files[2]) {
      fd.append("files", files[2]);
    }
    if (files && files[3]) {
      fd.append("files", files[3]);
    }
    selectedProductImage.map((item, index) => {
      fd.append(`banner${index + 1}GalleryId`, item);
    });
    var temp = [...allRows];

    if (title) {
      setLoading(true);
      axiosInstance
        .put(`${baseUrl}/${EDIT_SHOWCASE}`, fd, configReq(token))
        .then((res) => {
          setLoading(false);
          var index = temp.findIndex((item) => item.id === data.id);
          temp[index] = res.data.data;
          setAllRows(temp);
          toast.success("با موفقیت ویرایش شد");
          setFiles([]);
          setselectedProductImage([]);
          close();
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading(false);
        });
    } else if (!title) {
    }
  };
  const deleteItem = () => {
    if (data) {
      setLoading(true);
      axiosInstance
        .delete(`${baseUrl}/${DELETE_SHOWCASE}?id=${data.id}`, configReq(token))
        .then((res) => {
          var temp = [...allRows];
          var newData = temp.filter((item) => item.id !== data.id);
          setAllRows(newData);
          setLoading(false);
          setOpenDelete(false);
          close();
          toast.success("با موفقیت ویرایش شد");
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
          setOpenDelete(false);
        });
    }
  };
  const submitDataWithCategory = () => {
    var all_id = "";
    allData.map((item) => {
      all_id += `,${item.id}`;
    });
    let englishFilter;
    if (filter === "ویژگی های عمومی") {
      englishFilter = "pattributes";
    } else if (filter === "دسته بندی ها") {
      englishFilter = "categorylist";
    }
    let fd = new FormData();
    fd.append("id", data.id);
    fd.append("title", filter);
    fd.append("active", active);
    fd.append("filter", englishFilter);
    fd.append("filterValue", all_id.slice(1));
    fd.append("showCaseLimit", parseInt(limit));
    fd.append("priority", parseInt(priority));
    setLoading(true);
    axios
      .put(`${baseUrl}/${EDIT_SHOWCASE}`, fd, configReq(token))
      .then((res) => {
        setLoading(false);
        toast.success("با موفقیت ویرایش شد");
        setFiles([]);
        setselectedProductImage([]);
        var temp = [...allRows];
        var index = temp.findIndex((item) => item.id === data.id);
        temp[index] = res.data.data;
        setAllRows(temp);
        close();
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoading(false);
      });
  };

  return (
    <Modal open={open} close={close} title="ویرایش ویترین ">
      {loading && <Loading />}
      {/*     <Dropdown
        value={filter}
        change={setFilter}
        data={[
          "دسته بندی",
          "جدیدترین ها",
          "پیشنهاد ها",
          "ویژگی های عمومی",
          "دسته بندی ها",
        ]}
        title="فیلتر"
      /> */}
      {filter === "ویژگی های عمومی" || filter === "دسته بندی ها" ? (
        <>
          <PulbicAtterbutites data={currentValue} sendData={setAllData} />
          <NumberInput
            label="اولویت نمایش"
            change={setPriority}
            value={priority}
          />
          <NumberInput label=" محدودیت نمایش		" change={setLimit} value={limit} />
        </>
      ) : (
        <>
          {" "}
          <TextInput
            label="عنوان ویترین"
            change={setTitle}
            currentValue={title}
          />
          <Box className="grid md:grid-cols-2 gap-x-2 gap-y-2 ">
            <TextInput
              label="لینک تصویر اول"
              change={setLink1}
              currentValue={link1}
              ltr
            />
            <TextInput
              label="لینک تصویر دوم"
              change={setLink2}
              currentValue={link2}
              ltr
            />
            <TextInput
              label="لینک تصویر سوم"
              change={setLink3}
              currentValue={link3}
              ltr
            />
            <TextInput
              label="لینک تصویر چهارم"
              ltr
              change={setLink4}
              currentValue={link4}
            />
          </Box>
          {data?.filter === "category" && (
            <>
              <Dropdown
                value={category}
                change={setCategory}
                data={categories || []}
                title="دسته بندی"
              />
              <Dropdown
                value={viewType}
                change={setViewType}
                data={VEIWTYPES}
                title="مدل نمایشی "
              />
            </>
          )}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="bg-red-700 h-2 w-3 rounded-full"> </div>
              <span className="text-sm ">
                {" "}
                در پیشنهاد های ویژه عکس اول به منظور بک گراند دسکتاپ عکس دوم به
                منظور بک گراند موبایل و عکس سوم به منظور آیکون دسکتاپ و عکس
                چهارم برای آیکون موبایل استفاده می شود
              </span>
            </div>
          </div>
          {/*        <Box sx={{ display: "flex", gap: 2, my: 2, flexWrap: "wrap" }}>
            <Typography>تصاویر فعلی:</Typography>
            {[
              data?.banner1GalleryId,
              data?.banner2GalleryId,
              data?.banner3GalleryId,
              data?.banner4GalleryId,
            ].map((address, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center"
              >
                {" "}
                <img
                  src={
                    address ? `${baseUrl}/${DOWNLOAD_FILE}/${address}` : null
                  }
                  alt=""
                  style={{
                    height: "60px",
                    borderRadius: "5px",
                  }}
                />
                {address && <small className="text-xs"> عکس : {i + 1}</small>}
              </div>
            ))}
          </Box> */}
          <MultipleImages
            files={files}
            setFiles={setFiles}
            setResizing={setresizing}
            resizing={resizing}
            selectedProductImage={selectedProductImage}
            setselectedProductImage={setselectedProductImage}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
            className="gap-2"
          >
            <NumberInput
              label="اولویت نمایش"
              change={setPriority}
              value={priority}
            />
            <NumberInput
              label=" محدودیت نمایش		"
              change={setLimit}
              value={limit}
            />
          </Box>
          <Box>
            <span style={{ fontFamily: "IRANSansFa" }}>فعال/غیر فعال:</span>
            <Switch checked={active} onChange={() => setActive(!active)} />
          </Box>
        </>
      )}

      <Box sx={{ display: "flex" }}>
        {userPermissions?.showcases?.delete && (
          <IconButton onClick={() => setOpenDelete(true)}>
            <Delete color="error" />
          </IconButton>
        )}{" "}
        <div style={{ flexGrow: 1 }} />
        {userPermissions?.showcases?.update && (
          <ActionButton
            click={() => {
              if (filter === "ویژگی های عمومی" || filter === "دسته بندی ها") {
                submitDataWithCategory();
              } else {
                submitData();
              }
            }}
          />
        )}
      </Box>

      <Confirm
        message="آیا از حذف این ویترین اطمینان دارید؟"
        close={() => setOpenDelete(false)}
        submit={deleteItem}
        open={openDelete}
      />
    </Modal>
  );
};

export default EditShowCaseModal;
const VEIWTYPES = ["دسته بندی", "لوازم جانبی"];
