import { Checkbox } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const ItemsOrders = ({
  data,
  sendData,
  selectedData,
  setSelectedData,
  title,
}) => {
  const [characters, updateCharacters] = useState(data);
  useEffect(() => {
    updateCharacters(data);
  }, [data]);
  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(characters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateCharacters(items);
    /*     sendedItems(items) */
  }

  useEffect(() => {
    sendData(characters);
  }, [characters]);
  const handleClick = (name) => {
    const selectedIndex = selectedData.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedData, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedData.slice(1));
    } else if (selectedIndex === selectedData.length - 1) {
      newSelected = newSelected.concat(selectedData.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedData.slice(0, selectedIndex),
        selectedData.slice(selectedIndex + 1)
      );
    }
    setSelectedData(newSelected);
  };

  const isSelected = (row) => selectedData.indexOf(row) !== -1;
  const selectAll = (e) => {
    e.target.checked ? setSelectedData(characters) : setSelectedData([]);
  };
  const handleEditCategory = (name, current, value) => {
    var temp = [...characters];
    var temp2 = [...selectedData];
    const findIndex = temp.findIndex(
      (item) => item?.items.id === current.items.id
    );
    const findIndex2 = temp2.findIndex(
      (item) => item?.items.id === current.items.id
    );
    temp[findIndex] = { ...temp[findIndex], [name]: value };
    updateCharacters(temp);
    if (findIndex2) {
      temp2[findIndex2] = { ...temp2[findIndex2], [name]: value };
      setSelectedData(temp2);
    }
  };
  return (
    <div>
      <div className="flex border-b pb-2 mb-2 justify-between item-center">
        <span className="text-sm font-bold mt-3">انتخاب از بین {title} ها</span>
        <div className="flex items-center">
          <Checkbox
            indeterminate={
              selectedData.length > 0 &&
              selectedData.length < characters?.length
            }
            checked={
              characters?.length > 0 &&
              selectedData.length === characters?.length
            }
            onChange={selectAll}
          />
          <span className="text-sm">انتخاب همه</span>
        </div>
      </div>
      <div className="text-xs mb-3 text-gray-500">
        (با جابه جا کردن کارت ها اولویت نمایش را تغییر دهید){" "}
      </div>
      {characters.length > 0 && (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="characters">
            {(provided) => (
              <ul
                className="characters"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {characters.map((item, index) => {
                  return (
                    <Draggable
                      key={item?.items.id}
                      draggableId={String(item?.items.id)}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div
                            className="grid grid-cols-2 gap-2 items-center"
                            key={index}
                          >
                            <div className="flex items-center">
                              {" "}
                              <Checkbox
                                checked={isSelected(item)}
                                onClick={() =>
                                  handleClick(item)
                                } /* checked={item.active} */
                              />
                              <span className="text-xs">
                                {item?.items?.title}
                              </span>
                            </div>

                            {/*      <Box
                              sx={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                              }}
                              onClick={(e) =>
                                handleEditCategory("active", item, !item.active)
                              }
                            >
                              <span className="text-xs font-bold">
                                فعال/غیرفعال:
                              </span>
                              <Switch
                       
                                checked={item.active}
                              />
                            </Box> */}
                          </div>
                        </li>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default ItemsOrders;
