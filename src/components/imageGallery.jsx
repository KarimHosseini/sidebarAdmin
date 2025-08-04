import Tooltip from "@mui/material/Tooltip";
import { motion } from "framer-motion";
import React, { useState } from "react";
import Lightbox from "react-image-lightbox";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { baseUrl, DOWNLOAD_FILE } from "../helpers/api-routes";

const ImageGallery = ({
  item,
  choosable = false,
  setSelceted,
  listed = false,
}) => {
  const [openCreate, setOpenCreate] = useState(false);
  const imageUrl = `${baseUrl}/${DOWNLOAD_FILE}/${item.id}`;

  return (
    <div className="relative group cursor-pointer overflow-hidden rounded-lg">
      <Tooltip title={item.originalFileName} arrow>
        <motion.div
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 8px 16px rgba(0,0,0,0.15)",
          }}
          transition={{ type: "spring", stiffness: 300 }}
          className="overflow-hidden"
        >
          <LazyLoadImage
            src={`${imageUrl}?size=meduim`}
            onClick={() =>
              choosable ? setSelceted(item.id) : setOpenCreate(true)
            }
            width="100%"
            height="100%"
            effect="opacity"
            placeholderSrc={`${imageUrl}?size=tiny`}
            className={listed ? "w-16 h-16" : "w-full h-[190px] object-cover"}
            loading="lazy"
            decoding="async"
          />
        </motion.div>
      </Tooltip>

      {choosable && (
        <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      )}

      {openCreate && (
        <Lightbox
          mainSrc={imageUrl}
          onCloseRequest={() => setOpenCreate(false)}
        />
      )}
    </div>
  );
};

export default ImageGallery;
