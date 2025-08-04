import { Check, ExpandLess, ExpandMore, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const CategoryTree = ({ data, value, change, title, emptyValue = false }) => {
  const [expanded, setExpanded] = useState({});
  const [selectedItem, setSelectedItem] = useState(value);
  const [tempSelectedItem, setTempSelectedItem] = useState(value);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const map = {};
    data.forEach((item) => {
      const parentId = item.parentId || "root";
      if (!map[parentId]) {
        map[parentId] = [];
      }
      map[parentId].push(item);
    });
    setCategoriesMap(map);
  }, [data]);

  useEffect(() => {
    if (Object.keys(categoriesMap).length > 0) {
      const allExpanded = {};

      const expandAllCategories = (parentId = "root") => {
        const items = categoriesMap[parentId] || [];
        items.forEach((item) => {
          if (categoriesMap[item.id] && categoriesMap[item.id].length > 0) {
            allExpanded[item.id] = true;
            expandAllCategories(item.id);
          }
        });
      };

      expandAllCategories();

      setExpanded(allExpanded);
    }
  }, [categoriesMap]);

  useEffect(() => {
    setSelectedItem(value);
    setTempSelectedItem(value);

    if (value && Object.keys(categoriesMap).length > 0) {
      expandToItem(value.id);
    }
  }, [value, categoriesMap]);

  const expandToItem = (itemId) => {
    const newExpanded = { ...expanded };

    const findAndExpandParents = (categoryId) => {
      for (const parentId in categoriesMap) {
        if (parentId === "root") continue;

        const children = categoriesMap[parentId];
        if (children && children.some((child) => child.id === categoryId)) {
          newExpanded[parentId] = true;
          findAndExpandParents(parentId);
          break;
        }
      }
    };

    findAndExpandParents(itemId);
    setExpanded(newExpanded);
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    const results = [];
    const searchLower = searchTerm.toLowerCase();

    const searchInCategories = (categories) => {
      categories.forEach((category) => {
        if (category.title.toLowerCase().includes(searchLower)) {
          results.push(category.id);
        }

        const children = categoriesMap[category.id];
        if (children && children.length > 0) {
          searchInCategories(children);
        }
      });
    };

    const rootCategories = categoriesMap["root"] || [];
    searchInCategories(rootCategories);

    setSearchResults(results);

    if (results.length > 0) {
      const newExpanded = { ...expanded };

      const expandParents = (categoryId) => {
        for (const parentId in categoriesMap) {
          if (parentId === "root") continue;

          const children = categoriesMap[parentId];
          if (children && children.some((child) => child.id === categoryId)) {
            newExpanded[parentId] = true;
            expandParents(parentId);
            break;
          }
        }
      };

      results.forEach((categoryId) => {
        expandParents(categoryId);
      });

      setExpanded(newExpanded);
    }
  }, [searchTerm, categoriesMap]);

  const handleToggle = (itemId, event) => {
    event.stopPropagation();
    setExpanded((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleTempSelect = (item) => {
    setTempSelectedItem(item);
  };

  const handleSubmit = () => {
    setSelectedItem(tempSelectedItem);
    change(tempSelectedItem);
    setModalOpen(false);
  };

  const isLastChild = (item) => {
    return !categoriesMap[item.id] || categoriesMap[item.id].length === 0;
  };

  const isRootItem = (item) => {
    return item.parentId === null || item.parentId === undefined;
  };

  const isLastItemInParent = (item, parentItems) => {
    if (!parentItems || parentItems.length === 0) return false;
    return parentItems[parentItems.length - 1].id === item.id;
  };

  const renderCategoryItems = (parentId = "root", depth = 0) => {
    const items = categoriesMap[parentId] || [];

    return items.map((item, index) => {
      const hasChildren =
        categoriesMap[item.id] && categoriesMap[item.id].length > 0;
      const isSelected = tempSelectedItem && tempSelectedItem.id === item.id;
      const isMatch =
        searchTerm.trim() !== "" &&
        item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const isLeaf = isLastChild(item);
      const isLastInParent = index === items.length - 1;
      const showDash = isLeaf && !isRootItem(item) && isLastInParent;

      return (
        <React.Fragment key={item.id}>
          <ListItem
            id={`category-item-${item.id}`}
            onClick={() => handleTempSelect(item)}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              backgroundColor: isSelected
                ? "#198dff"
                : isMatch
                ? "rgba(25, 141, 255, 0.1)"
                : "transparent",
              "&:hover": {
                backgroundColor: isSelected ? "#198dff" : "rgba(0, 0, 0, 0.04)",
              },
              color: isSelected ? "#fff" : "inherit",
              borderRadius: "4px",
              mb: 0.5,
              transition: "background-color 0.15s ease-in-out",
            }}
          >
            {hasChildren ? (
              <IconButton
                size="small"
                onClick={(e) => handleToggle(item.id, e)}
                sx={{
                  mr: 1,
                  color: isSelected ? "#fff" : "inherit",
                }}
              >
                {expanded[item.id] ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            ) : (
              <Box
                sx={{
                  width: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: isSelected ? "#fff" : "inherit" }}>
                  -
                </span>
              </Box>
            )}

            <ListItemText
              primary={item.title}
              sx={{
                flexGrow: 1,
                "& .MuiTypography-root": {
                  fontWeight: hasChildren ? 600 : isMatch ? 500 : 400,
                },
              }}
            />

            {isSelected && <Check sx={{ ml: 1, color: "#fff" }} />}
          </ListItem>

          {hasChildren && (
            <Collapse in={expanded[item.id]} timeout={150} unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 4 }}>
                {renderCategoryItems(item.id, depth + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  const handleOpenModal = () => {
    setModalOpen(true);
    setSearchTerm("");
    setTempSelectedItem(selectedItem);

    if (Object.keys(categoriesMap).length > 0) {
      const allExpanded = {};

      const expandAllCategories = (parentId = "root") => {
        const items = categoriesMap[parentId] || [];
        items.forEach((item) => {
          if (categoriesMap[item.id] && categoriesMap[item.id].length > 0) {
            allExpanded[item.id] = true;
            expandAllCategories(item.id);
          }
        });
      };

      expandAllCategories();
      setExpanded(allExpanded);
    }
  };

  const handleCloseModal = () => {
    setTempSelectedItem(selectedItem);

    setModalOpen(false);
  };
  const getParentPath = (item) => {
    if (!item) return "";

    const parentIds = [];
    const parentTitles = [];
    let currentId = item.parentId;
    let currentItem = item;

    parentTitles.push(currentItem.title);

    while (currentId) {
      let parentItem = null;
      for (const key in categoriesMap) {
        const items = categoriesMap[key];
        const found = items.find((i) => i.id === currentId);
        if (found) {
          parentItem = found;
          break;
        }
      }

      if (parentItem) {
        parentTitles.push(parentItem.title);
        currentId = parentItem.parentId;
      } else {
        break;
      }
    }

    parentTitles.reverse();

    return (
      <>
        {parentTitles.slice(0, -1).map((title, index) => (
          <React.Fragment key={index}>
            <span className="text-gray-800">{title}</span>
            {index < parentTitles.length - 2 && (
              <span className="text-gray-800 mx-1"> &gt; </span>
            )}
          </React.Fragment>
        ))}
        {parentTitles.length > 1 && (
          <span className="text-gray-800 mx-1"> &gt; </span>
        )}
        <span style={{ fontWeight: "bold", color: "#ef4444" }}>
          {parentTitles[parentTitles.length - 1]}
        </span>
      </>
    );
  };

  const scrollToSelected = () => {
    if (tempSelectedItem) {
      const selectedElement = document.getElementById(
        `category-item-${tempSelectedItem.id}`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography component={"p"} variant="body2" sx={{ mb: 1 }}>
        {title}{" "}
        {tempSelectedItem && (
          <Typography
            variant="caption"
            component="span"
            sx={{ color: "text.secondary", mx: 2 }}
          >
            {getParentPath(tempSelectedItem)}
          </Typography>
        )}
      </Typography>

      <TextField
        fullWidth
        size="small"
        placeholder={title}
        value={selectedItem ? selectedItem.title : ""}
        onClick={handleOpenModal}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <ExpandMore />
            </InputAdornment>
          ),
        }}
        InputLabelProps={{
          shrink: true,
        }}
        sx={{
          cursor: "pointer",
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
              borderColor: "primary.main",
            },
          },
        }}
      />

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "8px",
            maxHeight: "80vh",
          },
        }}
      >
        <DialogTitle>
          {title}
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            &times;
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="جستجو..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "4px",
                },
              }}
            />
            {tempSelectedItem && (
              <Button
                variant="outlined"
                size="small"
                onClick={scrollToSelected}
                sx={{
                  whiteSpace: "nowrap",
                  minWidth: "auto",
                  px: 1.5,
                }}
              >
                رفتن به انتخاب شده
              </Button>
            )}
          </Box>

          <Paper
            variant="outlined"
            sx={{
              maxHeight: "400px",
              overflow: "auto",
              p: 1,
            }}
          >
            <List dense component="nav">
              {emptyValue && (
                <ListItem
                  button
                  onClick={() => handleTempSelect(null)}
                  sx={{
                    backgroundColor: !tempSelectedItem
                      ? "#198dff"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: !tempSelectedItem
                        ? "#198dff"
                        : "rgba(0, 0, 0, 0.04)",
                    },
                    color: !tempSelectedItem ? "#fff" : "inherit",
                    borderRadius: "4px",
                    mb: 0.5,
                  }}
                >
                  <ListItemText primary="بدون والد" />
                  {!tempSelectedItem && <Check sx={{ ml: 1, color: "#fff" }} />}
                </ListItem>
              )}
              {renderCategoryItems()}
            </List>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
          <Button onClick={handleCloseModal} variant="outlined" color="inherit">
            انصراف
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={tempSelectedItem === null && !emptyValue}
          >
            تایید
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryTree;
