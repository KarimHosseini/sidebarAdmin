import React from "react";
import { PageTitle } from "../../components/common";
import { Paper } from "@mui/material";

const Help = () => {
  return (
    <>
      {" "}
      <PageTitle
        broadCrumb={[
          {
            title: "   تنظیمات",
            path: "/companyInfo",
          },
        ]}
        title=" هدر های دیتابیس"
      />
      <div className="md:mx-3 mx-1">
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
        ></Paper>
      </div>
    </>
  );
};

export default Help;
