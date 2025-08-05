/* eslint-disable no-loop-func */

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { baseUrl, INVOICE } from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import InvoicesContent from "./context";

const Invoices = () => {
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
        var temp = [];
        res.data.data.orders.map((item) => {
          var temp2 = [];
          item.details.map((it) => {
            temp2.push(it);
            if (it.insurance) {
              const ins = JSON.parse(it.insurance);
              temp2.push({
                basePrice: ins.basePric * 10 || 0,
                description: ins.description,
                discount: ins.discount * 10,
                vat: it.insuranceVat * 10,
                final: (ins.priceWithDiscount * 10 || 0) + it.insuranceVat * 10,
                itemsPrice: ins.qty * ins.price * 10 || 0,
                price: ins.price * 10 || 0,
                qty: ins.qty || 0,
                total: ins.priceWithDiscount * 10 || 0,
                productProperty: {
                  title: ins.title,
                  code: ins.code,
                  arrtib1: {
                    title: it.productProperty.title,
                  },
                },
              });
            } else if (it.services) {
              it.services.map((service) => {
                temp2.push({
                  ...service,
                  productProperty: {
                    title: service.title,
                    code: service.productProperty?.code,
                
                  },
                });
              });
            }
          });
          temp.push({ ...item, details: temp2 });
        });
        setInvoices({ seller: res.data.data.seller, orders: temp });
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="overflow-x-auto">
      {" "}
      <div className="min-w-[1200px]">
        <InvoicesContent
          orders={invoices?.orders}
          seller={invoices.seller}
          names={names}
        />
      </div>
    </div>
  );
};

export default Invoices;
