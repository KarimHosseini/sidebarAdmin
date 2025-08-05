import Editor, { loader } from "@monaco-editor/react";
import { Button, CircularProgress, Paper, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { PageTitle } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import NoAccess from "../../components/noAccess";
import {
  baseUrl,
  EDIT_CUSTOMER_CSS,
  GET_CUSTOMER_CSS,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const CustomeStyle = () => {
  const [style, setStyle] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.user);
  const [loadingButton, setLoadingButton] = useState(false);
  const { userPermissions } = useSelector((state) => state.relationals);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(
        `${baseUrl}/${GET_CUSTOMER_CSS}`,

        configReq(token)
      )
      .then((res) => {
        setStyle(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
      });
  }, []);

  useEffect(() => {
    loader.config({
      paths: {
        vs:
          process.env.REACT_APP_MONACO_PATH ||
          "https://unpkg.com/monaco-editor@0.34.0/min/vs",
      },
    });
  }, []);

  const handleSave = () => {
    setLoadingButton(true);
    axiosInstance
      .put(
        `${baseUrl}/${EDIT_CUSTOMER_CSS}`,
        {
          cssContent: style,
        },
        configReq(token)
      )
      .then((res) => {
        toast.success("با موفقیت افزوده شد");
        setLoadingButton(false);
      })
      .catch((err) => {
        setLoadingButton(false);
        toast.error(err.response?.data?.message);
      });
  };
  if (!userPermissions?.customeCss?.view) {
    return <NoAccess />;
  }
  return (
    <>
      <PageTitle
        broadCrumb={[
          {
            title: "   تنظیمات",
            path: "/companyInfo",
          },
        ]}
        title="سی اس اس های سفارشی"
      />
      <div className="md:mx-3 mx-1">
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1 }}
          className="p-2"
          elevation={0}
        >
          {loading ? (
            <Skeleton
              height={500}
              width={"100%"}
              animation={"wave"}
              variant="rounded"
            />
          ) : (
            <div className="ltrForEditor">
              <Editor
                height="700px"
                defaultLanguage="css"
                className="ltrFor w-full"
                defaultValue={`/* Write your css code here */


`}
                value={style}
                onChange={setStyle}
                theme="vs-dark"
                options={{
                  minimap: { enabled: true },
                  automaticLayout: true,
                  tabSize: 2,
                  fontSize: 14,
                  lineNumbers: "on",
                  wordWrap: "on",
                }}
              />
            </div>
          )}
          {!userPermissions?.customeCss?.edit && (
            <div className="flex mt-10 justify-end items-center">
              <Button
                disabled={loadingButton}
                onClick={handleSave}
                variant="contained"
                color="primary"
              >
                {loadingButton ? <CircularProgress /> : " ثبت اطلاعات"}
              </Button>
            </div>
          )}
        </Paper>
      </div>
    </>
  );
};

export default CustomeStyle;
