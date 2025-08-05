/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Button,
  Checkbox,
  CircularProgress,
  Collapse,
  IconButton,
  Paper,
  Skeleton,
  Tab,
  Tabs,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, PageTitle, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { Confirm } from "../../components/modals";
import NoAccess from "../../components/noAccess";
import {
  ADD_ACCESS_PERMISSION,
  ALL_ADMIN_PERMISSIONS,
  baseUrl,
  CREATE_ADMIN_PERMISSIONS,
  DELETE_ACCESS_PERMISSION,
  DELETE_ADMIN_PERMISSIONS,
  EDIT_ACTIVES_ALL_ADMIN_PERMISSIONS,
  EDIT_ADMIN_PERMISSIONS,
  GET_ACCSSESS_BY_ID,
  permissions,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const Access = () => {
  const [allCurrent, setAllCurrent] = useState([]);
  const [allAccess, setAllAccess] = useState([]);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const { userPermissions } = useSelector((state) => state.relationals);
  const [isSelectedForce, setIsSelectedForce] = useState({});
  const { id } = useParams();
  const [openParents, setOpenParents] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openRoot, setOpenRoot] = useState(false);
  const [loadingActives, setLoadingActives] = useState(false);

  const [visibility, setVisibile] = useState({});
  const [loading, setLoading] = useState({});
  const [loadingApi, setLoadingApi] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [allData, setAllData] = useState({});
  const [loadingButton, setLoadingButton] = useState(false);
  const [value, setValue] = useState(1);
  // NEW: State for the search query
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getAll();
  }, []);

  const getAll = () => {
    setLoadingData(true);
    axiosInstance
      .get(
        `${baseUrl}/${GET_ACCSSESS_BY_ID}?accessId=${id}&limit=1000`,
        configReq(token)
      )
      .then((res) => {
        setAllCurrent(res.data.data);
        setLoadingData(false);
      })
      .catch((err) => {
        setLoadingData(false);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
    axiosInstance
      .get(`${baseUrl}/${permissions}`, configReq(token))
      .then((res) => {
        setAllAccess(res.data.data /* .reverse() */);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatch(logout());
          setLoadingData(false);
        }
      });
  };

  // NEW: Memoized filtering logic
  const filteredAccess = useMemo(() => {
    const lowerCaseQuery = searchQuery.toLowerCase().trim();
    if (!lowerCaseQuery) {
      return allAccess;
    }

    const filterRecursive = (items) => {
      if (!items || items.length === 0) {
        return [];
      }

      const results = [];

      for (const item of items) {
        const children = item.chileds || item.childs;
        const childrenKey = item.chileds ? "chileds" : "childs";

        const filteredChildren = filterRecursive(children);

        const selfMatch = item.title.toLowerCase().includes(lowerCaseQuery);

        if (selfMatch || (filteredChildren && filteredChildren.length > 0)) {
          const newItem = { ...item };

          if (children) {
            newItem[childrenKey] = filteredChildren;
          }

          results.push(newItem);
        }
      }
      return results;
    };

    return filterRecursive(allAccess);
  }, [allAccess, searchQuery]);

  useEffect(() => {
    if (filteredAccess.length > 0 && value > filteredAccess.length) {
      setValue(1);
    }
  }, [filteredAccess, value]);

  const handleChange = (item, checked) => {
    /*     if (loadingApi) return;
     */ setLoading({ [item.id]: true });
    setLoadingApi(true);
    if (checked) {
      axiosInstance
        .delete(
          `${baseUrl}/${DELETE_ACCESS_PERMISSION}?accessId=${id}&permissionId=${item.id}`,

          configReq(token)
        )
        .then((res) => {
          var temp = [...allCurrent];
          var all = temp.filter((it) => it.permissionId !== item.id);
          setAllCurrent(all);
          setLoading({ [item.id]: false });
          setLoadingApi(false);
          toast.success("عملیات موفق");
        })
        .catch((err) => {
          setLoading({ [item.id]: false });
          setLoadingApi(false);
          toast.error(err.response?.data?.message);
        });
    } else {
      var formData = new FormData();
      formData.append("accessId", id);
      formData.append("permissionId", item.id);
      axiosInstance
        .post(`${baseUrl}/${ADD_ACCESS_PERMISSION}`, formData, configReq(token))
        .then((res) => {
          var temp2 = [...allCurrent];
          temp2.push(res.data.data);
          setAllCurrent(temp2);
          setLoading({ [item.id]: false });
          toast.success("عملیات موفق");
        })
        .catch((err) => {
          setLoading({ [item.id]: false });
          toast.error(err.response?.data?.message);
        });
    }
  };
  const handleAllChange = (allChild, checked) => {
    var temp2 = [...allCurrent];
    allChild?.forEach((item) => {
      setLoading({ ...loading, [item.id]: true });
      setLoadingApi(true);
      if (checked) {
        temp2 = temp2.filter((it) => it.permissionId !== item.id);
        axiosInstance
          .delete(
            `${baseUrl}/${DELETE_ACCESS_PERMISSION}?accessId=${id}&permissionId=${item.id}`,

            configReq(token)
          )
          .then((res) => {
            setLoading({ [item.id]: false });
            setLoadingApi(false);
          })
          .catch((err) => {
            setLoading({ [item.id]: false });
            setLoadingApi(false);
            toast.error(err.response?.data?.message);
          });
      } else {
        if (!isSelected(item)) {
          var formData = new FormData();
          formData.append("accessId", id);
          formData.append("permissionId", item.id);
          axiosInstance
            .post(
              `${baseUrl}/${ADD_ACCESS_PERMISSION}`,
              formData,
              configReq(token)
            )
            .then((res) => {
              temp2.push(res.data.data);

              setLoading({ [item.id]: false });
            })
            .catch((err) => {
              setLoading({ [item.id]: false });
              toast.error(err.response?.data?.message);
            });
        }
      }
    });
    setAllCurrent(temp2);

    toast.success("عملیات موفق");
  };

  const isSelected = (row) => {
    return allCurrent.find((item) => item.permissionId === row.id);
  };

  const isSelectedAll = (allChild) =>
    allChild.every((row) =>
      allCurrent.find((item) => item.permissionId === row.id)
    );
  const handleSubmit = () => {
    let lastId = null;
    setLoadingButton(true);
    axiosInstance
      .get(
        `${baseUrl}/${ALL_ADMIN_PERMISSIONS}?Page=1&Limit=1`,
        configReq(token)
      )
      .then((res) => {
        lastId = res.data.data[0].id;

        if (lastId) {
          const sendingData = {
            priority: allData?.priority,
            title: allData?.title,
            value: allData?.value,
            parentId: openParents?.id,
            module: 0,
            url: "-",
            method: "-",
            id: lastId + 1,
          };

          // Send the initial POST request
          axiosInstance
            .post(
              `${baseUrl}/${CREATE_ADMIN_PERMISSIONS}`,
              sendingData,
              configReq(token)
            )
            .then((res) => {
              lastId += 1;
              const parentId = res.data.data.id;

              // Prepare all the sub-data requests
              const subRequests = allData.sub?.map((item, index) => {
                const subData = {
                  priority: item.order,
                  title: `${item.perisan}${allData?.title}`,
                  value: `${allData?.value}@${item.title}`,
                  parentId,
                  module: 0,
                  url: "-",
                  id: lastId + 1,
                  method: item.method,
                };

                lastId += 1;

                return axiosInstance.post(
                  `${baseUrl}/${CREATE_ADMIN_PERMISSIONS}`,
                  subData,
                  configReq(token)
                );
              });

              // Use Promise.all to handle all sub-requests
              Promise.all(subRequests)
                .then(() => {
                  toast.success("با موفقیت ساخته شد");
                  getAll();
                  setLoadingButton(false);
                  setOpenParents(false);
                  setAllData({});
                })
                .catch((err) => {
                  toast.error(err.response?.data?.message);
                  setLoadingButton(false);
                });
            })
            .catch((err) => {
              toast.error(err.response?.data?.message);
              setLoadingButton(false);
            });
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          dispatch(logout());
        } else {
          toast.error(err.response?.data?.message);
        }
      });
  };
  const handleDelete = () => {
    axiosInstance
      .delete(
        `${baseUrl}/${DELETE_ADMIN_PERMISSIONS}?id=${openDelete.id}`,
        configReq(token)
      )
      .then((res) => {
        setOpenDelete(false);
        toast.success("با موفقیت حذف شد");
        getAll();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
        setOpenDelete(false);
      });
  };
  const handleSubmitEdit = () => {
    setLoadingButton(true);
    axiosInstance
      .put(
        `${baseUrl}/${EDIT_ADMIN_PERMISSIONS}`,
        { ...openEdit },
        configReq(token)
      )
      .then((res) => {
        setOpenEdit(false);
        setLoadingButton(false);
        toast.success("با موفقیت ویرایش شد");
        getAll();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
        setLoadingButton(false);
      });
  };
  const handleSubmitCreate = () => {
    let lastId = null;
    setLoadingButton(true);
    axiosInstance
      .get(
        `${baseUrl}/${ALL_ADMIN_PERMISSIONS}?Page=1&Limit=1`,
        configReq(token)
      )
      .then((res) => {
        lastId = res.data.data[0].id;
        const subData = {
          parentId: openCreate.id,
          ...openCreate,
          id: lastId + 1,
        };

        lastId += 1;

        return axiosInstance
          .post(
            `${baseUrl}/${CREATE_ADMIN_PERMISSIONS}`,
            subData,
            configReq(token)
          )
          .then((res) => {
            setLoadingButton(false);
            getAll();
            setOpenCreate(false);
          });
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
        setLoadingButton(false);
      });
  };
  const handleSubmitCreateRoot = () => {
    let lastId = null;
    setLoadingButton(true);
    axiosInstance
      .get(
        `${baseUrl}/${ALL_ADMIN_PERMISSIONS}?Page=1&Limit=1`,
        configReq(token)
      )
      .then((res) => {
        lastId = res.data.data[0].id;
        const subData = {
          ...openRoot,
          id: lastId + 1,
        };

        lastId += 1;

        return axiosInstance
          .post(
            `${baseUrl}/${CREATE_ADMIN_PERMISSIONS}`,
            subData,
            configReq(token)
          )
          .then((res) => {
            setLoadingButton(false);
            getAll();
            setOpenRoot(false);
          });
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
        setLoadingButton(false);
      });
  };
  const checkActiveStatus = (status, ids) => {
    setLoadingActives(true);
    axiosInstance
      .put(
        `${baseUrl}/${EDIT_ACTIVES_ALL_ADMIN_PERMISSIONS}`,
        { permissionParentId: ids, accessId: id, isActive: status },
        configReq(token)
      )
      .then((res) => {
        setLoadingActives(false);
        toast.success("با موفقیت ویرایش شد");
        getAll();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
        setLoadingActives(false);
      });
  };
  if (!userPermissions?.accessProfile?.update) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle
        title={searchParams.get("title")}
        broadCrumb={[
          {
            title: "مدیریت دسترسی ها",
            path: "/permisions",
          },
        ]}
      />
      <div className="md:mx-3 mx-1 checkBox">
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, paddingBottom: "16px " }}
          elevation={0}
        >
          {loadingData ? (
            <Skeleton width={"100%"} height={400} />
          ) : (
            <>
              {" "}
              <div>
                {/*   <span> انتخاب از بین دسترسی ها برای {accessName?.title}</span> */}
              </div>
              {/* NEW: Search Input */}
              <Box sx={{ p: 2 }}>
                <TextInput
                  label="جستجو در دسترسی ها..."
                  change={(e) => setSearchQuery(e)}
                  currentValue={searchQuery}
                />
              </Box>
              <Tabs
                sx={{
                  flexGrow: 1,
                  position: "sticky",
                  top: "0px",
                  zIndex: 5,
                  height: "3.07rem",
                  minHeight: "40px !important",
                  ".MuiTab-root": {
                    minHeight: "40px !important",
                  },
                  background: (theme) =>
                    theme.palette.mode === "light"
                      ? "rgba(0,0,0,0.04) !important"
                      : "rgba(0,0,0,0.7)  !important",
                }}
                variant="scrollable"
                scrollButtons={false}
                allowScrollButtonsMobile
                visibleScrollbar
                value={value > filteredAccess.length ? 0 : value - 1} // NEW: handle value out of bounds
              >
                {/* MODIFIED: map over filteredAccess */}
                {filteredAccess.map((item, index) => (
                  <Tab
                    key={index}
                    label={item.title}
                    onClick={() => setValue(index + 1)}
                  />
                ))}
                {userPermissions?.permissionAdmin?.add &&
                  !searchQuery && ( // NEW: Hide add button when searching
                    <IconButton onClick={() => setOpenRoot(true)}>
                      <AddCircleIcon color="primary" />
                    </IconButton>
                  )}
              </Tabs>
              {/* MODIFIED: map over filteredAccess */}
              {filteredAccess.map((item, index) => (
                <div className="mt-4 mx-4" key={index}>
                  {value === index + 1 && (
                    <>
                      {" "}
                      <Box
                        sx={{
                          color: (theme) =>
                            theme.palette.mode === "light"
                              ? "#001ee4"
                              : "#90caf9 ",
                        }}
                        className="text-lg mb-4 mr-4 flex gap-3 justify-end items-center font-bold"
                      >
                        <Button
                          disabled={loadingActives}
                          variant="contained"
                          color="primary"
                          onClick={() => checkActiveStatus(true, item.id)}
                        >
                          فعال سازی همه
                        </Button>{" "}
                        <Button
                          variant="contained"
                          color="error"
                          disabled={loadingActives}
                          onClick={() => checkActiveStatus(false, item.id)}
                        >
                          غیر فعال سازی همه
                        </Button>
                        {userPermissions?.permissionAdmin?.add && (
                          <Button
                            variant="outlined"
                            onClick={() => setOpenParents(item)}
                          >
                            افزودن
                          </Button>
                        )}
                        <span>PID : {item.id}</span>
                      </Box>{" "}
                      <div className="grid md:grid-cols-4 gap-4">
                        {item.chileds?.map((childs1, i) => (
                          <div key={`i${i}`}>
                            <div className="flex cursor-pointer  mb-4 items-center">
                              <div
                                onClick={() => {
                                  setVisibile({
                                    ...visibility,
                                    [index + i]:
                                      visibility[index + i] === false
                                        ? true
                                        : false,
                                  });
                                }}
                                className="ml-1"
                              >
                                {visibility[index + i] === false ? (
                                  <AddIcon sx={{ fontSize: "13px" }} />
                                ) : (
                                  <RemoveIcon sx={{ fontSize: "13px" }} />
                                )}
                              </div>

                              <input
                                type={"checkbox"}
                                className=""
                                onClick={() =>
                                  handleAllChange(
                                    childs1.childs,
                                    isSelectedAll(childs1.childs)
                                  )
                                }
                                checked={
                                  isSelectedAll(childs1.childs) ? true : false
                                }
                              />
                              <Box
                                sx={{
                                  color: (theme) =>
                                    theme.palette.mode === "light"
                                      ? "#001ee4"
                                      : "#90caf9 ",
                                }}
                                className="text-base mr-2"
                              >
                                {childs1.title}
                              </Box>
                              <span className="px-5 text-xs">
                                id : {childs1.id}
                              </span>
                            </div>
                            <Collapse
                              in={
                                visibility[index + i] === false ? false : true
                              }
                            >
                              <Box className="mr-4 ">
                                {childs1.childs?.map((childs, i) => (
                                  <div
                                    key={i}
                                    className="flex group gap-2 items-center"
                                  >
                                    <input
                                      type={"checkbox"}
                                      className="p-5 m-1"
                                      onClick={() =>
                                        handleChange(childs, isSelected(childs))
                                      }
                                      checked={
                                        isSelected(childs) ? true : false
                                      }
                                    />
                                    <Box
                                      sx={{
                                        color: (theme) =>
                                          theme.palette.mode === "light"
                                            ? "rgb(31 41 55)"
                                            : "rgba(255, 255, 255, 0.7)",
                                      }}
                                      className="text-sm "
                                    >
                                      {childs.title}{" "}
                                    </Box>
                                    <div className="hidden cursor-pointer group-hover:flex gap-2 items-center">
                                      {userPermissions?.permissionAdmin
                                        ?.delete && (
                                        <DeleteIcon
                                          onClick={() => setOpenDelete(childs)}
                                          color="error"
                                        />
                                      )}
                                      {userPermissions?.permissionAdmin
                                        ?.update && (
                                        <EditIcon
                                          onClick={() => setOpenEdit(childs)}
                                          color="warning"
                                        />
                                      )}
                                    </div>
                                    {loading[childs.id] && <CircularProgress />}
                                  </div>
                                ))}
                                {userPermissions?.permissionAdmin?.add && (
                                  <IconButton
                                    onClick={() =>
                                      setOpenCreate({
                                        id: childs1.id,
                                        title: childs1.title,
                                      })
                                    }
                                  >
                                    <AddReactionIcon color="primary" />
                                  </IconButton>
                                )}
                              </Box>{" "}
                            </Collapse>
                          </div>
                        ))}
                      </div>
                    </>
                  )}{" "}
                </div>
              ))}
            </>
          )}
        </Paper>
      </div>
      <Modal
        title={`افزودن دسترسی به ${openParents?.title}`}
        open={Boolean(openParents)}
        close={() => {
          setOpenParents(false);
          setAllData({});
        }}
      >
        <TextInput
          label=" نام پرمیژن"
          change={(e) => setAllData({ ...allData, title: e })}
          currentValue={allData?.title}
        />{" "}
        <div className="leftInput">
          <TextInput
            label="مقدار "
            change={(e) => setAllData({ ...allData, value: e })}
            currentValue={allData?.value}
          />
        </div>{" "}
        <div className="leftInput">
          {" "}
          <TextInput
            label=" اولویت"
            change={(e) => setAllData({ ...allData, priority: e })}
            currentValue={allData?.priority}
          />
        </div>
        - زیر مجموعه ها :‌
        {VALUES.map((item, index) => (
          <div
            onClick={() => {
              var temp = allData?.sub ? [...allData?.sub] : [];
              var finded = temp.find((it) => it.id === item.id);
              if (finded) {
                temp = temp.filter((it) => it.id !== item.id);
              } else {
                temp.push(item);
              }

              setAllData({ ...allData, sub: temp });
            }}
            key={index}
            className=" cursor-pointer gap-2 items-center"
          >
            <Checkbox
              checked={Boolean(allData?.sub?.find((it) => it.id === item.id))}
            />
            <span>{item.title}</span>
          </div>
        ))}
        <div className="flex justify-end items-center">
          <Button
            disabled={loadingButton}
            onClick={handleSubmit}
            className="flex justify-end"
          >
            {loadingButton && <CircularProgress size={11} />}
            ثبت اطلاعات
          </Button>
        </div>
      </Modal>
      <Confirm
        message={`آیا از حذف ${openDelete?.title} اطمینان دارید ؟`}
        open={Boolean(openDelete)}
        close={() => setOpenDelete(false)}
        submit={() => handleDelete()}
      />

      <Modal
        title={`ویرایش  ${openEdit?.title}`}
        open={Boolean(openEdit)}
        close={() => {
          setOpenEdit(false);
        }}
      >
        <TextInput
          label=" نام پرمیژن"
          change={(e) => setOpenEdit({ ...openEdit, title: e })}
          currentValue={openEdit?.title}
        />{" "}
        <div className="leftInput">
          <TextInput
            label="مقدار "
            change={(e) => setOpenEdit({ ...openEdit, value: e })}
            currentValue={openEdit?.value}
          />
        </div>{" "}
        <div className="leftInput">
          {" "}
          <TextInput
            label=" اولویت"
            change={(e) => setOpenEdit({ ...openEdit, priority: e })}
            currentValue={openEdit?.priority}
          />
        </div>{" "}
        <div className="leftInput">
          <TextInput
            label="ماژول "
            change={(e) => setOpenEdit({ ...openEdit, module: e })}
            currentValue={openEdit?.module}
          />
        </div>
        <div className="leftInput">
          <TextInput
            label="متد "
            change={(e) => setOpenEdit({ ...openEdit, method: e })}
            currentValue={openEdit?.method}
          />
        </div>
        <div className="leftInput">
          <TextInput
            label=" یوآرال
          "
            change={(e) => setOpenEdit({ ...openEdit, url: e })}
            currentValue={openEdit?.url}
          />
        </div>
        <div className="flex justify-end items-center">
          <Button
            disabled={loadingButton}
            onClick={handleSubmitEdit}
            className="flex justify-end"
          >
            {loadingButton && <CircularProgress size={11} />}
            ثبت اطلاعات
          </Button>
        </div>
      </Modal>

      <Modal
        title={`افزودن به   ${openCreate?.title}`}
        open={Boolean(openCreate)}
        close={() => {
          setOpenCreate(false);
        }}
      >
        <TextInput
          label=" نام پرمیژن"
          change={(e) => setOpenCreate({ ...openCreate, title: e })}
          currentValue={openCreate?.title}
        />
        <div className="leftInput">
          <TextInput
            label="مقدار "
            change={(e) => setOpenCreate({ ...openCreate, value: e })}
            currentValue={openCreate?.value}
          />
        </div>
        <div className="leftInput">
          <TextInput
            label="ماژول "
            change={(e) => setOpenCreate({ ...openCreate, module: e })}
            currentValue={openCreate?.module}
          />
        </div>
        <div className="leftInput">
          <TextInput
            label="متد "
            change={(e) => setOpenCreate({ ...openCreate, method: e })}
            currentValue={openCreate?.method}
          />
        </div>
        <div className="leftInput">
          <TextInput
            label=" یوآرال
          "
            change={(e) => setOpenCreate({ ...openCreate, url: e })}
            currentValue={openCreate?.url}
          />
        </div>
        <div className="leftInput">
          {" "}
          <TextInput
            label=" اولویت"
            change={(e) => setOpenCreate({ ...openCreate, priority: e })}
            currentValue={openCreate?.priority}
          />
        </div>
        <div className="flex justify-end items-center">
          <Button
            disabled={loadingButton}
            onClick={handleSubmitCreate}
            className="flex justify-end"
          >
            {loadingButton && <CircularProgress size={11} />}
            ثبت اطلاعات
          </Button>
        </div>
      </Modal>

      <Modal
        title={`افزودن   `}
        open={Boolean(openRoot)}
        close={() => {
          setOpenRoot(false);
        }}
      >
        <TextInput
          label=" نام پرمیژن"
          change={(e) => setOpenRoot({ ...openRoot, title: e })}
          currentValue={openRoot?.title}
        />
        <div className="leftInput">
          <TextInput
            label="مقدار "
            change={(e) => setOpenRoot({ ...openRoot, value: e })}
            currentValue={openRoot?.value}
          />
        </div>
        <div className="leftInput">
          <TextInput
            label="ماژول "
            change={(e) => setOpenRoot({ ...openRoot, module: e })}
            currentValue={openRoot?.module}
          />
        </div>
        <div className="leftInput">
          <TextInput
            label="متد "
            change={(e) => setOpenRoot({ ...openRoot, method: e })}
            currentValue={openRoot?.method}
          />
        </div>
        <div className="leftInput">
          <TextInput
            label=" یوآرال
          "
            change={(e) => setOpenRoot({ ...openRoot, url: e })}
            currentValue={openRoot?.url}
          />
        </div>
        <div className="leftInput">
          {" "}
          <TextInput
            label=" اولویت"
            change={(e) => setOpenRoot({ ...openRoot, priority: e })}
            currentValue={openRoot?.priority}
          />
        </div>
        <div className="flex justify-end items-center">
          <Button
            disabled={loadingButton}
            onClick={handleSubmitCreateRoot}
            className="flex justify-end"
          >
            {loadingButton && <CircularProgress size={11} />}
            ثبت اطلاعات
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Access;
const VALUES = [
  {
    title: "export",
    id: "export",
    perisan: "خروجی ",
    method: "GET",
    order: 7,
  },
  {
    title: "view",
    id: "view",
    perisan: "مشاهده ",
    method: "GET",
    order: 1,
  },
  {
    title: "update",
    id: "update",
    perisan: "ویرایش ",
    method: "PUT",
    order: 3,
  },
  {
    title: "insert",
    id: "insert",
    perisan: "افزودن  ",
    method: "POST",
    order: 2,
  },
  {
    title: "delete",
    id: "delete",
    perisan: "حدف  ",
    method: "DELETE",
    order: 4,
  },
  {
    title: "deleteAll",
    id: "deleteAll",
    perisan: "حذف همه  ",
    method: "DELETE",
    order: 5,
  },
  {
    title: "activeAll",
    id: "activeAll",
    perisan: "ویرایش  همه  ",
    method: "PUT",
    order: 6,
  },
];
