import { Close } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { baseUrl, DOWNLOAD_FILE } from "../../../helpers/api-routes";

const PulbicAtterbutites = ({ data, sendData, limit }) => {
  const [characters, updateCharacters] = useState(data?.data);
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
  const removeItem = (id) => {
    var all = [...characters];
    var afterDelete = all.filter((item) => item.id !== id);

    updateCharacters(afterDelete);
  };
  useEffect(() => {
    sendData(characters);
  }, [characters]);

  return (
    <div>
      <div className="mb-3 flex items-center text-sm">
        اولویت نمایش :{" "}
        <span className="text-xs">
          (با جابه جا کردن کارت ها اولویت نمایش را تغییر دهید){" "}
          {limit ? <>{limit} مورد</> : <></>}
        </span>
      </div>
      {characters?.length > 0 && (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="characters">
            {(provided) => (
              <ul
                className="characters"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {characters.map(({ id, title, avatar }, index) => {
                  return (
                    <Draggable key={id} draggableId={String(id)} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div
                            className="border rounded-sm p-3 flex items-center justify-between"
                            key={index}
                          >
                            {" "}
                            {title}
                            <div className="flex gap-9">
                              <img
                                className="w-7 "
                                src={`${baseUrl}/${DOWNLOAD_FILE}/${avatar}?size=tiny`}
                                alt=""
                              />
                              <Close
                                onClick={() => removeItem(id)}
                                className="text-red-600 cursor-pointer"
                              />
                            </div>
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

export default PulbicAtterbutites;
const finalSpaceCharacters = [
  {
    id: "gary",
    title: "Gary Goodspeed",
    thumb: "/images/gary.png",
  },
  {
    id: "cato",
    title: "Little Cato",
    thumb: "/images/cato.png",
  },
  {
    id: "kvn",
    title: "KVN",
    thumb: "/images/kvn.png",
  },
  {
    id: "mooncake",
    title: "Mooncake",
    thumb: "/images/mooncake.png",
  },
  {
    id: "quinn",
    title: "Quinn Ergon",
    thumb: "/images/quinn.png",
  },
];
