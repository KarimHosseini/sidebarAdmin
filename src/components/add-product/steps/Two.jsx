/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Add } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  ClickAwayListener,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ATTRIBUTES,
  baseUrl,
  DOWNLOAD_FILE,
  PRODUCT_ATTR_MULTIEDIT,
} from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";
import { logout } from "../../../redux/slices/user";
import { SearchableDropdown } from "../../common";
import axiosInstance from "../../dataFetch/axiosInstance";
import { CreateAttrValue } from "../../modals";

const StepTwo = ({ nextStep, createdId, createdName }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { themeColor } = useSelector((state) => state.themeColor);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState([]);

  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedValuesName, setSelectedValuesName] = useState("");
  const [selectedAllValues, setSelectedALlValues] = useState({});
  const [allChecked, setallChecked] = useState({});

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("all");

  const [openCreate, setOpenCreate] = useState(false);

  const getAttributes = () => {
    axiosInstance(
      `${baseUrl}/${ATTRIBUTES}?Limit=1000&Page=1`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        let copy = [...data.data];
        copy.sort((a, b) => a["title"].localeCompare(b["title"]));
        setAttributes(copy);

        // Extract unique groups
        const uniqueGroups = [
          ...new Set(copy.map((item) => item.group)),
        ].filter(Boolean);
        setGroups(uniqueGroups);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };

  useEffect(() => {
    if (!openCreate) {
      setSelectedAttribute([]);
      getAttributes();
    }
  }, [openCreate]);

  const submitAttrsLoop = async () => {
    if (Object.keys(selectedAllValues).length) {
      setLoading(true);
      var temp = [];

      for (var property in selectedAllValues) {
        if (selectedAllValues.hasOwnProperty(property)) {
          selectedAllValues[property]?.map((item) => {
            temp.push({
              subAttribute: item?.id,
              preview: item?.preview ? item?.preview : false,
            });
          });
        }
      }
      try {
        setLoading(true);

        const response = await axiosInstance.put(
          `${baseUrl}/${PRODUCT_ATTR_MULTIEDIT}`,
          { productId: createdId, attributes: JSON.stringify(temp) },
          configReq(token)
        );
        setLoading(false);

        toast.success("تمامی موارد با موفقیت ثبت شدند");
        setSelectedAttribute([]);
        setSelectedValues({});
        nextStep();
      } catch (error) {
        setLoading(false);
        setSelectedValues({});
        toast.error(error.response?.data?.message);
      }
    } else {
      toast.error("انتخاب حداقل یک ویژگی ضروری است");
    }
  };

  useEffect(() => {
    if (selectedValuesName) {
      setSelectedALlValues({
        ...selectedAllValues,
        [selectedValuesName]: selectedValues,
      });
      if (selectedValues.length === 0) {
        setallChecked({ ...allChecked, [selectedValuesName]: false });
      }
    }
  }, [selectedValues]);

  const handlePreview = (checked, name) => {
    var temp = [];
    setallChecked({ ...allChecked, [name]: checked });
    selectedAllValues[name]?.map((item) => {
      temp.push({ ...item, preview: checked });
    });
    setSelectedALlValues({
      ...selectedAllValues,
      [name]: temp,
    });
  };

  const handleClickAway = () => {
    setActive("");
  };
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1000px]">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mb: 3,
            px: { xs: 2, md: 0 },
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            فیلتر بر اساس گروه:
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            <Chip
              label="نمایش همه"
              onClick={() => setSelectedGroup("all")}
              color={selectedGroup === "all" ? "primary" : "default"}
              variant={selectedGroup === "all" ? "filled" : "outlined"}
              sx={{
                mb: 1,
                bgcolor:
                  selectedGroup === "all" && themeColor === "dark"
                    ? "primary.dark"
                    : "",
                color:
                  selectedGroup === "all" && themeColor === "dark"
                    ? "white"
                    : "",
              }}
            />
            {groups.map((group, index) => (
              <Chip
                key={index}
                label={group}
                onClick={() => setSelectedGroup(group)}
                color={selectedGroup === group ? "primary" : "default"}
                variant={selectedGroup === group ? "filled" : "outlined"}
                sx={{
                  mb: 1,
                  bgcolor:
                    selectedGroup === group && themeColor === "dark"
                      ? "primary.dark"
                      : "",
                  color:
                    selectedGroup === group && themeColor === "dark"
                      ? "white"
                      : "",
                }}
              />
            ))}
            <Chip
              label="فاقد گروه"
              onClick={() => setSelectedGroup("no-group")}
              color={selectedGroup === "no-group" ? "primary" : "default"}
              variant={selectedGroup === "no-group" ? "filled" : "outlined"}
              sx={{
                mb: 1,
                bgcolor:
                  selectedGroup === "no-group" && themeColor === "dark"
                    ? "primary.dark"
                    : "",
                color:
                  selectedGroup === "no-group" && themeColor === "dark"
                    ? "white"
                    : "",
              }}
            />
          </Stack>
        </Box>

        <div className="flex gap-4 items-center border-b pb-4 px-4 md:px-0">
          <span className="text-sm">نمایش ویژگی های مهم</span>
          <div className="text-sm w-[110px]">نام ویژگی</div>
          <span className="text-sm">مقادیر</span>
        </div>

        <ClickAwayListener onClickAway={handleClickAway}>
          <div>
            <>
              {(selectedGroup === "all"
                ? attributes
                : selectedGroup === "no-group"
                ? attributes.filter((attr) => !attr.group)
                : attributes.filter((attr) => attr.group === selectedGroup)
              ).map((item, index) => (
                <div key={`${item.id}-${index}-${selectedGroup}`}>
                  <Box
                    sx={{
                      background: (theme) =>
                        theme.palette.mode === "light"
                          ? active === item.id
                            ? "#fffdd2"
                            : "#f0f0f0"
                          : theme.palette.background.paper,
                    }}
                    className="flex items-center gap-14 my-4 md:px-0 px-2 rounded-md"
                    onClick={() => setActive(item.id)}
                  >
                    <Checkbox
                      disabled={
                        !selectedAllValues[item.name] ||
                        selectedAllValues[item.name]?.length === 0
                      }
                      checked={allChecked[item.name] ? true : false}
                      onChange={(e) =>
                        handlePreview(e.target.checked, item.name)
                      }
                    />
                    <div className="flex items-center gap-2 w-[190px]">
                      <div className="w-[20px] h-[20px] flex items-center">
                        {" "}
                        {item.galleryId && (
                          <img
                            src={`${baseUrl}/${DOWNLOAD_FILE}/${item.galleryId}?size=tiny`}
                            style={{ height: "20px" }}
                            alt=""
                          />
                        )}
                      </div>

                      <div
                        className="p-2 px-4 text-base"
                        style={{ lineHeight: "23px" }}
                      >
                        {item?.title} :{" "}
                      </div>
                    </div>
                    <Box
                      sx={{ width: "100%", display: "flex", mb: "10px" }}
                      onMouseDown={() => setSelectedValuesName(item.name)}
                    >
                      <SearchableDropdown
                        data={item.values}
                        change={(e) => {
                          setSelectedValues(e);
                        }}
                        values={selectedAllValues[item.name] || []}
                      />
                      <div className="flex justify-end items-center w-12 pl-2 pt-3">
                        <IconButton
                          onClick={() => {
                            setOpenCreate(item);
                          }}
                          className="customAddButton"
                        >
                          <Add />
                        </IconButton>
                      </div>
                    </Box>
                  </Box>
                </div>
              ))}
            </>
          </div>
        </ClickAwayListener>

        <div className="flex justify-between items-start my-6">
          <Link to={`/products/${createdId}#step2`}>
            <Button variant="outlined">بازگشت</Button>
          </Link>
          <Button
            onClick={submitAttrsLoop}
            variant="contained"
            size="large"
            disabled={loading}
          >
            {loading ? <CircularProgress /> : <> ثبت اطلاعات</>}
          </Button>
        </div>
        <CreateAttrValue
          propsId={openCreate?.id}
          title={openCreate?.title}
          open={openCreate}
          close={() => setOpenCreate(false)}
          type={openCreate?.type}
          allData={openCreate?.values}
        />
        <Alert sx={{ my: 3 }} variant="outlined" severity="info">
          انتخاب چک باکس ویژگی مهم به منزله انتخاب ویژگی ها برای نمایش در بخش
          ویژگی های مهم در صفحه محصولات می باشد. ، بصورت پیش فرض 3 تا ویژگی فعال
          می باشد و درصورت انتخاب ویژگی جدید، جایگزین موارد قبلی می گردد.
        </Alert>
      </div>
    </div>
  );
};

export default StepTwo;
