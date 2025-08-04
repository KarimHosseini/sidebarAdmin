import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { CategorySlider } from "./productSlide";
import datas from "./p.json";

const ScrollProduct = ({ filter, data, allData }) => {

  return (
    <div>
      {" "}
      <section
        style={{ marginRight: filter === "recommend" ? "200px" : "" }}
        className=" relative md:my-8 mt-8"
      >
        <CategorySlider
          filter={filter}
          limit={data?.showCaseLimit}
          target={false}
          data={
            allData ? allData?.slice(0, data?.showCaseLimit || 3) : datas?.data
          }
          small={false}
          carouselNumber={data?.carouselNumber}
          option={data}
        />
      </section>
    </div>
  );
};

export default ScrollProduct;
