import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocalPostOfficeOutlinedIcon from "@mui/icons-material/LocalPostOfficeOutlined";
import { Skeleton, useMediaQuery } from "@mui/material";
import { Fragment, useState } from "react";

const SelectAddress = ({
  address,
  selectedAddress,
  setSelectedAddress,
  setOpenCreate,
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const isMd = useMediaQuery("(min-width:900px)");

  return (
    <div className="flex gap-5 sm:flex-row flex-col flex-wrap md:p-0 p-3">
      {loading ? (
        <>
          <Skeleton
            component={"div"}
            animation="wave"
            variant="rounded"
            width={"100%"}
            height={200}
          />
        </>
      ) : (
        <>
          <div className="md:grid grid-cols-3 gap-4 w-full">
            {" "}
            {address?.map((item, index) => (
              <Fragment key={index}>
                <div
                  className="cursor-pointer"
                  onClick={() => setSelectedAddress(item)}
                >
                  {isMd ? (
                    <div
                      className={`relative w-full border  rounded-[16px] px-4 py-2 ${
                        selectedAddress?.id === item.id
                          ? "text-orange-700 border-orange-700 bg-orange-50"
                          : "text-light-primary-text bg-white"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 text-sm text-light-primary-text items-center">
                          <span>عنوان نشانی: </span>
                          <span> {item.title}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 pb-4">
                        <div className="flex text-sm font-light text-light-primary-text gap-2 items-center">
                          <HomeOutlinedIcon />
                          {item.receptorFname} {item.receptorLname}
                        </div>
                        <div className="flex text-sm font-light text-light-primary-text gap-2 items-center">
                          <CallOutlinedIcon /> {item.receptorMobile}{" "}
                          <div className="flex text-sm font-light text-light-primary-text gap-2 items-center">
                            <LocalPostOfficeOutlinedIcon />
                            {item.postalCode}
                          </div>
                        </div>
                        <div className=" flex gap-2 items-center">
                          {" "}
                          <ApartmentOutlinedIcon />{" "}
                          <span className="text-light-primary-text inline-block text-sm font-light break-all">
                            {item.province} , {item.city} ,{item.address}
                          </span>
                        </div>
                      </div>
                      {/*     <div className="absolute left-8  bottom-5">
                      <FormControlLabel
                        onChange={(e: any) => defualtChange(item.id)}
                        control={
                          <Checkbox checked={item.isDefault} size="small" />
                        }
                        label={
                          <span className="text-xs font-semibold text-[#141414]">
                            نشانی پیش فرض
                          </span>
                        }
                      />
                    </div> */}
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-orange-600">
                          {" "}
                          {item.title}
                        </span>
                      </div>
                      <div className="relative w-full border border-orange-700 rounded-[16px] px-4 py-2 bg-orange-50">
                        <div className="flex flex-col gap-3 pb-4">
                          <div className="flex text-sm font-light text-light-primary-text gap-2 items-center">
                            <img src="/assets/images/icons/Icon 16px/user-octagon 16px.svg" />
                            {item.receptorFname} {item.receptorLname}
                          </div>
                          <div className="flex text-sm font-light text-light-primary-text gap-2 items-center">
                            <img src="/assets/images/icons/Icon 16px/receipt-2 16px.svg" />
                            {item.receptorMobile}{" "}
                            <div className="flex text-sm font-light text-light-primary-text gap-2 items-center">
                              <img src="/assets/images/icons/Icon 16px/receipt-2 16px.svg" />
                              {item.postalCode}
                            </div>
                          </div>
                          <div className=" flex gap-2 items-center">
                            {" "}
                            <img src="/assets/images/icons/Icon 16px/location 16px.svg" />
                            <span className="text-light-primary-text inline-block text-sm font-light break-all">
                              {item.province} , {item.city} ,{item.address}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Fragment>
            ))}
            <div
              onClick={() => {
                setOpenCreate(true);
              }}
              className="py-4 border  cursor-pointer border-blue-500 hover:bg-blue-50 transition-all duration-300  rounded-[16px]
     flex flex-col justify-center items-center gap-2"
            >
              <AddLocationAltOutlinedIcon className="text-[#0082fd] text-2xl" />

              <span className="text-[#0082fd] text-sm">افزودن نشانی جدید</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SelectAddress;
