/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import CustomePage from "../../components/customePage";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  EXPORT_AGENT_TURNOVER_SINGLE,
  GET_AGENT_TURNOVER_SINGLE,
  GET_CHILD_FACILITIES,
  SINGLE_USER,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import WalletAgentModal from "../reportAgentTurnover/modal";

const SingleLoanAgentTurnover = () => {
  const [searchParams] = useSearchParams();
  const { userPermissions } = useSelector((state) => state.relationals);
  const { token } = useSelector((state) => state.user);
  const { id } = useParams();
  
  const [editingData, setEditingData] = useState({});
  const [selected, setSelected] = useState([]);
  const [refreshData, setRefresh] = useState(0);
  const [userData, setUserData] = useState();
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [facility, setFacility] = useState([]);
  const [type, setType] = useState(0);

  // بارگذاری اطلاعات کاربر
  useEffect(() => {
    if (id) {
      axiosInstance(`${baseUrl}/${SINGLE_USER}?id=${id}`, configReq(token))
        .then((res) => {
          const { data } = res;
          if (data && data.code === 200 && data.data) {
            setUserData(data.data);
          }
        })
        .catch((err) => {});
    }
  }, [id]);

  // بارگذاری تسهیلات
  useEffect(() => {
    axiosInstance
      .get(`${baseUrl}/${GET_CHILD_FACILITIES}`, configReq(token))
      .then((res) => {
        var temp = [];
        res.data.data
          .filter((item) => item.children?.length > 0)
          .map((item) => {
            temp.push({
              title: `↓ - ${item.title} - ↓ `,
              id: -1,
              disabled: true,
            });
            item.children.map((ch) => {
              temp.push({ title: ch.title, id: ch.id });
            });
            temp.push({
              title: "ـــــــــــــــــــــــــــــ",
              id: -2,
              disabled: true,
            });
          });
        setFacility(temp);
      });
  }, []);

  // محاسبه مجموع انتخاب‌ها
  useEffect(() => {
    var temp = 0;
    selected.map((item) => (temp += item.finalAmount));
    setSelectedPrice(temp);
  }, [selected]);

  // تعریف APIها برای CustomePage
  const apis = {
    GET_DATA: GET_AGENT_TURNOVER_SINGLE,
    EXPORT_DATA: EXPORT_AGENT_TURNOVER_SINGLE,
  };

  // دکمه‌های اضافی
  const extraButtons = (
    <>
      {userPermissions?.reportAgentTurnoverSingleUser?.view && (
        <>
          <Button
            onClick={() => {
              setType(0);
              setOpenModal(true);
            }}
            variant="contained"
            color="secondary"
          >
            تنخواه واریزی
          </Button>
          <Button
            onClick={() => {
              setType(1);
              setOpenModal(true);
            }}
            variant="contained"
          >
            اضافه کاری
          </Button>
          <Button
            onClick={() => {
              setType(2);
              setOpenModal(true);
            }}
            variant="outlined"
          >
            تنخواه
          </Button>
        </>
      )}
    </>
  );

  // عملیات‌های اضافی برای ردیف‌ها
  const extraActions = searchParams.get("type") !== "1"
    ? [
        {
          title: "جزئیات",
          handler: (
            <Button
              onClick={() => {
                window.open(
                  `/UserLoanRequest/${editingData?.requestId}?RT=3`
                );
              }}
              variant="outlined"
            >
              مشاهده
            </Button>
          ),
        },
      ]
    : [];

  // نمایش اطلاعات اضافی
  const extraDetails = (extraObject) => {
    if (!extraObject) return null;
    
    return (
      <div className="flex gap-7 flex-wrap items-center justify-between w-full">
        <fieldset className="flex gap-3 items-center border rounded-md px-3 py-2 flex-wrap">
          <legend className="text-center mx-2 px-2 text-sm font-bold">
            گزارش
          </legend>
          {selected?.length > 0 && (
            <span className="flex gap-2 items-center mb-3">
              <span>جمع انتخاب شده</span>
              <span className="font-bold">
                {Number(selectedPrice).toLocaleString()}
              </span>
            </span>
          )}
          {(extraObject?.creditSum || extraObject?.creditSum === 0) && (
            <>
              <span className="flex gap-2 items-center mb-3">
                <span>جمع کل اعتبار</span>
                <span className="font-bold">
                  {Number(extraObject.creditSum).toLocaleString()}
                </span>
              </span>
              <span className="flex gap-2 border-r px-3 border-l items-center mb-3">
                <span>جمع تصفیه</span>
                <span className="font-bold">
                  {Number(
                    extraObject.commissionSum -
                      extraObject.overTimeSum -
                      extraObject.totalDepositPrice
                  ).toLocaleString()}
                </span>
              </span>
            </>
          )}
          {(extraObject?.commissionSum || extraObject?.commissionSum === 0) && (
            <span className="flex gap-2 items-center mb-3">
              <span>جمع کل کمیسیون نماینده</span>
              <span className="font-bold">
                {Number(extraObject.commissionSum).toLocaleString()}
              </span>
            </span>
          )}
          {extraObject?.overTimeSum > 0 && (
            <span className="flex gap-2 items-center mb-3">
              <span>جمع کل اضافه کاری نماینده</span>
              <span className="font-bold">
                {Number(extraObject.overTimeSum).toLocaleString()}
              </span>
            </span>
          )}
          {extraObject?.totalDepositPrice > 0 && (
            <span className="flex gap-2 items-center mb-3">
              <span>جمع کل تنخواه نماینده</span>
              <span className="font-bold">
                {Number(extraObject.totalDepositPrice).toLocaleString()}
              </span>
            </span>
          )}
        </fieldset>
      </div>
    );
  };

  // پارامترهای اضافی
  const extraParams = {
    agentId: id
  };

  const userTitle = userData?.userInformation
    ? `${userData.userInformation.name} ${userData.userInformation.family} - ${userData.mobile}`
    : "";

  return (
    <>
      <CustomePage
        apis={apis}
        title={`گزارش اعتبار نماینده ${userTitle}`}
        canAdd={false}
        canEdit={false}
        permissionsTag="reportAgentTurnoverSingleUser"
        broadCrumb={[
          {
            title: "گزارشات",
            path: "/reports",
          },
        ]}
        extraButtons={extraButtons}
        extraActions={extraActions}
        currentRow={(data) => {
          setEditingData(data);
        }}
        extraParams={extraParams}
        extraDetails={extraDetails}
        defaultSelected={selected}
        onDataChange={(allData) => {
          // برای مدیریت انتخاب‌ها
        }}
        key={refreshData}
      />

      <WalletAgentModal
        open={openModal}
        close={() => setOpenModal(false)}
        agentId={id}
        type={type}
        facility={facility}
        reload={() => setRefresh((r) => r + 1)}
      />
    </>
  );
};

export default SingleLoanAgentTurnover;

// تسک 1: صفحه reportAgentSingle به CustomePage تبدیل شد (گزارش با عملیات خاص) ✓
