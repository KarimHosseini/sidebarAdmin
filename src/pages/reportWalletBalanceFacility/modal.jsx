import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  baseUrl,
  GetFacilityUserWalletLockHistories,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
const HistoryReport = ({ data, open, close }) => {
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState([]);
  const { token, userId } = useSelector((state) => state.user);

  useEffect(() => {
    if (data.id && open) {
      setLoading(true);
      axiosInstance
        .get(
          `${baseUrl}/${GetFacilityUserWalletLockHistories}?userId=${data.id}`,
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
  return (
    <>
      {" "}
      <Modal
        open={open}
        close={() => {
          close();
        }}
        title={` تاریخچه قفل کیف پول ${data.fullName}`}
      >
        <div className="overflow-auto">
          {loading ? (
            <Skeleton width={400} height={400} />
          ) : (
            <Table sx={{ minWidth: 400, mt: 3 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  {[
                    "ردیف ",

                    "نام ویرایش کننده ",
                    " تاریخ ویرایش",
                    " ویرایش سیستمی",
                    "  اعتبار بر خط",
                    /*   " سر رسید شده",
                    "", */
                  ].map((item) => (
                    <TableCell key={item}>{item}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {allData?.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.Id}</TableCell>
                    <TableCell>{item.EditorFullName}</TableCell>
                    <TableCell>
                      {item.DateTime &&
                        new Date(item.DateTime).toLocaleDateString("fa-IR")}
                    </TableCell>

                    <TableCell>{item.BySystem ? "بله" : "خیر"}</TableCell>
                    <TableCell>
                      {item.CurrentAmount?.toLocaleString()}
                    </TableCell>

                    {/*     <TableCell></TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Modal>
    </>
  );
};

export default HistoryReport;
