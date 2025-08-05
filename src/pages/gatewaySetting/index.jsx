import { Button, CircularProgress, Paper, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { PageTitle } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import NoAccess from "../../components/noAccess";
import {
  ALL_GATEWAY_DEFUALT_SETTING,
  ALL_SHIPPING_COMPANIES,
  baseUrl,
  DELETE_SETTINGS_GAETWAYT,
  GET_GATEWAY_TYPES,
  GET_GATEWAYS_ENUM,
  GET_SETTINGS_GAETWAYT,
  ORDER_TYPE,
  UPDATE_SETTINGS_GAETWAYT,
} from "../../helpers/api-routes";
import { capitalizeKeysItems, configReq } from "../../helpers/functions";
import GateWayItem from "./item";

const GateWaySetting = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [headerOption, serHeaderOption] = useState([]);
  const { token } = useSelector((state) => state.user);
  const [types, setTypes] = useState([]);
  const [getWays, setGateWays] = useState([]);
  const [shippings, setShippings] = useState([]);
  const [orderStates, setorderStates] = useState([]);
  const [defualtGateWays, setdDefualtGateWays] = useState([]);

  useEffect(() => {
    setLoading(true);
    axiosInstance(`${baseUrl}/${GET_SETTINGS_GAETWAYT}`, configReq(token))
      .then((res) => {
        var temp = [];
        res.data.data.map((item) => {
          temp.push({ ...item, gateWayType: item.gateWayTypeId });
        });
        serHeaderOption(res.data.header[0]?.enums);
        setAllData(temp);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
        }
        setLoading(false);
      });
    axiosInstance(`${baseUrl}/${GET_GATEWAY_TYPES}`, configReq(token)).then(
      (res) => {
        var temp = [];
        res.data.data.map((item) => {
          temp.push({ id: item.id, title: item.persianTitle });
        });
        setTypes(temp);
      }
    );
    axiosInstance(
      `${baseUrl}/${ALL_SHIPPING_COMPANIES}`,
      configReq(token)
    ).then((res) => {
      setShippings(res.data.data);
    });
    axiosInstance(
      `${baseUrl}/${ALL_GATEWAY_DEFUALT_SETTING}`,
      configReq(token)
    ).then((res) => {
      setdDefualtGateWays(res.data.data);
    });
    axiosInstance(`${baseUrl}/${ORDER_TYPE}`, configReq(token)).then((res) => {

      setorderStates(res.data.data.enums);
    });
    axiosInstance
      .get(
        `${baseUrl}/${GET_GATEWAYS_ENUM}?Page=1&Limit=10000&showBasicGateWay=true`,

        configReq(token)
      )
      .then((res) => {
        var temp = [...res.data.data];
        temp.push({ title: "کیف پول سایت", id: 2 });
        temp.push({ title: "کیف پول تسهیلاتی", id: 18 });

        setGateWays(temp);
      })
      .catch((err) => {});
  }, []);
  const handleSave = () => {
    setLoadingSave(false);
    axiosInstance
      .patch(
        `${baseUrl}/${UPDATE_SETTINGS_GAETWAYT}`,
        {
          GatewaySettingModels: capitalizeKeysItems(allData),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setAllData(res.data.data);
        setLoadingSave(false);
        toast.success("با موفقیت ثبت شد");
      })
      .catch((err) => {
        setLoadingSave(false);
      });
  };
  const handleDelete = (id) => {
    setLoadingSave(false);
    axiosInstance
      .delete(
        `${baseUrl}/${DELETE_SETTINGS_GAETWAYT}?id=${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setAllData(res.data.data);

        setLoadingSave(false);
        toast.success("با موفقیت ثبت شد");
      })
      .catch((err) => {
        setLoadingSave(false);
      });
  };
  if (!userPermissions?.gatewaySetting?.view) {
    return <NoAccess />;
  }
  return (
    <div>
      <PageTitle
        broadCrumb={[
          {
            title: "   تنظیمات",
            path: "/companyInfo",
          },
        ]}
        title="  تنظیمات درگاه "
      />
      <div className="md:mx-3 mx-1">
        <Paper sx={{ border: "1px solid #dbdfea", mb: 1 }} elevation={0}>
          {loading ? (
            <>
              <Skeleton width={"100%"} height={60} />
              <Skeleton width={"100%"} height={60} />

              <Skeleton width={"100%"} height={60} />
            </>
          ) : (
            <div className="flex overflow-x-auto flex-col gap-3">
              <div className="min-w-[1200px]">
                <div
                  style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}
                  className="grid  gap-4 py-3 px-7 border-b mb-4 pb-4"
                >
                  <span className="font-bold">عکس درگاه</span>
                  <span className="font-bold">نام درگاه</span>
                  <span className="font-bold">فعال / غیر فعال</span>
                  <span className="font-bold"> ترکیب با کیف پول سایت </span>
                  <p className="font-bold text-center"> شارژ کیف پول </p>
                  <p className="font-bold text-center">انتخاب پیش فرض </p>
                  <p className="font-bold text-center">
                    انتخاب پیش فرض شارژ کیف پول
                  </p>
                  {/*      <p className="font-bold text-center">لاگ موفق </p>
        <p className="font-bold text-center">لاگ خطا </p> */}
                  {/*         <p className="font-bold text-center"> ویجیت شارژ کیف پول </p>
                   */}{" "}
                  <p className="font-bold text-center"> درگاه</p>
                  <p className="font-bold text-center"> نوع درگاه</p>
                  <p className="font-bold text-center"> زمان رزرو (به ثانیه)</p>
                  <p className="font-bold text-center"> مدل ابطال</p>{" "}
                  <p className="font-bold text-center"> دارای ارزش افزوده</p>
                  <p className="font-bold text-center"> درصد ارزش افزوده</p>
                  <p className="font-bold text-center"> لاگ ها</p>
                  <p className="font-bold text-center">ویرایش عکس یا حذف</p>
                </div>
                {allData.map((item, index) => (
                  <div className="border-b mb-3 px-4 pb-3" key={index}>
                    <GateWayItem
                      hasDeleted={() => {}}
                      shippings={shippings}
                      orderStates={orderStates}
                      defualtGateWay={
                        defualtGateWays.find(
                          (it) => it.gatewaySettingId === item.id
                        ) || { gatewaySettingId: item.id }
                      }
                      defualtGateWays={defualtGateWays}
                      setdDefualtGateWays={setdDefualtGateWays}
                      data={item}
                      setData={(e) => {
                        var temp = [...allData];
                        temp[index] = e;
                        setAllData(temp);
                      }}
                      chageDefualt={() => {
                        var temp = [...allData];
                        temp = temp.map((it) => ({ ...it, isDefault: false }));
                        temp[index] = { ...temp[index], isDefault: true };

                        setAllData(temp);
                      }}
                      chageDefualtForCharge={() => {
                        var temp = [...allData];
                        temp = temp.map((it) => ({
                          ...it,
                          isDefaultForCharge: false,
                        }));
                        temp[index] = {
                          ...temp[index],
                          isDefaultForCharge: true,
                        };

                        setAllData(temp);
                      }}
                      headerOption={headerOption}
                      editMode
                      getWays={getWays}
                      types={types}
                      deleteAttr={() => {
                        handleDelete(item.id);
                      }}
                    />
                  </div>
                ))}
                {userPermissions?.gatewaySetting?.patch && (
                  <div className="flex justify-center gap-3 mb-5">
                    <Button
                      onClick={() => {
                        var temp = [...allData];
                        temp.push({ id: 0 });
                        setAllData(temp);
                      }}
                      variant="outlined"
                      disabled={loadingSave || loading}
                      color="success"
                    >
                      افزودن درگاه جدید
                    </Button>
                    <Button
                      disabled={
                        allData.find(
                          (item) =>
                            item.title === undefined || item.enum === undefined
                        ) || loadingSave
                      }
                      variant="contained"
                      onClick={() => {
                        handleSave();
                      }}
                    >
                      {loadingSave ? <CircularProgress /> : <> ذخیره اطلاعات</>}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </Paper>
      </div>
    </div>
  );
};

export default GateWaySetting;
