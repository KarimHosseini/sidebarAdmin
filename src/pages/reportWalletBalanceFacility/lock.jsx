import { Button, CircularProgress, Switch } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  AddFacilityWalletLockHistories,
  baseUrl,
  GetFacilityWalletLockHistories,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
const Lock = ({ data, open, close, reload }) => {
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [allData, setAllData] = useState([]);
  const { token, userId } = useSelector((state) => state.user);

  useEffect(() => {
    if (data.id && open) {
      setLoading(true);
      axiosInstance
        .get(
          `${baseUrl}/${GetFacilityWalletLockHistories}?userId=${data.id}`,
          configReq(token)
        )
        .then((res) => {
          setLoading(false);

          setAllData(res.data.data);
        })
        .catch((err) => {
          setLoading(true);
        });
    }
  }, [data, open]);

  const handleChange = (item) => {
    const temp = [...allData];
    const index = temp.findIndex((it) => it.facilityId === item.facilityId);
    temp[index] = { ...temp[index], isLock: !item.isLock };
    setAllData(temp);
  };
  const lockAll = () => {
    var temp = [];

    allData.map((it) => {
      temp.push({
        ...it,
        isLock: true,
      });
    });

    setAllData(temp);
  };
  const sumbitAll = () => {
    setLoading2(true);
    var temp = [];
    allData.map((item) => {
      temp.push({
        UserId: data.id,
        FacilityId: item.facilityId,
        isLock: item.isLock,
      });
    });
    var AddFacilityLockItemModels = { AddFacilityLockItemModels: temp };
    axiosInstance
      .post(
        `${baseUrl}/${AddFacilityWalletLockHistories}`,
        { model: JSON.stringify(AddFacilityLockItemModels) },
        configReq(token)
      )
      .then((res) => {
        toast.success("با موفقیت ثبت شد");
        setLoading2(false);
        close();
        reload();
      })
      .catch((err) => {
        setLoading2(false);
      });
  };
  return (
    <>
      {" "}
      <Modal
        open={open}
        close={() => {
          close();
        }}
        title={`  قفل کیف پول ${data.fullName}`}
      >
        {" "}
        <Button size="small" onClick={lockAll} variant="outlined">
          قفل همه
        </Button>
        {loading ? (
          <div className="flex justify-center items-center h-[200px] w-full">
            <CircularProgress />
          </div>
        ) : (
          <div className="grid md:grid-cols-1 ">
            {allData.map((it) => (
              <div
                className="grid grid-cols-4 gap-4 w-full"
                onClick={() => handleChange(it)}
                key={it.facilityId}
              >
                <span className="text-sm col-span-2">{it.facilityName}</span>{" "}
                <span className="text-sm mx-4 font-bold">
                  {it.amount?.toLocaleString()} تومان
                </span>{" "}
                <Switch checked={Boolean(it.isLock)} />
              </div>
            ))}
          </div>
        )}
        <Button size="small" onClick={sumbitAll} variant="contained">
          ثبت اطلاعات
        </Button>
      </Modal>
    </>
  );
};

export default Lock;
