import { useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import AddressModal from "../Users/detail/addressModal";
import OrderAddress from "./address";

const Step3 = ({
  shipingCompany,
  setsSelectedShipingCompany,
  selectedShipingCompany,
  setAddress,
  address,
  setBranch,
  branches,
  setSelectedAddress,
  selectedaddress,
  userData,
  province,
  noCod,
}) => {
  const isMd = useMediaQuery("(min-width:900px)");
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <div>
      {" "}
      <div className="md:flex hidden items-center justify-between gap-8 px-3">
        <h1 className="font-semibold text-sm text-light-primary-text">
          انتخاب نحوه ارسال و تحویل
        </h1>
        <div className="w-[70%] h-[1px] bg-light-primary-line"></div>
      </div>
      <div className="rounded-[20px] p-4 my-5 md:bg-white">
        {isMd && (
          <div className="mt-4">
            <OrderAddress
              branches={branches}
              setAddress={(e) => setAddress(e)}
              address={address}
              setBranch={setBranch}
              isCodSelected={selectedShipingCompany?.companyType === 1}
              setSelectedAddress={setSelectedAddress}
              selectedaddress={selectedaddress}
              setOpenCreate={setOpenCreate}
            />
          </div>
        )}
      </div>
      <AddressModal
        open={openCreate}
        forEdit={false}
        prevData={{}}
        setAllRows={setAddress}
        userData={userData}
        allRows={address}
        close={() => {
          setOpenCreate(false);
        }}
        province={province}
      />
    </div>
  );
};

export default Step3;
