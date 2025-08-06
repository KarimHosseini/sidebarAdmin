/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal } from "../../components/common";
import Uploader from "../../components/common/uploader";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  ALL_WHITE_LIST_USER,
  baseUrl,
  DELETE_ALL_WHITE_LIST_USER,
  EDIT_ACTIVE_ALL_WHITE_LIST_USER,
  EDIT_ACTIVE_WHITE_LIST_USER,
  EXPORT_WHITE_LIST_USER,
  IMPORT_FROM_EXCEL_WHILTE_LIST_USER,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const WhiteListUser = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const { token } = useSelector((state) => state.user);
  const [searchParams] = useSearchParams();
  const guarantorId = searchParams.get("guarantorId");
  const guarantorName = searchParams.get("guarantorName");
  const navigate = useNavigate();
  const [openImport, setOpenImport] = useState(false);
  const [files, setFiles] = useState();
  const [allRows, setAllRows] = useState([]);

  const importCsv = () => {
    const formData = new FormData();
    formData.append("file", files);
    formData.append("guarantorId", guarantorId);

    axiosInstance
      .post(
        `${baseUrl}/${IMPORT_FROM_EXCEL_WHILTE_LIST_USER}`,
        formData,
        configReq(token)
      )
      .then((res) => {
        // Refresh data by updating allRows state  
        window.location.reload(); // Temporary - could be improved
        setOpenImport(false);
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };

  // Define APIs for whitelist user operations
  const whitelistUserApis = {
    GET_DATA: ALL_WHITE_LIST_USER,
    EXPORT_DATA: EXPORT_WHITE_LIST_USER,
    EDIT_ACTIVE_DATA: EDIT_ACTIVE_WHITE_LIST_USER,
    DELETE_ALL_DATA: DELETE_ALL_WHITE_LIST_USER,
    EDIT_ACTIVE_ALL_DATA: EDIT_ACTIVE_ALL_WHITE_LIST_USER,
  };

  // Add default filter for guarantorId if provided
  const defaultFilter = guarantorId ? [
    {
      name: "guarantorId",
      value: guarantorId,
      type: "eq",
    }
  ] : [];

  return (
    <>
      <CustomePage
        apis={whitelistUserApis}
        title={`لیست کاربران سفید ${guarantorName ? `برای ${guarantorName}` : ""}`}
        canAdd={false} // Using custom navigation to create page
        canEdit={false} // No inline editing - navigates to separate page
        permissionsTag="whiteListUser"
        customeModal={false} // No modals - uses separate pages
        feilds={[]} // No form fields - uses separate pages
        broadCrumb={[
          {
            title: "تسهیلات",
            path: "/facilitySetting",
          },
          {
            title: "تضمین کننده ها",
            path: "/guarantor",
          },
        ]}
        defaultFilter={defaultFilter}
        onDataChange={setAllRows} // Update allRows when data changes
        extraButtons={
          <>
            {userPermissions?.whiteListUser?.import && (
              <Button onClick={() => setOpenImport(true)} variant="outlined">
                ایمپورت از اکسل
              </Button>
            )}
            {userPermissions?.whiteListUser?.insert && (
              <Button
                onClick={() =>
                  navigate(
                    `/whiteListUser/create?guarantorId=${guarantorId}&guarantorName=${guarantorName}`
                  )
                }
                variant="contained"
                startIcon={<AddIcon />}
              >
                افزودن کاربر سفید جدید
              </Button>
            )}
          </>
        }
        extraActions={[
          userPermissions?.whiteListHistory?.view && {
            title: "مشاهده سوابق",
            handler: (
              <Button
                variant="outlined"
                onClick={(event) => {
                  const target = event.currentTarget.closest("[data-id]") || event.currentTarget.parentElement;
                  const id = target.getAttribute("data-id");
                  const fullName = target.getAttribute("data-fullName");
                  navigate(
                    `/whiteListHistory?guarantorId=${guarantorId}&guarantorName=${guarantorName}&whiteListId=${id}&whiteListUserName=${fullName}`
                  );
                }}
              >
                مشاهده
              </Button>
            ),
          },
          userPermissions?.whiteListUser?.viewDoc && {
            title: "مشاهده مستندات",
            handler: (
              <Button
                variant="contained"
                onClick={(event) => {
                  const target = event.currentTarget.closest("[data-id]") || event.currentTarget.parentElement;
                  const id = target.getAttribute("data-id");
                  const fullName = target.getAttribute("data-fullName");
                  navigate(
                    `/whiteListDocument/${id}?guarantorId=${guarantorId}&guarantorName=${guarantorName}&whiteListId=${id}&whiteListUserName=${fullName}`
                  );
                }}
              >
                مشاهده
              </Button>
            ),
          },
        ].filter((i) => i)}
        neededFields={["id", "fullName"]}
        showSync={true}
        showExport={true}
      />
      
      <Modal
        open={openImport}
        close={() => {
          setOpenImport(false);
        }}
        title=" ورود  از اکسل"
        autoWidth={true}
      >
        <div className="flex flex-col items-center justify-between gap-5">
          <div className="my-3 w-full flex justify-end">
            <Button
              onClick={() => {
                window.location.href = `${process.env.PUBLIC_URL}/add-whiteLis-user-sample.xlsx`;
              }}
              variant="outlined"
            >
              دانلود فایل نمونه
            </Button>
          </div>
          <Uploader
            setFiles={(e) => {
              setFiles(e);
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => importCsv()}
            disabled={!files}
          >
            ثبت اطلاعات
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default WhiteListUser;
