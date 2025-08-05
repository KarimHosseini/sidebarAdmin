/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-loop-func */

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { baseUrl, INVOICE } from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import OrderLabelContext from "./labelContext";

const OrderLabel = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [names, setnames] = useState("");
  const [invoices, setInvoices] = useState([]);
  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    var id = "";
    var name = "";
    for (let entry of searchParams.entries()) {
      entry[0].split(",").map((item) => {
        id += `&orderIds=${item}`;
        if (entry[0].split(",").length === 1) {
          name += `,${item} - invoice`;
        } else {
          name += `,${item}`;
        }
      });
    }

    setnames(name.slice(1));
    setLoading(true);
    axiosInstance(`${baseUrl}/${INVOICE}?` + id.slice(1), configReq(token))
      .then((res) => {
        setLoading(false);
        const { data } = res;
        if (data.data.orders[0].tipaxTrackingCode) {
          var temp = [];
          data.data.orders[0].tipaxTrackingCode.split(",").map((item) => {
            temp.push({
              ...data.data.orders[0],
              tipaxTrackingCode: item,
            });
          });
          setInvoices({ ...data.data, orders: temp });
        } else {
          setInvoices(data.data);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="overflow-x-hidden relative flex flex-col justify-center items-center w-full min-h-[100vh]">
      <OrderLabelContext
        orders={invoices?.orders}
        seller={invoices.seller}
        names={names}
      />
    </div>
  );
};

export default OrderLabel;
