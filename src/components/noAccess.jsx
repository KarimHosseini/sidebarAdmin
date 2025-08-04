import React from "react";
import { PageTitle } from "./common";

const NoAccess = ({ noTitle = true }) => {
  return (
    <>
      {" "}
      {noTitle && <PageTitle />}{" "}
      <div className="flex items-center justify-center flex-col">
        <img
          src="/images/ERROR-403-forbidden.svg"
          alt=""
          className="md:w-96 w-44"
        />
        <span>شما به محتوا این صفحه دسترسی ندارید </span>
      </div>
    </>
  );
};

export default NoAccess;
