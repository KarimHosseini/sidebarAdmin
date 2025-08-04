import React, { Fragment } from "react";
import Items from "./item";

const Story = ({ option }) => {
  return (
    <div className="flex items-center overflow-hidden justify-center gap-4">
      {option?.stories?.map((item, index) => (
        <Fragment key={index}>
          <Items item={item} />
        </Fragment>
      ))}
    </div>
  );
};

export default Story;
