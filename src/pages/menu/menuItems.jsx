/* eslint-disable array-callback-return */
/* eslint-disable no-loop-func */
/* eslint-disable react-hooks/exhaustive-deps */
import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Switch,
  Tab,
  Tabs,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Loading,
  Modal,
  PageTitle,
  TextInput,
  UploadImage,
} from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import NoAccess from "../../components/noAccess";
import {
  baseUrl,
  BRANDS,
  CATEGORIES,
  CREATE_MENU_ITEMS,
  EDIT_MENU_ITEMS,
  GET_BLOG_CATEGORY,
  GET_MENU_ITEMS,
  MENU_ITEM_IMAGE,
  REMOVE_MENU_ITEM_IMAGE,
  REMOVE_MENU_ITEMS,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { setBrands } from "../../redux/slices/relationals";
import { logout } from "../../redux/slices/user";
import AllMenu from "./allMenu";
import ItemsOrders from "./itemsOrder";
import MenuItemsTable from "./menuItemTable";

const MenuItem = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { userPermissions } = useSelector((state) => state.relationals);

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const isSm = useMediaQuery("(min-width:600px)");
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editItem, setEditItem] = useState({});
  const [createItem, setCreateItem] = useState(false);
  const [deleteMenu, setDeleteMenu] = useState(null);
  const [deleteMoenuConfirm, setdeleteMoenuConfirm] = useState(false);
  const [reset, setreset] = useState(0);
  const [selectedProductImage, setselectedProductImage] = useState();
  const [avatar, setAvatar] = useState();
  const [menusData, setMenus] = useState({});
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [loadingDeleteAll, setLoadingDeleteAll] = useState(false);

  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [stepImage, setStepImage] = useState();
  const [categoryData, setcategoryData] = useState([]);
  const [categoryBlog, setcategoryBlog] = useState([]);

  const [brandData, setBrandData] = useState([]);
  const [selecetedCategory, setSelecetedCategory] = useState([]);
  const [selecetedCategoryBlog, setSelecetedCategoryBlog] = useState([]);

  const [selectedBrand, setSelectedBrand] = useState([]);
  const [broadCrumbs, setBroadCrumbs] = useState([]);
  const [openEditALl, setOpenEditALl] = useState(false);
  const [image, setImage] = useState({});
  useEffect(() => {
    if (!openCreate && !openEdit) {
      const query = searchParams.get("parent")
        ? `menuId=${id}&parentId=${searchParams.get("parent")}`
        : `menuId=${id}`;
      setLoading(true);
      axiosInstance(`${baseUrl}/${GET_MENU_ITEMS}?${query}`, configReq(token))
        .then((res) => {
          const { data } = res;
          setLoading(false);
          var temp = [];
          var image;
          data?.data?.map((item) => {
            if (item?.itemType !== 4) {
              temp.push(item);
            } else {
              image = item;
            }
            setImage(image);
          });
          setMenus({ ...data, data: temp });
        })
        .catch((err) => {
          setLoading(false);
          if (err.response.status === 401) {
            dispatch(logout());
          }
        });
    }
  }, [
    openCreate,
    openEdit,
    token,
    reset,
    searchParams.get("parent"),
    openImage,
  ]);
  const navigate = useNavigate();

  const submitData = () => {
    setLoading(true);
    const formData = new FormData();
    const formData2 = new FormData();
    if (activeTab === 0) {
      var temp = [];
      categoryData.forEach((item, index) => {
        const find = selecetedCategory.find((cat) => cat === item);
        if (find) {
          temp.push({
            title: find.items.title,
            link: `/shop/category-${find.items.slug}`,
            parentId: searchParams.get("parent")
              ? searchParams.get("parent")
              : null,
            /*  fromGallery:'', */
            menuId: id,
            itemValue: find.items.id,
            itemType: 1,
            active: find.active,
            idx: index + 1,
          });
        }
      });
      formData.append("menus", JSON.stringify(temp));
      axiosInstance
        .post(`${baseUrl}/${CREATE_MENU_ITEMS}`, formData, configReq(token))
        .then((res) => {
          setLoading(false);
          resetModal();
          if (res.data.code === 200) {
            setCreateItem({});
            setSelecetedCategory([]);
            toast.success("با موفقیت اضافه شد");
          }
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
        });
    } else if (activeTab === 1) {
      var temp2 = [];
      brandData.forEach((item, index) => {
        const find = selectedBrand.find((cat) => cat === item);
        if (find) {
          temp2.push({
            title: find.items.title,
            link:
              searchParams.get("itemValue") &&
              searchParams.get("itemType") === "1"
                ? `/shop/${searchParams.get("itemValue")}/${
                    find.items.slug ? `brand-${find.items.slug}` : `?brand=${find.items.id}`
                  } `
                : `/shop?brand=${find.items.id}`,
            parentId: searchParams.get("parent")
              ? searchParams.get("parent")
              : null,
            fromGallery: find.items.avatar,
            menuId: id,
            itemValue: find.items.id,
            itemType: 2,
            active: find.active,
            idx: index + 1,
          });
        }
      });
      formData2.append("menus", JSON.stringify(temp2));

      axiosInstance
        .post(`${baseUrl}/${CREATE_MENU_ITEMS}`, formData2, configReq(token))
        .then((res) => {
          setLoading(false);
          resetModal();
          if (res.data.code === 200) {
            setCreateItem({});
            setSelectedBrand([]);
            toast.success("با موفقیت اضافه شد");
          }
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
        });
    } else if (activeTab === 3) {
      var temp3 = [];
      categoryBlog.forEach((item, index) => {
        const find = selecetedCategoryBlog.find((cat) => cat === item);
        if (find) {
          temp3.push({
            title: find.items.title,
            link: `/archive?caregories=${find.items.id}`,
            parentId: searchParams.get("parent")
              ? searchParams.get("parent")
              : null,
            fromGallery: find.items.galleryId,
            menuId: id,
            itemValue: find.items.id,
            itemType: 5,
            active: find.active,
            idx: index + 1,
          });
        }
      });
      formData2.append("menus", JSON.stringify(temp3));

      axiosInstance
        .post(`${baseUrl}/${CREATE_MENU_ITEMS}`, formData2, configReq(token))
        .then((res) => {
          setLoading(false);
          resetModal();
          if (res.data.code === 200) {
            setCreateItem({});
            setSelecetedCategoryBlog([]);
            toast.success("با موفقیت اضافه شد");
          }
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
        });
    } else {
      var data = {
        ...createItem,
        menuId: id,

        fromGallery: selectedProductImage ? selectedProductImage : undefined,
        parentId: searchParams.get("parent")
          ? searchParams.get("parent")
          : null,
        /*  fromGallery:'', */

        /*   itemValue: find.items.id, */
        itemType: activeTab + 1,
        active: true,
        idx: 1,
      };
      var temp3 = [];
      temp3.push(data);
      axiosInstance
        .post(
          `${baseUrl}/${CREATE_MENU_ITEMS}`,
          { menus: JSON.stringify(temp3) },
          configReq(token)
        )
        .then((res) => {
          if (avatar) {
            var finded = res.data?.data?.find(
              (item) => item.title === createItem?.title
            );
            axiosInstance
              .post(
                `${baseUrl}/${MENU_ITEM_IMAGE}?menuItemId=${finded?.id}`,
                { files: avatar },
                configReq(token)
              )
              .then((res) => {
                setLoading(false);
                resetModal();
                if (res.data.code === 200) {
                  setCreateItem({});
                  toast.success("با موفقیت اضافه شد");
                }
              })
              .catch((err) => {
                setLoading(false);
                toast.error(err.response?.data?.message);
              });
          } else {
            setLoading(false);
            resetModal();
            if (res.data.code === 200) {
              setCreateItem({});
              toast.success("با موفقیت اضافه شد");
            }
          }
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
        });
    }
  };
  const deleteMenuAction = () => {
    if (deleteMenu) {
      setLoading(true);
      axiosInstance
        .delete(
          `${baseUrl}/${REMOVE_MENU_ITEMS}?id=${deleteMenu}`,
          configReq(token)
        )
        .then((res) => {
          setLoading(false);
          setdeleteMoenuConfirm(false);
          setDeleteMenu(false);
          resetModal();
          setImage({});
          if (res.data.code === 200) {
            setreset((r) => r + 1);
            toast.success("با موفقیت حذف شد");
          }
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
        });
    }
  };
  const submitData2 = (editedData) => {
    setLoading(true);
    delete editedData.image;
    var data = {
      ...editedData,
      menuId: id,
      parentId: searchParams.get("parent") ? searchParams.get("parent") : null,
    };
    if (!avatar) {
      data = {
        ...data,
        fromGallery: selectedProductImage
          ? selectedProductImage
          : editedData.image,
      };
    }
    var temp = [...menusData?.data];
    var index = temp.findIndex((item) => item.id === data.id);
    temp[index] = data;
    const formData2 = new FormData();
    formData2.append("menus", JSON.stringify(temp));
    axiosInstance
      .put(`${baseUrl}/${EDIT_MENU_ITEMS}`, formData2, configReq(token))
      .then((res) => {
        if (avatar) {
          axiosInstance
            .post(
              `${baseUrl}/${MENU_ITEM_IMAGE}?menuItemId=${editedData?.id}`,
              { files: avatar },
              configReq(token)
            )
            .then((res) => {
              setLoading(false);
              resetModal();
              if (res.data.code === 200) {
                setCreateItem({});
                toast.success("با موفقیت اضافه شد");
              }
            })
            .catch((err) => {
              setLoading(false);
              toast.error(err.response?.data?.message);
            });
        } else {
          setLoading(false);
          resetModal();
          setMenus({ ...menusData, data: temp });
          toast.success("با موفقیت اضافه شد");
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
  };
  const resetModal = () => {
    setOpenCreate(false);
    setCreateItem();
    setAvatar();
    setselectedProductImage();
    setOpenEdit(false);
    setEditItem({});
    setOpenImage(false);
  };
  useEffect(() => {
    if (menusData?.data) {
      setBrandsLoading(true);
      if (
        searchParams.get("itemValue") &&
        searchParams.get("itemType") === "1"
      ) {
        axiosInstance(
          `${baseUrl}/${BRANDS}?Page=1&Limit=1000&sort[0][key]=id&sort[0][direction]=asc&categoryId=${Number(
            searchParams.get("itemValue")
          )}        `,
          configReq(token)
        )
          .then((res) => {
            const { data } = res;
            setBrandsLoading(false);
            if (data.code === 200) {
              dispatch(setBrands(data.data));
              var temp = [];
              data.data.map((item, index) => {
                const find = menusData?.data.find(
                  (items) => Number(items.itemValue) === item.id
                );
                if (!find) {
                  temp.push({ items: item, active: true });
                }
              });
              setBrandData(temp);
            }
          })
          .catch((err) => {
            setBrandsLoading(false);
            if (err.response.status === 401) {
              dispatch(logout());
            }
          });
      } else {
        axiosInstance(
          `${baseUrl}/${BRANDS}?Page=${1}&Limit=${2000}&sort[0][key]=id&sort[0][direction]=asc`,
          configReq(token)
        )
          .then((res) => {
            const { data } = res;
            setBrandsLoading(false);
            if (data.code === 200) {
              dispatch(setBrands(data.data));
              var temp = [];
              data.data.map((item, index) => {
                const find = menusData?.data.find(
                  (items) => Number(items.itemValue) === item.id
                );
                if (!find) {
                  temp.push({ items: item, active: true });
                }
              });
              setBrandData(temp);
            }
          })
          .catch((err) => {
            setBrandsLoading(false);
            if (err.response.status === 401) {
              dispatch(logout());
            }
          });
      }
    }
  }, [searchParams.get("parent"), menusData?.data]);

  useEffect(() => {
    if (menusData?.data) {
      setCategoriesLoading(true);
      axiosInstance(
        `${baseUrl}/${CATEGORIES}?Page=${1}&sort[0][key]=id&sort[0][direction]=asc&Limit=${2000}${
          searchParams.get("itemValue") && searchParams.get("itemType") === "1"
            ? `&filter[0][key]=parentId&filter[0][value]=${searchParams.get(
                "itemValue"
              )}&filter[0][operator]=eq`
            : ""
        }`,
        configReq(token)
      )
        .then((res) => {
          const { data } = res;
          setCategoriesLoading(false);
          if (data.code === 200) {
            var temp = [];

            data.data.map((item, index) => {
              temp.push({
                items: item,
                priority: index + 1,
                active: true,
              });
            });
            setcategoryData(temp);
            if (temp.length === 0) {
              setActiveTab(1);
            }
          }
        })
        .catch((err) => {
          setCategoriesLoading(false);
          if (err.response.status === 401) {
            dispatch(logout());
          }
        });
    }
  }, [
    searchParams.get("parent"),
    menusData?.data,
    searchParams.get("itemValue"),
  ]);

  useEffect(() => {
    if (menusData?.data) {
      setCategoriesLoading(true);
      axiosInstance(
        `${baseUrl}/${GET_BLOG_CATEGORY}?Page=${1}&Limit=${2000}&sort[0][key]=id&sort[0][direction]=asc`,
        configReq(token)
      )
        .then((res) => {
          const { data } = res;
          setCategoriesLoading(false);
          if (data.code === 200) {
            var temp = [];

            data.data.map((item, index) => {
              var find;
              if (searchParams.get("itemType") === "4") {
                find = menusData?.data.find(
                  (items) => Number(items.itemValue) === item.id
                );
              } else {
                find = false;
              }

              if (!find) {
                /*         if (
                  searchParams.get("itemValue") &&
                  searchParams.get("itemType") === "4"
                ) {
                  if (
                    item.parent &&
                    item.parent === Number(searchParams.get("itemValue"))
                  ) {
                    temp.push({
                      items: item,
                      priority: index + 1,
                      active: true,
                    });
                  }
                } else if (!item.parent) {
                  temp.push({ items: item, priority: index + 1, active: true });
                } */ temp.push({
                  items: item,
                  priority: index + 1,
                  active: true,
                });
              }
            });
            setcategoryBlog(temp);
            if (temp.length === 0) {
              setActiveTab(1);
            }
          }
        })
        .catch((err) => {
          setCategoriesLoading(false);
          if (err.response.status === 401) {
            dispatch(logout());
          }
        });
    }
  }, [searchParams.get("parent"), menusData?.data]);

  useEffect(() => {
    if (sessionStorage.getItem("steps")) {
      var datas = JSON.parse(sessionStorage.getItem("steps"));
      var temps = [];
      var pp = {
        title: searchParams.get("firstParent"),
        path: `/menu/${id}?name=${searchParams.get(
          "firstParent"
        )}&firstParent=${searchParams.get("firstParent")}`,
      };
      temps.push(pp);
      for (let props in datas) {
        if (datas[props].prev === searchParams.get("parent")) {
          delete datas[props];
        } else if (
          Number(datas[props].prev) > Number(searchParams.get("parent"))
        ) {
          delete datas[props];
        } else {
          temps.push({
            title: datas[props].title,
            path: datas[props].location,
          });
        }
      }
      temps.pop();

      setBroadCrumbs(temps);
      sessionStorage.setItem("steps", JSON.stringify(datas));
    }
    if (searchParams.get("parent") === null) {
      sessionStorage.setItem("steps", JSON.stringify({}));
      setBroadCrumbs([]);
    }
  }, [searchParams.get("parent")]);
  const sumbitImage = () => {
    var data = {
      ...image,
      menuId: id,

      fromGallery: selectedProductImage ? selectedProductImage : undefined,
      parentId: searchParams.get("parent") ? searchParams.get("parent") : null,
      /*  fromGallery:'', */

      /*   itemValue: find.items.id, */
      itemType: 4,
      active: true,
      idx: 1,
    };
    var temp3 = [];
    temp3.push(data);
    axiosInstance
      .post(
        `${baseUrl}/${CREATE_MENU_ITEMS}`,
        { menus: JSON.stringify(temp3) },
        configReq(token)
      )
      .then((res) => {
        if (avatar) {
          var finded = res.data?.data?.find((item) => item.itemType === 4);
          axiosInstance
            .post(
              `${baseUrl}/${MENU_ITEM_IMAGE}?menuItemId=${finded?.id}`,
              { files: avatar },
              configReq(token)
            )
            .then((res) => {
              setLoading(false);
              resetModal();
              if (res.data.code === 200) {
                setCreateItem({});
                toast.success("با موفقیت اضافه شد");
              }
            })
            .catch((err) => {
              setLoading(false);
              toast.error(err.response?.data?.message);
            });
        } else {
          setLoading(false);
          resetModal();
          if (res.data.code === 200) {
            setCreateItem({});
            toast.success("با موفقیت اضافه شد");
          }
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
  };
  const deleteAllHandler = () => {
    setOpenDelete(true);
  };
  const deleteAllAfter = async () => {
    if (!menusData?.data?.length) return;

    setLoadingDeleteAll(true);

    const deleteRequests = menusData.data.map((row) =>
      axiosInstance
        .delete(
          `${baseUrl}/${REMOVE_MENU_ITEMS}?id=${row.id}`,
          configReq(token)
        )
        .catch((err) => {
          toast.error(err.response?.data?.message);
        })
    );

    await Promise.all(deleteRequests);

    setreset((r) => r + 1);
    toast.success("با موفقیت حذف شدند");
    setLoadingDeleteAll(false);
    setOpenDelete(false);
    setDeleteMenu(null);
  };
  if (!userPermissions?.menu?.view) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle
        title={`آیتم های ${searchParams.get("name")}`}
        broadCrumb={[
          {
            title: "منو های ناوبری          ",
            path: "/menu",
          },

          ...broadCrumbs,
        ]}
      />
      <div className="md:mx-3 mx-1">
        {menusData?.data && (
          <MenuItemsTable
            rows={menusData?.data}
            Reset={() => setreset((r) => r + 1)}
            deleteAllHandler={deleteAllHandler}
            editItem={(e) => {
              setEditItem(e);
              setOpenEdit(true);
            }}
            deleteRow={(e) => {
              setdeleteMoenuConfirm(true);
              setDeleteMenu(e);
            }}
            parentName={searchParams.get("name")}
            total={menusData?.data?.length}
            handleClicked={(e) => {
              setOpenCreate(true);
            }}
            handleClicked2={(e) => {
              setOpenEditALl(true);
            }}
            setEditActive={(e) => {
              submitData2(e);
            }}
            imageButton={broadCrumbs?.length === 2}
            imageButtonHandler={() => {
              setOpenImage(true);
            }}
            image={stepImage}
          />
        )}

        <Modal
          open={openCreate}
          close={() => {
            resetModal();
          }}
          title={`افزودن آیتم منو برای ${searchParams.get("name")}`}
        >
          {loading && <Loading />}
          <Tabs
            className="tabss"
            variant="scrollable"
            value={activeTab}
            sx={{ flexGrow: 1 }}
          >
            <Tab
              disabled={categoryData.length === 0}
              label="دسته بندی ها"
              onClick={() => setActiveTab(0)}
            />

            <Tab label="برند ها" onClick={() => setActiveTab(1)} />
            <Tab label="لینک" onClick={() => setActiveTab(2)} />
            <Tab label="بلاگ" onClick={() => setActiveTab(3)} />
            {/*        {broadCrumbs?.length === 2 && (
              <Tab label="عکس" onClick={() => setActiveTab(3)} />
            )} */}
          </Tabs>
          {activeTab === 0 ? (
            <>
              <ItemsOrders
                sendData={setcategoryData}
                data={categoryData}
                selectedData={selecetedCategory}
                setSelectedData={setSelecetedCategory}
                title="دسته بندی"
              />
            </>
          ) : activeTab === 1 ? (
            <>
              <ItemsOrders
                sendData={setBrandData}
                data={brandData}
                selectedData={selectedBrand}
                setSelectedData={setSelectedBrand}
                title="برند"
              />
            </>
          ) : activeTab === 2 ? (
            <>
              {" "}
              <TextInput
                label="عنوان"
                change={(e) => setCreateItem({ ...createItem, title: e })}
                currentValue={createItem?.title}
              />
              <div className="leftInput">
                <TextInput
                  label="لینک"
                  ltr
                  change={(e) => setCreateItem({ ...createItem, link: e })}
                  currentValue={createItem?.link}
                />
              </div>
              <UploadImage
                file={avatar}
                change={setAvatar}
                selectedProductImage={selectedProductImage}
                setselectedProductImage={setselectedProductImage}
              />
            </>
          ) : activeTab === 3 ? (
            <>
              <ItemsOrders
                sendData={setcategoryBlog}
                data={categoryBlog}
                selectedData={selecetedCategoryBlog}
                setSelectedData={setSelecetedCategoryBlog}
                title="کتگوری بلاک"
              />
            </>
          ) : (
            <></>
          )}

          <Box className="flex items-center justify-end">
            <Button variant="contained" onClick={submitData}>
              {" "}
              <>{loading ? <CircularProgress /> : <>ثبت اطلاعات</>}</>
            </Button>
          </Box>
        </Modal>
        <Modal
          open={openEdit}
          close={() => {
            resetModal();
          }}
          title={`ویرایش آیتم منو برای ${searchParams.get("name")}`}
        >
          {loading && <Loading />}
          <TextInput
            label="عنوان"
            change={(e) => setEditItem({ ...editItem, title: e })}
            currentValue={editItem?.title}
          />{" "}
          <div className="leftInput">
            <TextInput
              label="لینک"
              ltr
              change={(e) => setEditItem({ ...editItem, link: e })}
              currentValue={editItem?.link}
            />
          </div>
          <div className="flex justify-end ">
            <UploadImage
              file={avatar}
              change={setAvatar}
              selectedProductImage={selectedProductImage}
              setselectedProductImage={setselectedProductImage}
              address={editItem?.image}
              justGallery={false}
              noUpload={true}
              removeApi={REMOVE_MENU_ITEM_IMAGE}
              id={editItem?.id}
              hasRemoved={() => {}}
            />
          </div>
          <div className="flex gap-3 items-center">
            <span>فعال / غیر فعال</span>
            <Switch
              onChange={() =>
                setEditItem({ ...editItem, active: !editItem?.active })
              }
              defaultChecked={editItem?.active}
              disabled={!userPermissions?.menu?.update}
            />
          </div>
          <Box className="flex items-center justify-between">
            <IconButton
              size="large"
              onClick={() => setdeleteMoenuConfirm(true)}
            >
              <Delete sx={{ color: "red" }} />
            </IconButton>
            <Button variant="contained" onClick={() => submitData2(editItem)}>
              {" "}
              <>{loading ? <CircularProgress /> : <>ثبت اطلاعات</>}</>
            </Button>
          </Box>
        </Modal>
        <Modal
          open={deleteMoenuConfirm}
          close={() => {
            setdeleteMoenuConfirm(false);
          }}
          title="آیا از حذف این منو اطمینان دارید ؟ "
        >
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setdeleteMoenuConfirm(false)}
              variant="contained"
            >
              انصراف
            </Button>
            <Button
              onClick={deleteMenuAction}
              variant="contained"
              color="error"
            >
              حذف
            </Button>
          </div>
        </Modal>
        <Modal
          open={openEditALl}
          close={() => {
            setOpenEditALl(false);
          }}
          title="    ویرایش اولویت ها"
        >
          <AllMenu
            data={menusData}
            setLoading={setLoading}
            resetModal={() => {
              setreset((r) => r + 1);
              setOpenEditALl(false);
            }}
          />
        </Modal>

        <Modal
          open={openImage}
          close={() => {
            resetModal();
          }}
          title={`   ویرایش بنر منو`}
        >
          {loading && <Loading />}
          <TextInput
            label="عنوان"
            change={(e) => setImage({ ...image, title: e })}
            currentValue={image?.title}
          />
          <div className="leftInput">
            {" "}
            <TextInput
              label="لینک"
              ltr
              change={(e) => setImage({ ...image, link: e })}
              currentValue={image?.link}
            />
          </div>

          <div className="flex justify-end ">
            <UploadImage
              file={avatar}
              change={setAvatar}
              selectedProductImage={selectedProductImage}
              setselectedProductImage={setselectedProductImage}
              address={image?.image}
              justGallery={true}
              removeApi={REMOVE_MENU_ITEM_IMAGE}
              id={image?.id}
              hasRemoved={() => {}}
            />
          </div>

          <div className="flex gap-3 items-center">
            <span>فعال / غیر فعال</span>
            <Switch
              onChange={() => setImage({ ...image, active: !image?.active })}
              defaultChecked={image?.active}
              disabled={!userPermissions?.menu?.update}
            />
          </div>
          <Box
            sx={{ justifyContent: image?.id ? "space-between" : "end" }}
            className="flex items-center justify-between"
          >
            {image?.id && (
              <IconButton
                size="large"
                onClick={() => {
                  setdeleteMoenuConfirm(true);
                  setDeleteMenu(image?.id);
                }}
              >
                <Delete sx={{ color: "red" }} />
              </IconButton>
            )}

            <Button
              variant="contained"
              onClick={() => {
                if (image?.id) {
                  submitData2(image);
                } else {
                  sumbitImage();
                }
              }}
            >
              {" "}
              <>{loading ? <CircularProgress /> : <>ثبت اطلاعات</>}</>
            </Button>
          </Box>
        </Modal>
      </div>
      <Modal
        open={openDelete}
        close={() => setOpenDelete(false)}
        title={"از حذف همه منو اطمینان دارید ؟‌"}
      >
        <span>تنها منو های که زیر مجوعه ندارد حذف می شود</span>
        <div className="flex justify-end items-center">
          <Button
            variant="contained"
            color="primary"
            onClick={deleteAllAfter}
            disabled={loadingDeleteAll}
          >
            {!loadingDeleteAll ? (
              <> بله حذف شود</>
            ) : (
              <>
                <CircularProgress />{" "}
              </>
            )}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default MenuItem;
const SMSTYPE = ["هدر", "فوترز"];
