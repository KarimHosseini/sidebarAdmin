import { IconButton } from "@mui/material";
import React from "react";
import { TextInput } from "../../components/common";
import { Edit } from "@mui/icons-material";

const UserData = ({ userData ,reuqestDetail}) => {
  return (
    <div>
      <div className="flex justify-center items-center border-b mb-2 pb-2">
        <h2 className="font-bold">
          {" "}
         { reuqestDetail.RequestType === 1 ?  "در خواست حقیقی " : "در خواست حقوقی"}
          <IconButton target={"_blank"} href={`/users/${userData?.id}`}>
            <Edit color="warning" />
          </IconButton>
        </h2>
      </div>

      <div className="md:grid grid-cols-3 flex flex-col gap-4 mt-7">
        {" "}
        <TextInput disabled label="نام  پذیرنده" currentValue={userData?.fname} />{" "}
        <TextInput disabled label=" نام خانوادگی پذیرنده" currentValue={userData?.lname} />{" "}
        <TextInput disabled label="کد ملی  "currentValue={userData?.nationalCode} />

        <TextInput disabled label="شماره همراه  " currentValue={userData?.mobile} />{" "}
        <TextInput disabled label="ایمیل" currentValue={userData?.email} />{" "}
        {userData.isLegal ? (
          <>
            <TextInput
                disabled
              currentValue={userData?.isMale ? "مرد" : "زن"}
              label="جنسیت"
            />
            <TextInput disabled label=" زمینه فعالیت " currentValue={userData?.activityField} />
            <TextInput disabled label="شرح فعالیت " currentValue={userData?.activityDescription} />
            <TextInput disabled label=" نام کامل فروشگاه " currentValue={userData?.shopName} />
            <TextInput disabled label=" نام مالک فروشگاه" currentValue={userData?.managerFullName} />
            <TextInput disabled label=" نشانی سایت" currentValue={userData?.website} />
            <TextInput disabled label="شماره تلفن ثابت " currentValue={userData?.tel} />
            <TextInput disabled label="نام شعبه " currentValue={userData?.branchName} />
            <TextInput disabled label="استان " currentValue={userData?.province} />
            <TextInput disabled label=" شهر" currentValue={userData?.city} />
            <TextInput disabled label="نشانی شعبه مرکزی" currentValue={userData?.branchAddress} />
            <TextInput disabled label=" کد پستی فروشگاه " currentValue={userData?.shopPostalCode} />
            <TextInput disabled label="  متراژ کل فروشگاه" currentValue={userData?.squareMeters} />



          </>
        ) : (
          <>        
            <TextInput disabled label=" نام کامل شرکت" currentValue={userData?.companyName} />
            <TextInput disabled label=" شناسه  ملی شرکت" currentValue={userData?.nationalId} />
            <TextInput disabled label=" زمینه فعالیت" currentValue={userData?.activityField} />
            <TextInput disabled label="نام مدیر عامل " currentValue={userData?.managerFullName} />
            <TextInput disabled label=" کد ملی مدیر عامل " currentValue={userData?.managerNationalId} />       
            <TextInput disabled label="کد پستی " currentValue={userData?.postalCode} />
            <TextInput disabled label="استان " currentValue={userData?.province} />
            <TextInput disabled label=" شهر" currentValue={userData?.city} />
            <TextInput disabled label=" نشانی شرکت" currentValue={userData?.address} />
            <TextInput disabled label="شماره تلفن ثابت " currentValue={userData?.tel} />
            <TextInput disabled label="نشانی سایت " currentValue={userData?.website} />           
            <TextInput disabled label="نام شعبه " currentValue={userData?.branchName} />           
            <TextInput disabled label=" نشانی شعبه مرکزی" currentValue={userData?.branchAddress} />           
           
            </>
        )}
                    <TextInput disabled label=" توضیحات" currentValue={userData?.description} />           

            {     userData?.branchAddress1 &&   <TextInput disabled label="نشانی شعبه  1" currentValue={userData?.branchAddress1} />}
            {     userData?.branchAddress2 &&   <TextInput disabled label="نشانی شعبه  2" currentValue={userData?.branchAddress2} />}
            {     userData?.branchAddress3 &&   <TextInput disabled label="نشانی شعبه  3" currentValue={userData?.branchAddress3} />}
            {     userData?.branchAddress4 &&   <TextInput disabled label="نشانی شعبه  4" currentValue={userData?.branchAddress4} />}
            {     userData?.branchAddress5 &&   <TextInput disabled label="نشانی شعبه  5" currentValue={userData?.branchAddress5} />}
            {     userData?.branchAddress6 &&   <TextInput disabled label="نشانی شعبه  6" currentValue={userData?.branchAddress6} />}
            {     userData?.branchAddress7 &&   <TextInput disabled label="نشانی شعبه  7" currentValue={userData?.branchAddress7} />}
            {     userData?.branchAddress8 &&   <TextInput disabled label="نشانی شعبه  8" currentValue={userData?.branchAddress8} />}
            {     userData?.branchAddress9 &&   <TextInput disabled label="نشانی شعبه  9" currentValue={userData?.branchAddress9} />}
            {     userData?.branchAddress10 &&   <TextInput disabled label="نشانی شعبه  10" currentValue={userData?.branchAddress10} />}
      </div>
    </div>
  );
};

export default UserData;
