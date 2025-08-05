import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { baseUrl, DOWNLOAD_FILE, EDIT_MENU_ITEMS, menuItems } from "../../helpers/api-routes";
import { configReq, snackMaker } from "../../helpers/functions";
import { addSnack } from "../../redux/slices/snacks";
import { useParams } from "react-router-dom";
import axiosInstance from "../../components/dataFetch/axiosInstance";

const AllMenu = ({ data, setLoading, resetModal }) => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [characters, updateCharacters] = useState(data?.data);
  useEffect(() => {
    updateCharacters(data?.data);
  }, [data?.data]);
  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(characters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateCharacters(items);
    /*     sendedItems(items) */
  }
  const editHandler = () => {
    const formData2 = new FormData();
    setLoading(true);
    var temp = [];

    characters.map((item, index) => {
      temp.push({ ...item, menuId: id, idx: index + 1 });
    });
    formData2.append("menus", JSON.stringify(temp));
    axiosInstance
      .put(`${baseUrl}/${EDIT_MENU_ITEMS}`, formData2, configReq(token))
      .then((res) => {
        setLoading(false);
        resetModal();
        if (res.data.code === 200) {
          dispatch(addSnack(snackMaker("success", "با موفقیت ویرایش شد")));
        }
      })
      .catch((err) => {
        setLoading(false);
        dispatch(addSnack(snackMaker("error", "درخواست ساخت منو انجام نشد")));
      });
  };
  return (
    <div>
      <div className="mb-3 flex items-center text-sm">
        اولویت نمایش :{" "}
        <span className="text-xs">
          (با جابه جا کردن کارت ها اولویت نمایش را تغییر دهید){" "}
        </span>
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
                {characters.map(({ id, title, image }, index) => {
                  return (
                    <Draggable key={id} draggableId={String(id)} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div
                            className="border rounded-sm p-3 flex items-center justify gap-2"
                            key={index}
                          >
                            {" "} <div className="flex">
                              <img
                                className="w-7 "
                                src={`${baseUrl}/${DOWNLOAD_FILE}/${image}?size=tiny`}
                                alt=""
                              />
                            </div>
                            {title}
                           
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
      <div className="flex justify-center mt-4">
        <Button onClick={editHandler} variant="contained">
          ثبت اطلاعات
        </Button>
      </div>
    </div>
  );
};

export default AllMenu;
