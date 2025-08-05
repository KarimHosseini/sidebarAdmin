import { Button, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { UploadImage } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  EDIT_COMPANY_LOGO,
  EDIT_COMPANY_SEAL,
  EDIT_DARK_LOGO,
  EDIT_LIGHT_LOGO,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { setCompanyInfo } from "../../redux/slices/relationals";

const Logos = ({ data }) => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const { companyInfo } = useSelector((state) => state.relationals);
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState(null);
  const [selectedProductImage, setselectedProductImage] = useState(null);
  const [avatarD, setAvatarD] = useState(null);
  const [selectedProductImageD, setselectedProductImageD] = useState(null);
  const [avatarS, setAvatarS] = useState(null);
  const [selectedProductImageS, setselectedProductImageS] = useState(null);
  const [avatarC, setAvatarC] = useState(null);
  const [selectedProductImageC, setselectedProductImageC] = useState(null);
  const [loading, setLoading] = useState({
    dark: false,
    light: false,
    sale: false,
  });
  const handleLogoes = () => {
    var c = { ...companyInfo };
    if (!avatar && !selectedProductImage && !data?.companyGalleryId) {
      toast.error("وارد کردن  لوگو روشن الزامی است");
      return;
    }
    if (
      avatar ||
      (selectedProductImage && selectedProductImage !== data?.companyGalleryId)
    ) {
      setLoading({ ...loading, light: true });
      const formData1 = new FormData();
      if (avatar) {
        formData1.append("files", avatar);
      } else {
        formData1.append("fromGallery", selectedProductImage);
      }
      axiosInstance
        .put(`${baseUrl}/${EDIT_LIGHT_LOGO}`, formData1, configReq(token))
        .then((res) => {
          toast.success("با موفقیت لوگو روشن ویرایش شد");

          c = {
            ...companyInfo,
            companyLogo: res.data.data.companyGalleryId,
          };

          setLoading({ ...loading, light: false });
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading({ ...loading, light: false });
        });
    }
    if (
      avatarD ||
      (selectedProductImageD && selectedProductImageD !== data?.companyDarkLogo)
    ) {
      const formData1 = new FormData();

      if (avatarD) {
        formData1.append("files", avatarD);
      } else {
        formData1.append("fromGallery", selectedProductImageD);
      }
      setLoading({ ...loading, dark: true });
      axiosInstance
        .put(`${baseUrl}/${EDIT_DARK_LOGO}`, formData1, configReq(token))
        .then((res) => {
          toast.success("با موفقیت لوگو تیره ویرایش شد");

          c = {
            ...companyInfo,
            companyDarkLogo: res.data.data.companyDarkLogo,
          };

          setLoading({ ...loading, dark: false });
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading({ ...loading, dark: false });
        });
    }
    if (
      avatarS ||
      (selectedProductImageS && selectedProductImageS !== data?.companySeal)
    ) {
      const formData1 = new FormData();
      if (avatarS) {
        formData1.append("files", avatarS);
      } else {
        formData1.append("fromGallery", selectedProductImageS);
      }
      setLoading({ ...loading, sale: true });
      axiosInstance
        .put(`${baseUrl}/${EDIT_COMPANY_SEAL}`, formData1, configReq(token))
        .then((res) => {
          toast.success("با موفقیت مهر شرکت ویرایش شد");

          c = {
            ...companyInfo,
            companySeal: res.data.data.companySeal,
          };

          setLoading({ ...loading, sale: false });
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading({ ...loading, sale: false });
        });
    }
    if (
      avatarC ||
      (selectedProductImageC && selectedProductImageC !== data?.copyrightLogo)
    ) {
      const formData2 = new FormData();
      if (avatarC) {
        formData2.append("files", avatarC);
      } else {
        formData2.append("fromGallery", selectedProductImageC);
      }
      setLoading({ ...loading, copyRight: true });
      axiosInstance
        .put(`${baseUrl}/${EDIT_COMPANY_LOGO}`, formData2, configReq(token))
        .then((res) => {
          toast.success("با موفقیت کپی رایت ویرایش شد");

          c = {
            ...companyInfo,
            copyrightLogo: res.data.data.copyrightLogo,
          };

          setLoading({ ...loading, copyRight: false });
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading({ ...loading, copyRight: false });
        });
    }
    dispatch(
      setCompanyInfo({
        ...c,
      })
    );
  };
  return (
    <div className="md:grid md:grid-cols-4 gap-5 flex flex-col">
      <div>
        <div className="my-3"> - لوگو روشن</div>
        <div className="flex md:gap-10 gap-4 flex-wrap items-end">
          {userPermissions?.companyInfo?.update && (
            <UploadImage
              file={avatar}
              change={setAvatar}
              address={data?.companyGalleryId}
              selectedProductImage={selectedProductImage}
              setselectedProductImage={setselectedProductImage}
            />
          )}
        </div>
      </div>
      <div>
        <div className="my-3"> - لوگو تیره</div>
        <div className="flex md:gap-10 gap-4 flex-wrap items-end">
          {userPermissions?.companyInfo?.update && (
            <UploadImage
              file={avatarD}
              change={setAvatarD}
              address={data?.companyDarkLogo}
              selectedProductImage={selectedProductImageD}
              setselectedProductImage={setselectedProductImageD}
            />
          )}
        </div>
      </div>
      <div>
        <div className="my-3"> - مهر شرکت</div>
        <div className="flex md:gap-10 gap-4 flex-wrap items-end">
          {userPermissions?.companyInfo?.update && (
            <UploadImage
              file={avatarS}
              change={setAvatarS}
              address={data?.companySeal}
              selectedProductImage={selectedProductImageS}
              setselectedProductImage={setselectedProductImageS}
            />
          )}
        </div>{" "}
      </div>{" "}
      <div>
        <div className="my-3"> - لوگو کپی رایت</div>
        <div className="flex md:gap-10 gap-4 flex-wrap items-end">
          {userPermissions?.companyInfo?.update && (
            <UploadImage
              file={avatarC}
              change={setAvatarC}
              address={data?.copyrightLogo}
              selectedProductImage={selectedProductImageC}
              setselectedProductImage={setselectedProductImageC}
            />
          )}
        </div>{" "}
      </div>{" "}
      <div className="flex justify-end items-end">
        {" "}
        <Button
          disabled={
            loading.dark || loading.light || loading.sale || loading.copyRight
          }
          onClick={handleLogoes}
          variant="contained"
        >
          {loading.dark ||
          loading.light ||
          loading.sale ||
          loading.copyRight ? (
            <CircularProgress />
          ) : (
            <>ثبت اطلاعات</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Logos;
