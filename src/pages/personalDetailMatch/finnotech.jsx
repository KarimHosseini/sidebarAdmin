import { Button, CircularProgress, Switch } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  CHANGE_FINNO_TECH_FOR_FRONT,
  CHANGE_FINNO_TECH_FOR_USER,
  CHANGE_FINNOTECH_ACTIVE,
  CHANGE_FINNOTECH_ACTIVE_USER,
  GET_FINNOTECH_COMPANYINFO,
  VERIFY_FINNOTECH,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const Finnotech = ({
  isActive,
  setIsActive,
  isActive2,
  setIsActive2,
  isFinnoTechAliveForUser,
  setIsFinnoTechAliveForUser,
  setIsFinnoTechAlive,
  isFinnoTechAlive,
}) => {
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({});
  const [loading3, setLoading3] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loadingActive, setLoadingActive] = useState(false);
  const [data, setData] = useState({});
  const [loadingActive2, setLoadingActive2] = useState(false);
  const validateFinnotech = () => {
    setLoading3(true);
    axiosInstance(
      `${baseUrl}/${GET_FINNOTECH_COMPANYINFO}?companyId=${userData?.nationalId}`,
      configReq(token)
    )
      .then((res) => {
        setLoading3(false);
        setChecked(true);
        setUserData({
          ...userData,
          companyName: res.data.data.title,
          tel: res.data.data.tel,
          economicCode: res.data.data.taxNumber,
          regNumber: res.data.data.registrationNo,

          addressFin: res.data.data.address,
        });
      })
      .catch((err) => {
        setLoading3(false);
        toast.error(err.response?.data);
      });
  };

  const handleChangeStatus = () => {
    setLoading2(true);
    axiosInstance
      .patch(`${baseUrl}/${CHANGE_FINNOTECH_ACTIVE}`, {}, configReq(token))
      .then((res) => {
        if (isFinnoTechAlive) {
          setIsFinnoTechAliveForUser(false);
        }
        toast.success("با موفقیت ویرایش شد");
        setIsFinnoTechAlive(!isFinnoTechAlive);
        setLoading2(false);
      })
      .catch((err) => {
        setLoading2(false);
      });
  };

  const handleChangeStatus2 = () => {
    setLoading3(true);
    axiosInstance
      .patch(`${baseUrl}/${CHANGE_FINNOTECH_ACTIVE_USER}`, {}, configReq(token))
      .then((res) => {
        toast.success("با موفقیت ویرایش شد");
        setIsFinnoTechAliveForUser(!isFinnoTechAliveForUser);
        setLoading3(false);
      })
      .catch((err) => {
        setLoading3(false);
      });
  };
  const handleToggle = () => {
    setLoadingActive(true);

    axiosInstance
      .patch(`${baseUrl}/${CHANGE_FINNO_TECH_FOR_USER}`, {}, configReq(token))
      .then((res) => {
        setLoadingActive(false);
        if (isActive) {
          setIsActive2(false);
        }
        setIsActive(!isActive);
        toast.success("با موفقیت ویرایش شد");
      })
      .catch((err) => {
        setLoadingActive(false);

        toast.error(err.response?.data?.message);
      });
  };
  const handleToggle2 = () => {
    setLoadingActive2(true);

    axiosInstance
      .patch(`${baseUrl}/${CHANGE_FINNO_TECH_FOR_FRONT}`, {}, configReq(token))
      .then((res) => {
        setLoadingActive2(false);

        setIsActive2(!isActive2);
        toast.success("با موفقیت ویرایش شد");
      })
      .catch((err) => {
        setLoadingActive2(false);

        toast.error(err.response?.data?.message);
      });
  };
  const handleSave = () => {
    setLoading(true);

    axiosInstance
      .get(
        `${baseUrl}/${VERIFY_FINNOTECH}?nationalId=${data.nationalId}&mobile=${data.mobile}`,
        configReq(token)
      )
      .then((res) => {
        setLoading(false);
        if (res.data.data) {
          toast.success("  احراز هویت صحیح می باشد. ");
        } else {
          toast.error("  احراز هویت دارای مغایرت می باشد.");
        }
      })
      .catch((err) => {
        setLoading(false);

        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
        }
      });
  };

  return (
    <div>
      <div className="font-bold">- اعتبار سنجی شرکتی</div>
      <div className="grid md:grid-cols-4 gap-4">
        {isFinnoTechAlive && (
          <>
            <TextInput
              label=" شناسه ملی "
              currentValue={userData?.nationalId || ""}
              disabled={userData?.isLegal === false}
              change={(e) => setUserData({ ...userData, nationalId: e })}
            />
            <Button
              disabled={
                !userData?.nationalId ||
                userData?.nationalId.length < 10 ||
                loading3
              }
              variant="contained"
              onClick={validateFinnotech}
            >
              {loading3 ? <CircularProgress /> : " استعلام"}
            </Button>
          </>
        )}
        <div className="flex gap-3 items-center">
          <span>
            {!isFinnoTechAlive ? " اعتبار سنجی کلی غیرفعال   " : " سرویس فعال "}
          </span>
          <Switch
            checked={isFinnoTechAlive}
            onClick={handleChangeStatus}
            disabled={loading2}
          />
        </div>
        <div className="flex gap-3 items-center">
          <span>
            {!isFinnoTechAliveForUser
              ? " سرویس فرانت غیرفعال   "
              : " سرویس فرانت فعال "}
          </span>
          <Switch
            checked={isFinnoTechAliveForUser}
            onClick={handleChangeStatus2}
            disabled={loading3 || isFinnoTechAlive === false}
          />
        </div>
        <div className="md:col-span-2"></div>
        {checked && (
          <>
            <TextInput
              label="نام شرکت "
              currentValue={userData?.companyName || ""}
              disabled={true}
            />
            <TextInput
              label=" تلفن "
              currentValue={userData?.tel || ""}
              disabled={true}
            />
            <TextInput
              label="کد اقتصادی"
              currentValue={userData?.economicCode || userData?.economicCode}
              disabled={true}
            />
            <TextInput
              label="شناسه ثبت"
              currentValue={userData?.regNumber || userData?.regNumber}
              disabled={true}
            />
            <div className="col-span-5">
              <TextInput
                label=" نشانی"
                currentValue={userData?.addressFin || ""}
                disabled={true}
              />
            </div>
          </>
        )}
      </div>
      <div className="font-bold mt-5"> - اعتبار سنجی موبایل با شماره ملی</div>
      <div className="flex gap-3 items-center mt-4">
        {isActive && (
          <>
            {" "}
            <TextInput
              label=" کد ملی"
              change={(e) => setData({ ...data, nationalId: e })}
              currentValue={data.nationalId}
            />
            <TextInput
              label=" شماره همراه"
              change={(e) => setData({ ...data, mobile: e })}
              currentValue={data.mobile}
            />
            <Button
              disabled={loading}
              size="large"
              onClick={handleSave}
              variant="contained"
              color="primary"
            >
              {loading ? <CircularProgress /> : <> ثبت اطلاعات</>}
            </Button>
          </>
        )}
        <div className="flex gap-3 items-center">
          <span>
            {" "}
            {!isActive
              ? " اعتبار سنجی کلی غیرفعال   "
              : " اعتبار سنجی کلی فعال "}
          </span>
          <Switch
            checked={isActive}
            onClick={handleToggle}
            disabled={loadingActive}
          />
        </div>
        <div className="flex gap-3 items-center">
          <span>
            {" "}
            {!isActive2
              ? " اعتبار سنجی پنل کاربر غیرفعال   "
              : " اعتبار سنجی پنل کاربر فعال "}
          </span>
          <Switch
            checked={isActive2}
            onClick={handleToggle2}
            disabled={loadingActive2 || isActive === false}
          />
        </div>
      </div>
    </div>
  );
};

export default Finnotech;
