import React, { Fragment } from "react";
import Calender from "./calender";
import CheckBox from "./checkBox";
import CustomeRadio from "./radio";

const Generator = ({ feilds, data, setData }) => {
  return (
    <div>
      {feilds?.map((item, index) => (
        <Fragment key={index + "fragemnt"}>
          {item.type === 1 ? (
            <>
              <CustomeRadio item={item} data={data} setData={setData} />
            </>
          ) : item.type === 2 ? (
            <>
              <CheckBox item={item} data={data} setData={setData} />
            </>
          ) : item.type === 3 ? (
            <></>
          ) : item.type === 4 ? (
            <></>
          ) : item.type === 5 ? (
            <></>
          ) : item.type === 6 ? (
            <>
              <Calender item={item} data={data} setData={setData} />
            </>
          ) : item.type === 7 ? (
            <></>
          ) : (
            <></>
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default Generator;
