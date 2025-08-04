import React, { useEffect, useState } from "react";
import { TextInput } from "../common";

const NumberFilter = ({ changeFilter, item, refresh }) => {
  const [value, setValue] = useState("");
  useEffect(() => {
    if (refresh > 0) {
        setValue("")
    }
  }, [refresh]);
  return (
    <>
      {" "}
      <TextInput
        label={item.title}
        currentValue={value}
        noSepreate={true}
        number={true}
        change={(e) => {
          setValue(e);
          changeFilter({
            name: item.name,
            value: e,
            type: "eq",
          });
        }}
      />
    </>
  );
};

export default NumberFilter;
