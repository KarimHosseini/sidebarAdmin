/* eslint-disable no-loop-func */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Add } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  ClickAwayListener,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ATTRIBUTES,
  baseUrl,
  DOWNLOAD_FILE,
  PRODUCT_ATTR_MULTIEDIT,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { SearchableDropdown } from "../common";
import axiosInstance from "../dataFetch/axiosInstance";
import { CreateAttrValue } from "../modals";

const SingleProductAttrs = ({ data, refresh }) => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const { themeColor } = useSelector((state) => state.themeColor);

  const [openCreate, setOpenCreate] = useState(false);
  const [loading, setLoading] = useState(false);

  const [attributes, setAttributes] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState("");
  const [active, setActive] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedValuesName, setSelectedValuesName] = useState("");
  const [selectedAllValues, setSelectedALlValues] = useState({});

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("all");

  const getAttributes = () => {
    setLoading(true);
    axiosInstance(
      `${baseUrl}/${ATTRIBUTES}?Limit=1000&Page=1`,
      configReq(token)
    )
      .then((res) => {
        const { data } = res;
        setLoading(false);
        let copy = [...data.data];
        copy.sort((a, b) => a["title"].localeCompare(b["title"]));
        setAttributes(copy);

        const uniqueGroups = [
          ...new Set(copy.map((item) => item.group)),
        ].filter(Boolean);
        setGroups(uniqueGroups);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!openCreate) {
      setSelectedAttribute("");
      getAttributes();
    }
  }, [openCreate]);

  const submitAttrsLoop = () => {
    setLoading(true);

    var temp = [];
    for (var prop in selectedAllValues) {
      selectedAllValues[prop]?.values.forEach((item) => {
        temp.push({
          subAttribute: item.id,
          preview: selectedAllValues[prop]?.preview,
        });
      });
    }
    axiosInstance
      .put(
        `${baseUrl}/${PRODUCT_ATTR_MULTIEDIT}`,
        { productId: id, attributes: JSON.stringify(temp) },
        configReq(token)
      )
      .then((res) => {
        const { data } = res;
        toast.success("با موفقیت ثبت  شد");
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    var temp = {};
    data.map((allD) => {
      var fr = [];
      if (temp[allD.attributeId]) {
        fr.push(...temp[allD.attributeId]?.values);
      }
      fr.push({
        /*           attributeId:0,
          attribute:null, */
        id: allD.subAttributeId,
        title: allD.subAttributeTitle,
        value: allD.subAttributeValue,
      });

      temp = {
        ...temp,
        [allD.attributeId]: {
          preview: allD.preview,
          attributeId: allD.attributeId,
          values: fr,
        },
      };
    });
    setSelectedALlValues(temp);
  }, [data]);

  useEffect(() => {
    if (selectedValuesName) {
      var temp = { ...selectedAllValues };
      temp = {
        ...temp,
        [selectedValuesName]: {
          ...temp[selectedValuesName],
          values: selectedValues,
        },
      };

      if (selectedValues.length === 0) {
        temp[selectedValuesName] = {
          ...temp[selectedValuesName],
          preview: false,
        };
      }
      setSelectedALlValues(temp);
    }
  }, [selectedValues]);

  const handlePreview = (checked, item) => {
    var temp = { ...selectedAllValues };
    temp[item.id] = { ...temp[item.id], preview: !temp[item.id].preview };
    setSelectedALlValues(temp);
  };

  const handleClickAway = () => {
    setActive("");
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1000px]">
        {/* Group Filter Chips */}
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
            ))}{" "}
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
                <div key={item.id}>
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
                        !selectedAllValues[item.id] ||
                        selectedAllValues[item.id]?.values?.length === 0
                      }
                      checked={
                        selectedAllValues[item.id]?.preview ? true : false
                      }
                      onChange={(e) => handlePreview(e.target.checked, item)}
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
                      onMouseDown={() => setSelectedValuesName(item.id)}
                    >
                      <SearchableDropdown
                        data={
                          !selectedAllValues[item.id]?.values
                            ? item.values
                            : item.values.filter(
                                (ar) =>
                                  !selectedAllValues[item.id]?.values.find(
                                    (rm) => rm.id === ar.id
                                  )
                              )
                        }
                        change={(e) => {
                          setSelectedValues(e);
                        }}
                        values={selectedAllValues[item.id]?.values || []}
                      />
                      <div className="flex justify-end items-center w-12 pl-2 pt-3 ">
                        <IconButton
                          onClick={() => {
                            setOpenCreate(item);
                            setSelectedAttribute(item);
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

        <div className="flex justify-end items-center md:my-4 my-9 ml-2 sm:ml-0">
          <Button
            disabled={loading}
            onClick={submitAttrsLoop}
            variant="contained"
          >
            ثبت اطلاعات
          </Button>
        </div>
        <Alert sx={{ my: 3 }} variant="outlined" severity="info">
          انتخاب چک باکس ویژگی مهم به منزله انتخاب ویژگی ها برای نمایش در بخش
          ویژگی های مهم در صفحه محصولات می باشد. ، بصورت پیش فرض 3 تا ویژگی فعال
          می باشد و درصورت انتخاب ویژگی جدید، جایگزین موارد قبلی می گردد.
        </Alert>
        <CreateAttrValue
          propsId={selectedAttribute?.id}
          title={selectedAttribute?.title}
          open={openCreate}
          close={() => setOpenCreate(false)}
          type={selectedAttribute?.type}
          allData={selectedAttribute?.values}
        />
      </div>
    </div>
  );
};

export default SingleProductAttrs;
