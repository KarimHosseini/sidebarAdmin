import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { baseUrl, GET_PREINVOICE_SINGLE } from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const PreInvoiceDetails = () => {
  const { token } = useSelector((state) => state.user);
  const { id } = useParams();
  const [allInvoice, setAllInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axiosInstance(
      `${baseUrl}/${GET_PREINVOICE_SINGLE}?preFactorId=${id}`,
      configReq(token)
    )
      .then((res) => {
        setAllInvoices(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [token]);
  return <div>PreInvoiceDetails</div>;
};

export default PreInvoiceDetails;
