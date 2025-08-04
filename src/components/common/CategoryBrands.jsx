import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Box,
  Switch,
  CircularProgress,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { baseUrl, DOWNLOAD_FILE, CREATE_CATEGORY, CREATE_BRAND } from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import axiosInstance from "../dataFetch/axiosInstance";
import { logout } from "../../redux/slices/user";
import BrandModal from "../../pages/Brands/modal";
import { TextInput, TextEditor, UploadImage, CategoryTree } from "../common";

// Simple Category Modal Component
const CategoryModal = ({ open, close, categories, onCategoryAdded }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState();
  const [parent, setParent] = useState("");
  const [active, setActive] = useState(true);
  const [insurance, setInsurance] = useState(false);
  const [slug, setSlug] = useState("");
  const [selectedProductImage, setSelectedProductImage] = useState();

  const resetData = () => {
    setTitle("");
    setDescription("");
    setAvatar();
    setParent("");
    setActive(true);
    setInsurance(false);
    setSlug("");
    setSelectedProductImage();
  };

  const handleClose = () => {
    close();
    resetData();
  };

  const handleSubmit = () => {
    if (!title || !slug) {
      toast.error("نام و نشانی دسته بندی را وارد کنید");
      return;
    }

    const sendingData = {
      parentId: parent || null,
      title: title.trim(),
      description,
      files: avatar || null,
      fromGallery: selectedProductImage ? selectedProductImage : "",
      active: Boolean(active),
      insurance: Boolean(insurance),
      slug: slug.replace(/\s+/g, "-").replace(/\//g, ""),
    };

    setLoading(true);
    axiosInstance
      .post(`${baseUrl}/${CREATE_CATEGORY}`, sendingData, configReq(token))
      .then((res) => {
        setLoading(false);
        toast.success("با موفقیت اضافه شد");
        onCategoryAdded(res.data.data);
        handleClose();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message || "خطا در افزودن دسته بندی");
        if (err.response?.status === 401) {
          dispatch(logout());
        }
      });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: "0.5rem",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle style={{ backgroundColor: "#f5f5f5", color: "#333" }}>
        افزودن دسته‌بندی جدید
      </DialogTitle>
      <DialogContent style={{ padding: "1.5rem" }}>
        <div className="flex flex-col gap-4">
          <TextInput
            label="نام دسته بندی جدید"
            change={setTitle}
            currentValue={title}
          />
          <TextInput
            label="نشانی دسته بندی جدید"
            change={setSlug}
            currentValue={slug}
          />
          <CategoryTree
            value={categories.find((item) => item.id === parent)}
            change={(e) => setParent(e ? e.id : null)}
            data={categories}
            title="والد دسته بندی"
            emptyValue={true}
          />
          <Box className="mt-4" sx={{ direction: "ltr !important" }}>
            <span className="text-xs">توضیحات</span>
            <TextEditor
              value={description || ""}
              noBorder
              change={(e) => setDescription(e)}
            />
          </Box>
          <div className="flex flex-wrap items-center gap-3">
            <span>فعال سازی خدمات: </span>
            <Switch
              checked={insurance}
              onChange={() => setInsurance(!insurance)}
            />
            <span>فعال/غیر فعال : </span>
            <Switch checked={active} onChange={() => setActive(!active)} />
          </div>
          <UploadImage
            file={avatar}
            change={setAvatar}
            selectedProductImage={selectedProductImage}
            setselectedProductImage={setSelectedProductImage}
          />
        </div>
      </DialogContent>
      <DialogActions style={{ padding: "1rem 1.5rem" }}>
        <Button onClick={handleClose} color="secondary">
          انصراف
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : "ثبت اطلاعات"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CategoryBrands = ({
  categoriesData,
  brandsData,
  selectedCategory,
  selectedBrand,
  onCategoryChange,
  onBrandChange,
  categoryError,
  brandError,
}) => {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [step, setStep] = useState("category");
  const [selectedCategoryTemp, setSelectedCategoryTemp] = useState(null);
  const [selectedPath, setSelectedPath] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryTree, setCategoryTree] = useState([]);
  const [categories, setCategoires] = useState([]);
  const [brands, setBrands] = useState([]);
  
  // Modal states
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [brandModalOpen, setBrandModalOpen] = useState(false);

  useEffect(() => {
    setCategoires(categoriesData);
  }, [categoriesData]);

  useEffect(() => {
    setBrands(brandsData);
  }, [brandsData]);

  useEffect(() => {
    if (categories && categories.length > 0) {
      const tree = buildCategoryTree(categories);
      setCategoryTree(tree);

      expandAllCategories(tree);
    }
  }, [categories]);

  const expandAllCategories = (categories) => {
    const newExpanded = { ...expanded };

    const processCategories = (cats) => {
      if (!cats || !cats.length) return;

      cats.forEach((category) => {
        if (category.childs && category.childs.length > 0) {
          newExpanded[category.id] = true;
          processCategories(category.childs);
        }
      });
    };

    processCategories(categories);
    setExpanded(newExpanded);
  };

  const buildCategoryTree = (flatCategories) => {
    const categoryMap = {};
    const rootCategories = [];

    flatCategories.forEach((category) => {
      categoryMap[category.id] = {
        ...category,
        childs: [],
      };
    });

    flatCategories.forEach((category) => {
      if (category.parentId && categoryMap[category.parentId]) {
        categoryMap[category.parentId].childs.push(categoryMap[category.id]);
      } else {
        rootCategories.push(categoryMap[category.id]);
      }
    });

    return rootCategories;
  };

  const handleOpen = () => {
    setOpen(true);
    setStep("category");
    setSelectedPath([]);
    setSelectedCategoryTemp(selectedCategory);
    setSearchTerm("");

    if (categoryTree && categoryTree.length > 0) {
      expandAllCategories(categoryTree);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCategorySelect = (category, path = []) => {
    setSelectedCategoryTemp(category);
    setSelectedPath([...path, category]);
    setSearchTerm("");
  };

  const handleBrandSelect = (brand) => {
    onBrandChange(brand);
    // handleClose();
  };

  const toggleExpand = (categoryId) => {
    setExpanded({
      ...expanded,
      [categoryId]: !expanded[categoryId],
    });
  };

  const filterCategories = (categories, term) => {
    if (!term) return categories;

    return categories
      .filter((category) => {
        const matchesTitle = category.title
          .toLowerCase()
          .includes(term.toLowerCase());
        const hasMatchingChildren =
          category.childs && filterCategories(category.childs, term).length > 0;

        return matchesTitle || hasMatchingChildren;
      })
      .map((category) => {
        if (!category.childs) return category;

        return {
          ...category,
          childs: filterCategories(category.childs, term),
        };
      });
  };
  const getCategoryPathWithFormattedLastChild = (path) => {
    let pathItems = [];

    if (path && path.length > 0) {
      for (let i = 0; i < path.length; i++) {
        if (i === path.length - 1) {
          pathItems.push(
            <span key={`path-${i}`} className="font-bold text-red-600">
              {path[i].title}
            </span>
          );
        } else {
          pathItems.push(
            <span key={`path-${i}`} className="text-gray-800">
              {path[i].title}
            </span>
          );
        }

        if (i < path.length - 1) {
          pathItems.push(
            <span key={`sep-${i}`} className="text-gray-800 mx-1">
              {" > "}
            </span>
          );
        }
      }
    } else if (selectedCategoryTemp) {
      const buildPath = (categories, targetId, currentPath = []) => {
        for (const category of categories || []) {
          if (category.id === targetId) {
            return [...currentPath, category];
          }

          if (category.childs && category.childs.length > 0) {
            const foundPath = buildPath(category.childs, targetId, [
              ...currentPath,
              category,
            ]);
            if (foundPath) return foundPath;
          }
        }
        return null;
      };

      const fullPath = buildPath(categoryTree, selectedCategoryTemp.id);

      if (fullPath && fullPath.length > 0) {
        for (let i = 0; i < fullPath.length; i++) {
          if (i === fullPath.length - 1) {
            pathItems.push(
              <span key={`path-${i}`} className="font-bold text-red-600">
                {fullPath[i].title}
              </span>
            );
          } else {
            pathItems.push(
              <span key={`path-${i}`} className="text-gray-800">
                {fullPath[i].title}
              </span>
            );
          }

          if (i < fullPath.length - 1) {
            pathItems.push(
              <span key={`sep-${i}`} className="text-gray-800 mx-1">
                {" > "}
              </span>
            );
          }
        }
      } else {
        pathItems.push(
          <span key="last-item" className="font-bold text-red-600">
            {selectedCategoryTemp.title}
          </span>
        );
      }
    }

    return pathItems.length > 0 ? <>{pathItems}</> : "";
  };

  const renderCategoryTree = (nodes, path = [], level = 0) => {
    return (
      <ul
        style={{ marginRight: `${level * 10}px` }}
        className={`space-y-0.5 ${level > 0 ? "mt-2 " : "my-2"}`}
      >
        {nodes.map((category) => {
          const hasChildren = category.childs && category.childs.length > 0;
          const isExpanded = expanded[category.id] || false;
          const isSelected = selectedCategoryTemp?.id === category.id;

          return (
            <React.Fragment key={category.id}>
              <li id={`category-${category.id}`}>
                <div
                  className={`relative flex items-center cursor-pointer py-1.5 px-2 rounded-md transition-colors duration-150 
                    ${isSelected ? "bg-blue-50" : "hover:bg-gray-100"}`}
                >
                  <div className="flex items-center flex-1">
                    {hasChildren ? (
                      <button
                        className="mr-1 p-0.5 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center w-6 h-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(category.id);
                        }}
                      >
                        {isExpanded ? (
                          <ExpandMoreIcon fontSize="small" />
                        ) : (
                          <ChevronRightIcon
                            fontSize="small"
                            className="!rotate-180"
                          />
                        )}
                      </button>
                    ) : (
                      <div className="w-6 mr-1"></div>
                    )}

                    <div
                      className="mx-2 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategorySelect(category, path);
                      }}
                    >
                      {isSelected ? (
                        <CheckBoxIcon
                          className="text-blue-600"
                          fontSize="small"
                        />
                      ) : (
                        <CheckBoxOutlineBlankIcon
                          className="text-gray-400 hover:text-gray-600"
                          fontSize="small"
                        />
                      )}
                    </div>

                    <span
                      className={`text-gray-800 select-none ${
                        hasChildren ? "font-semibold" : ""
                      }`}
                      onClick={() => {
                        if (hasChildren) {
                          toggleExpand(category.id);
                        }
                      }}
                    >
                      {category.title}
                    </span>
                  </div>
                </div>

                {hasChildren && (
                  <motion.div
                    initial={
                      isExpanded
                        ? { height: "auto", opacity: 1 }
                        : { height: 0, opacity: 0 }
                    }
                    animate={
                      isExpanded
                        ? { height: "auto", opacity: 1 }
                        : { height: 0, opacity: 0 }
                    }
                    transition={{ duration: 0.15, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                    className="ml-8 pl-2 border-l border-gray-200"
                  >
                    {renderCategoryTree(
                      category.childs,
                      [...path, category],
                      level + 1
                    )}
                  </motion.div>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ul>
    );
  };

  const filteredBrands = brands.filter((brand) =>
    brand.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = searchTerm
    ? filterCategories(categoryTree, searchTerm)
    : categoryTree;

  const renderBrandSelection = () => {
    return (
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.1, delay: 0.1 }}
      >
        <div className="mb-6">
          <div className="p-4 bg-gray-50 rounded-lg mb-6 border-l-4 border-blue-500">
            <p className="mb-1 text-gray-800 flex justify-between items-center">
              <span>
                دسته‌بندی انتخاب شده:{" "}
                <span>
                  {getCategoryPathWithFormattedLastChild(selectedPath)}
                </span>
              </span>
              {selectedBrand && (
                <button
                  onClick={scrollToSelectedBrand}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                >
                  رفتن به برند انتخاب شده
                </button>
              )}
            </p>
            <p className="text-sm text-gray-600">
              لطفاً برند مورد نظر را از لیست زیر انتخاب کنید
            </p>
          </div>

          <div className="relative mb-6">
            <input
              type="text"
              placeholder="جستجوی برند..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <SearchIcon className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        <div className="max-h-[400px] overflow-auto pt-3 pr-1">
          {filteredBrands.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {filteredBrands.map((brand) => (
                <div
                  key={brand.id}
                  id={`brand-${brand.id}`}
                  onClick={() => handleBrandSelect(brand)}
                  className={`p-4 rounded-lg cursor-pointer border transition-all duration-100 flex flex-col items-center justify-center hover:shadow-md hover:-translate-y-1 ${
                    selectedBrand?.id === brand.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  {brand.galleryId && (
                    <img
                      src={`${baseUrl}/${DOWNLOAD_FILE}/${brand.galleryId}?size=tiny`}
                      alt={brand.title}
                      className="h-12 max-w-full mb-3 object-contain"
                    />
                  )}
                  <span
                    className={`text-center ${
                      selectedBrand?.id === brand.id ? "font-medium" : ""
                    }`}
                  >
                    {brand.title}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-gray-50 rounded-lg">
              <span className="text-gray-500">برندی با این عنوان یافت نشد</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const scrollToSelected = () => {
    if (selectedCategoryTemp) {
      const selectedElement = document.getElementById(
        `category-${selectedCategoryTemp.id}`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const scrollToSelectedBrand = () => {
    if (selectedBrand) {
      const selectedElement = document.getElementById(
        `brand-${selectedBrand.id}`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handleCategoryAdded = (newCategory) => {
    const updatedCategories = [...categories, newCategory];
    setCategoires(updatedCategories);
    const tree = buildCategoryTree(updatedCategories);
    setCategoryTree(tree);
    expandAllCategories(tree);
  };

  const handleBrandAdded = (newBrand) => {
    setBrands([newBrand, ...brands]);
  };

  const handleBrandModalClose = () => {
    setBrandModalOpen(false);
  };

  return (
    <div className="flex gap-4">
      <div className="w-full">
        <TextField
          label="دسته‌بندی"
          onChange={(e) => {
            handleOpen();
          }}
          onClick={handleOpen}
          fullWidth
          value={selectedCategory?.title}
          error={categoryError}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
      <div className="w-full">
        <TextField
          label="برند"
          onChange={(e) => {
            handleOpen();
          }}
          fullWidth
          onClick={handleOpen}
          value={selectedBrand?.title}
          error={categoryError}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: "0.5rem",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          },
        }}
      >
        <div className="flex items-center justify-between">
          <DialogTitle
            style={{
              backgroundColor: "#f5f5f5",
              color: "#333",
              padding: "0.75rem 1.5rem",
              borderBottom: "1px solid #e0e0e0",
              fontWeight: 500,
            }}
          >
            {step === "category" ? "انتخاب دسته‌بندی" : "انتخاب برند"}
          </DialogTitle>
          <div className="px-4">
            <IconButton
              onClick={() => {
                if (step === "category") {
                  setCategoryModalOpen(true);
                } else {
                  setBrandModalOpen(true);
                }
              }}
              color="primary"
              size="small"
              sx={{
                backgroundColor: "#f0f0f0",
                "&:hover": { backgroundColor: "#e0e0e0" },
              }}
            >
              <AddIcon />
            </IconButton>
          </div>
        </div>

        <DialogContent
          style={{ minHeight: "500px", padding: "1.5rem", marginTop: "0.5rem" }}
        >
          {step === "category" && (
            <>
              {selectedCategoryTemp && (
                <div className="p-4 bg-gray-50 rounded-lg mb-6 border-l-4 border-blue-500">
                  <p className="mb-1 text-gray-800 flex justify-between items-center">
                    <span>
                      دسته‌بندی انتخاب شده:{" "}
                      <span>
                        {getCategoryPathWithFormattedLastChild(selectedPath)}
                      </span>
                    </span>
                    <button
                      onClick={scrollToSelected}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                    >
                      رفتن به انتخاب شده
                    </button>
                  </p>
                </div>
              )}
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="جستجوی دسته‌بندی..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <SearchIcon className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </>
          )}

          <AnimatePresence mode="wait">
            {step === "category" ? (
              <motion.div
                key="category"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1, delay: 0.1 }}
              >
                <div className="p-4 border border-gray-200 rounded-lg">
                  {filteredCategories.length > 0 ? (
                    <div className="max-h-[450px] overflow-y-auto">
                      {renderCategoryTree(filteredCategories)}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <span className="text-gray-500">
                        دسته‌بندی با این عنوان یافت نشد
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="brand"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1, delay: 0.1 }}
              >
                {renderBrandSelection()}
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>

        <DialogActions
          style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e0e0e0" }}
        >
          <div className="flex items-center w-full justify-between">
            {step !== "category" ? (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ArrowBackIcon className="!rotate-180" />}
                onClick={() => setStep("category")}
              >
                بازگشت به دسته‌بندی‌ها
              </Button>
            ) : (
              <div></div>
            )}

            {step === "category" ? (
              <Button
                onClick={() => {
                  setStep("brand");
                  onCategoryChange(selectedCategoryTemp);
                }}
                variant="contained"
              >
                ثبت دسته بندی
              </Button>
            ) : (
              <Button onClick={handleClose} variant="contained">
                ثبت برند
              </Button>
            )}
          </div>
        </DialogActions>
      </Dialog>

      {/* Category Modal */}
      <CategoryModal
        open={categoryModalOpen}
        close={() => setCategoryModalOpen(false)}
        categories={categories}
        onCategoryAdded={handleCategoryAdded}
      />

      {/* Brand Modal */}
      <BrandModal
        open={brandModalOpen}
        close={handleBrandModalClose}
        data={{}}
        forEdit={false}
        setAllRows={setBrands}
        allRows={brands}
      />
    </div>
  );
};

export default CategoryBrands;
