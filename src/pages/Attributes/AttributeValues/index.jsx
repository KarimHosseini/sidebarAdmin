/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { PageTitle } from "../../../components/common";
import axiosInstance from "../../../components/dataFetch/axiosInstance";
import { baseUrl, ONE_ATTRIBUTE } from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";
import { logout } from "../../../redux/slices/user";
import CreateAttrValue from "./create";
import EditAttributeValues from "./edit";
import AttributeValuesTable from "./table";

const AttributeValues = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  // modals
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingData, setEditingData] = useState({});

  useEffect(() => {
    if (!openCreate && !openEdit) {
      setLoading(true);
      axiosInstance(`${baseUrl}/${ONE_ATTRIBUTE}?id=${id}`, configReq(token))
        .then((res) => {
          const { data } = res;
          setLoading(false);
          setData(data.data);
        })
        .catch((err) => {
          setLoading(false);
          if (err.response.status === 401) {
            dispatch(logout());
          }
        });
    }
  }, []);
  return (
    <>
      <PageTitle
        title={`جدول ${data.title}`}
        broadCrumb={[
          {
            title: "محصولات",
            path: "/products",
          },
          {
            title: "ویژگی ها",
            path: "/products/attributes",
          },
        ]}
      />
      <div className="md:mx-3 mx-1">
        <Link to="/attributes">
          {" "}
          <div className="flex justify-end mb-3">
            <Button variant="outlined">بازگشت</Button>
          </div>
        </Link>

        <AttributeValuesTable
          data={data}
          editItem={(data) => {
            setEditingData(data);
            setOpenEdit(true);
          }}
          loading={loading}
          total={data?.values?.length || 0}
          handleClicked={() => {
            setOpenCreate(true);
          }}
        />
        {/* modals */}
        <CreateAttrValue
          title={data.title}
          open={openCreate}
          close={() => setOpenCreate(false)}
          type={data.type}
          allData={data}
          setALlData={setData}
        />
        <EditAttributeValues
          type={data.type}
          propsData={editingData}
          open={openEdit}
          close={() => setOpenEdit(false)}
          allData={data}
          setALlData={setData}
        />
      </div>
    </>
  );
};

export default AttributeValues;
