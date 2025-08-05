import React, { useEffect, useState } from "react";
import Lightbox from "react-image-lightbox";
import JSZip from "jszip";
import { Button } from "@mui/material";

const Files = ({ data ,userData}) => {
  const [selected, setSeleceted] = useState();
  const [zipFile, setZipFile] = useState(null);
  useEffect(() => {fetchImages()},[])
  const fetchImages = async () => {
    const urls = [];
    if (data?.BirthCertificateGalleryId) {
      urls.push(data.BirthCertificateGalleryId.Url);
    }
    if (data?.NationalCardGalleryId) {
      urls.push(data.NationalCardGalleryId.Url);
    }
    if (data?.OwnershipDocumentGalleryId) {
      urls.push(data.OwnershipDocumentGalleryId.Url);
    }
    if (data?.FinancialStatementGalleryId) {
      urls.push(data.FinancialStatementGalleryId.Url);
    }
    if (data?.StatuteGalleryId) {
      urls.push(data.StatuteGalleryId.Url);
    }
    if (data?.LastPaperGalleryId) {
      urls.push(data.LastPaperGalleryId.Url);
    }
    if (data?.ChangeNoticeGalleryId) {
      urls.push(data.ChangeNoticeGalleryId.Url);
    }
    if (data?.PurpleCheckGalleryId) {
      urls.push(data.PurpleCheckGalleryId.Url);
    }
    if (data?.SixMonthTurnoverGalleryId) {
      urls.push(data.SixMonthTurnoverGalleryId.Url);
    }
    if (data?.LogoGalleryId) {
      urls.push(data.LogoGalleryId.Url);
    }
    if (data?.EnamadGalleryId) {
      urls.push(data.EnamadGalleryId.Url);
    }
    if (data?.InteriorView1GalleryId) {
      urls.push(data.InteriorView1GalleryId.Url);
    }
    if (data?.InteriorView2GalleryId) {
      urls.push(data.InteriorView2GalleryId.Url);
    }
    if (data?.ExteriorView1GalleryId) {
      urls.push(data.ExteriorView1GalleryId.Url);
    }
    if (data?.ExteriorView2GalleryId) {
      urls.push(data.ExteriorView2GalleryId.Url);
    }
    const zip = new JSZip();
    const promises = urls.map(async (url, index) => {
      const response = await fetch(url);
      const blob = await response.blob();
      zip.file(`image${index + 1}.jpg`, blob);
    });

    Promise.all(promises).then(() => {
      zip.generateAsync({ type: "blob" }).then((content) => {
        setZipFile(content);
      });
    });
  };
  const handleDownload = () => {
    const url = window.URL.createObjectURL(zipFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = `مدارک ${userData.fname} ${userData.lname}.zip`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };
  return (
    <div>
      <div className=" gap-4 flex flex-col">
        <div className="flex justify-end">
          {zipFile ? <Button variant="contained" onClick={handleDownload}>دانلود مدارک </Button> : <span>در حال اماده سازی فایل مدارک ...</span>}
        </div>
        {data?.BirthCertificateGalleryId && (
          <div className="flex items-center justify-between">
            <span className="text-sm ">تصویر شناسنامه</span>
            <div className="flex gap-4 items-center flex-wrap">
              <img
                onClick={() => setSeleceted(data.BirthCertificateGalleryId.Url)}
                src={data.BirthCertificateGalleryId.Url}
                className=" w-20 cursor-pointer"
              />
              <a
                className="text-blue-600 underline cursor-pointer"
                target={"_blank"}
                href={data.BirthCertificateGalleryId.Url}
              >
                {data.BirthCertificateGalleryId.OriginalFileName}
              </a>
            </div>
          </div>
        )}
        {data?.NationalCardGalleryId && (
          <div className="flex items-center justify-between">
            <span className="text-sm ">کارت ملی صاحب امضا</span>
            <div className="flex gap-4 items-center flex-wrap">
              <img
                onClick={() => setSeleceted(data.NationalCardGalleryId.Url)}
                src={data.NationalCardGalleryId.Url}
                className=" w-20 cursor-pointer"
              />
              <a
                className="text-blue-600 underline cursor-pointer"
                target={"_blank"}
                href={data.NationalCardGalleryId.Url}
              >
                {data.NationalCardGalleryId.OriginalFileName}
              </a>
            </div>{" "}
          </div>
        )}
        {data?.OwnershipDocumentGalleryId && (
          <div className="flex items-center justify-between">
            <span className="text-sm ">
              سند مالکیت یا اجاره نامه دارای کد رهگیری (مراجعه به سامانه معاملات
              املاک کشور){" "}
            </span>
            <div className="flex gap-4 items-center flex-wrap">
              <img
                onClick={() =>
                  setSeleceted(data.OwnershipDocumentGalleryId.Url)
                }
                src={data.OwnershipDocumentGalleryId.Url}
                className=" w-20 cursor-pointer"
              />
              <a
                className="text-blue-600 underline cursor-pointer"
                target={"_blank"}
                href={data.OwnershipDocumentGalleryId.Url}
              >
                {data.OwnershipDocumentGalleryId.OriginalFileName}
              </a>
            </div>{" "}
          </div>
        )}
        {data?.FinancialStatementGalleryId && (
          <div className="flex items-center justify-between">
            <span className="text-sm "> اساسنامه شرکت</span>
            <div className="flex gap-4 items-center flex-wrap">
              <img
                onClick={() =>
                  setSeleceted(data.FinancialStatementGalleryId.Url)
                }
                src={data.FinancialStatementGalleryId.Url}
                className=" w-20 cursor-pointer"
              />
              <a
                className="text-blue-600 underline cursor-pointer"
                target={"_blank"}
                href={data.FinancialStatementGalleryId.Url}
              >
                {data.FinancialStatementGalleryId.OriginalFileName}
              </a>
            </div>{" "}
          </div>
        )}
        {data?.StatuteGalleryId && (
          <div className="flex items-center justify-between">
            <span className="text-sm ">
              {" "}
              جواز کسب (نشانی ثبت شده در جواز کسب با نشانی اجاره نامه یکسان باشد){" "}
            </span>
            <div className="flex gap-4 items-center flex-wrap">
              <img
                onClick={() => setSeleceted(data.StatuteGalleryId.Url)}
                src={data.StatuteGalleryId.Url}
                className=" w-20 cursor-pointer"
              />
              <a
                className="text-blue-600 underline cursor-pointer"
                target={"_blank"}
                href={data.StatuteGalleryId.Url}
              >
                {data.StatuteGalleryId.OriginalFileName}
              </a>
            </div>{" "}
          </div>
        )}
        {data?.LastPaperGalleryId && (
          <div className="flex items-center justify-between">
            <span className="text-sm ">آخرین روزنامه رسمی </span>
            <div className="flex gap-4 items-center flex-wrap">
              <img
                onClick={() => setSeleceted(data.LastPaperGalleryId.Url)}
                src={data.LastPaperGalleryId.Url}
                className=" w-20 cursor-pointer"
              />
              <a
                className="text-blue-600 underline cursor-pointer"
                target={"_blank"}
                href={data.LastPaperGalleryId.Url}
              >
                {data.LastPaperGalleryId.OriginalFileName}
              </a>
            </div>{" "}
          </div>
        )}
        {data?.ChangeNoticeGalleryId && (
          <div className="flex items-center justify-between">
            <span className="text-sm ">آگهی تغییرات </span>
            <div className="flex gap-4 items-center flex-wrap">
              <img
                onClick={() => setSeleceted(data.ChangeNoticeGalleryId.Url)}
                src={data.ChangeNoticeGalleryId.Url}
                className=" w-20 cursor-pointer"
              />
              <a
                className="text-blue-600 underline cursor-pointer"
                target={"_blank"}
                href={data.ChangeNoticeGalleryId.Url}
              >
                {data.ChangeNoticeGalleryId.OriginalFileName}
              </a>
            </div>
          </div>
        )}
        {data?.PurpleCheckGalleryId && (
          <div className="flex items-center justify-between">
            <span className="text-sm ">تصویر چک صیادی بنفش</span>
            <div className="flex gap-4 items-center flex-wrap">
              <img
                onClick={() => setSeleceted(data.PurpleCheckGalleryId.Url)}
                src={data.PurpleCheckGalleryId.Url}
                className=" w-20 cursor-pointer"
              />
              <a
                className="text-blue-600 underline cursor-pointer"
                target={"_blank"}
                href={data.PurpleCheckGalleryId.Url}
              >
                {data.PurpleCheckGalleryId.OriginalFileName}
              </a>
            </div>{" "}
          </div>
        )}
        {data?.SixMonthTurnoverGalleryId && (
          <div className="flex items-center justify-between">
            <span className="text-sm ">
              پرینت گردش شش ماهه و یا گردش حساب متصل به دستگاه کارتخوان PDF{" "}
            </span>
            <div className="flex gap-4 items-center flex-wrap">
              <img
                onClick={() => setSeleceted(data.SixMonthTurnoverGalleryId.Url)}
                src={data.SixMonthTurnoverGalleryId.Url}
                className=" w-20 cursor-pointer"
              />
              <a
                className="text-blue-600 underline cursor-pointer"
                target={"_blank"}
                href={data.SixMonthTurnoverGalleryId.Url}
              >
                {data.SixMonthTurnoverGalleryId.OriginalFileName}
              </a>
            </div>
          </div>
        )}
        {data?.LogoGalleryId && (
          <div className="flex items-center justify-between">
            <span className="text-sm ">لوگو / آرم با زمینه سفید </span>
            <div className="flex gap-4 items-center flex-wrap">
              <img
                onClick={() => setSeleceted(data.LogoGalleryId.Url)}
                src={data.LogoGalleryId.Url}
                className=" w-20 cursor-pointer"
              />
              <a
                className="text-blue-600 underline cursor-pointer"
                target={"_blank"}
                href={data.LogoGalleryId.Url}
              >
                {data.LogoGalleryId.OriginalFileName}
              </a>
            </div>{" "}
          </div>
        )}
        {data?.EnamadGalleryId && (
          <div className="flex items-center justify-between">
            <span className="text-sm ">
              تصویر اینماد در صورت داشتن فروشگاه اینترنتی ( اسکرین شات ){" "}
            </span>
            <div className="flex gap-4 items-center flex-wrap">
              <img
                onClick={() => setSeleceted(data.EnamadGalleryId.Url)}
                src={data.EnamadGalleryId.Url}
                className=" w-20 cursor-pointer"
              />
              <a
                className="text-blue-600 underline cursor-pointer"
                target={"_blank"}
                href={data.EnamadGalleryId.Url}
              >
                {data.EnamadGalleryId.OriginalFileName}
              </a>
            </div>{" "}
          </div>
        )}
        {data?.InteriorView1GalleryId && (
          <div className="flex items-center justify-between">
            <span className="text-sm ">تصویر فروشگاه از نمای داخلی </span>
            <div className="flex gap-4 items-center flex-wrap">
              <img
                onClick={() => setSeleceted(data.InteriorView1GalleryId.Url)}
                src={data.InteriorView1GalleryId.Url}
                className=" w-20 cursor-pointer"
              />
              <a
                className="text-blue-600 underline cursor-pointer"
                target={"_blank"}
                href={data.InteriorView1GalleryId.Url}
              >
                {data.InteriorView1GalleryId.OriginalFileName}
              </a>
            </div>{" "}
          </div>
        )}
        {data?.InteriorView2GalleryId && (
          <div className="flex items-center justify-between">
            <span className="text-sm ">تصویر فروشگاه از نمای داخلی </span>
            <div className="flex gap-4 items-center flex-wrap">
              <img
                onClick={() => setSeleceted(data.InteriorView2GalleryId.Url)}
                src={data.InteriorView2GalleryId.Url}
                className=" w-20 cursor-pointer"
              />
              <a
                className="text-blue-600 underline cursor-pointer"
                target={"_blank"}
                href={data.InteriorView2GalleryId.Url}
              >
                {data.InteriorView2GalleryId.OriginalFileName}
              </a>
            </div>{" "}
          </div>
        )}
        {data?.ExteriorView1GalleryId && (
          <div className="flex items-center justify-between">
            <span className="text-sm ">تصویر فروشگاه از نمای بیرونی </span>
            <div className="flex gap-4 items-center flex-wrap">
              <img
                onClick={() => setSeleceted(data.ExteriorView1GalleryId.Url)}
                src={data.ExteriorView1GalleryId.Url}
                className=" w-20 cursor-pointer"
              />
              <a
                className="text-blue-600 underline cursor-pointer"
                target={"_blank"}
                href={data.ExteriorView1GalleryId.Url}
              >
                {data.ExteriorView1GalleryId.OriginalFileName}
              </a>
            </div>{" "}
          </div>
        )}
        {data?.ExteriorView2GalleryId && (
          <div className="flex items-center justify-between">
            <span className="text-sm ">تصویر فروشگاه از نمای بیرونی </span>
            <div className="flex gap-4 items-center flex-wrap">
              <img
                onClick={() => setSeleceted(data.ExteriorView2GalleryId.Url)}
                src={data.ExteriorView2GalleryId.Url}
                className=" w-20 cursor-pointer"
              />
              <a
                className="text-blue-600 underline cursor-pointer"
                target={"_blank"}
                href={data.ExteriorView2GalleryId.Url}
              >
                {data.ExteriorView2GalleryId.OriginalFileName}
              </a>
            </div>{" "}
          </div>
        )}
      </div>
      {selected && (
        <Lightbox
          mainSrc={selected}
          onCloseRequest={() => setSeleceted(false)}
        />
      )}
    </div>
  );
};

export default Files;
