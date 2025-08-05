import {
  Alert,
  Button,
  CircularProgress,
  Paper,
  Skeleton,
  Switch,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, PageTitle, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import NoAccess from "../../components/noAccess";
import {
  baseUrl,
  CREATE_SEO,
  GET_SEO,
  GET_TAG_SEO,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const SeoGenrator = () => {
  const { userPermissions } = useSelector((state) => state.relationals);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState({});
  const { token } = useSelector((state) => state.user);
  const { id } = useParams();
  const [loading2, setLoading2] = useState(false);
  const [open, setOpen] = useState(false);
  const [preivew, setPreivew] = useState("");
  const [initData, setInitData] = useState({});

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  useEffect(() => {
    if (searchParams.get("name") && searchParams.get("id")) {
      setLoading(true);
      axiosInstance(
        `${baseUrl}/${GET_SEO}?entityId=${searchParams.get(
          "id"
        )}&entityName=${searchParams.get("name")}`,
        configReq(token)
      )
        .then((res) => {
          setLoading(false);
          var temp = {};
          res?.data.data?.seoEntityTags?.map((item) => {
            temp = { ...temp, [item.SeoTagId]: item.Value };
          });
          setData(temp);
          if (res.data.data) {
            setInitData({ ...res?.data.data });
          } else {
            const url =
              searchParams.get("name") === "product"
                ? `/products/${searchParams.get("id")}/${searchParams.get(
                    "slug"
                  )}`
                : searchParams.get("name") === "category"
                ? `/shop/${searchParams.get("slug")}`
                : searchParams.get("name") === "blog"
                ? `/blog/${searchParams.get("slug")}`
                : `${searchParams.get("slug")}`;
            setInitData({ url: url });
          }
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  }, [searchParams.get("name"), searchParams.get("id")]);
  useEffect(() => {
    setLoading(true);
    axiosInstance(
      `${baseUrl}/${GET_TAG_SEO}?Limit=1000&Page=1`,
      configReq(token)
    )
      .then((res) => {
        setLoading(false);
        setTags(res.data.data);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);
  const sumbitData = () => {
    setLoading2(true);
    const output = {
      SeoEntityTags: Object.entries(data).map(([SeoTagId, Value]) => ({
        SeoTagId: Number(SeoTagId),
        Value: Value,
      })),
    };
    axiosInstance
      .patch(
        `${baseUrl}/${CREATE_SEO}`,
        {
          Id: initData.id || 0,
          NoIndex: Boolean(initData.noIndex),
          EntityId: Number(searchParams.get("id")),
          EntityName: searchParams.get("name"),
          Url: initData.url,
          SeoEntityTags: output.SeoEntityTags,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setLoading2(false);
        toast.success("با موفقیت ثبت شد");
      })
      .catch((err) => {
        setLoading2(false);
      });
  };
  if (!userPermissions?.seo?.view) {
    return <NoAccess />;
  }
  return (
    <div>
      <PageTitle
        broadCrumb={[
          {
            title: "   تنظیمات سایت",
            path: "/companyInfo",
          },
          {
            title: "   تنظیمات SEO",
            path: "/seo",
          },
        ]}
        title={id ? `ویرایشseo صفحه ${data?.url || ""}` : "افزودن SEO  "}
      />{" "}
      <div className="md:mx-3 mx-1">
        {" "}
        <Paper
          sx={{ border: "1px solid #dbdfea", mb: 1, padding: "15px 16px" }}
          elevation={0}
          className="flex flex-col gap-5"
        >
          {loading ? (
            <>
              <Skeleton variant="rectangular" height={200} />
              <Skeleton variant="rectangular" height={600} sx={{ mt: 2 }} />
            </>
          ) : (
            <>
              <Alert variant="filled" severity="info">
                تنها ردیف هایی که مقادیر آن ها پر می شود تگ هاشون ساخته می شود
              </Alert>
              <div className="flex justify-between border-b mb-10 pb-4 items-center">
                <div className="flex gap-2 items-center">
                  <span>ادرس صفحه :‌</span>{" "}
                  <div className="ltr">
                    <span>
                      {" "}
                      <a
                        href={`${process.env.REACT_APP_DOMAIN_URL}${initData.url}`}
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        {" "}
                        {process.env.REACT_APP_DOMAIN_URL}
                        {initData.url}
                      </a>
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-xs">no index: </span>
                    <Switch
                      disabled={!userPermissions?.seoAssign?.patch}
                      onChange={() =>
                        setInitData({
                          ...initData,
                          noIndex: !initData?.noIndex,
                        })
                      }
                      checked={initData?.noIndex}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-6 border-b mb-3 pb-3 gap-4">
                <span className="font-bold">نام</span>
                <span className="font-bold">نوع</span>
                <div className="col-span-3 font-bold">مقدار</div>
                <div></div>
              </div>
              {tags.map((item, index) => (
                <div key={index} className="grid grid-cols-6 gap-4">
                  <span>{item.name}</span>
                  <span>{TYPES.find((it) => it.id === item.type)?.title}</span>
                  <div className="col-span-3">
                    <TextInput
                      disabled={!userPermissions?.seoAssign?.patch}
                      change={(e) => {
                        setData({ ...data, [item.id]: e });
                      }}
                      currentValue={data[item.id]}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      if (item.type === 1) {
                        setPreivew(`<title>${data[item.id]}</title>`);
                      } else if (item.type === 2) {
                        setPreivew(
                          `<meta name="${item.name}" content=${
                            data[item.id]
                          } />`
                        );
                      } else {
                        setPreivew(
                          `<link rel="${item.name}" href="${data[item.id]}">`
                        );
                      }
                      setOpen(true);
                    }}
                    disabled={!data[item.id]}
                    variant="outlined"
                  >
                    نمایش تگ ساخته شده
                  </Button>
                </div>
              ))}
              {userPermissions?.seoAssign?.patch && (
                <div className="flex w-full justify-end">
                  <Button
                    sx={{ width: { md: "200px" } }}
                    disabled={loading2}
                    variant="contained"
                    onClick={sumbitData}
                  >
                    {" "}
                    {loading2 ? <CircularProgress /> : <>ثبت اطلاعات</>}
                  </Button>
                </div>
              )}
            </>
          )}
        </Paper>
      </div>
      <Modal
        open={open}
        close={() => setOpen(false)}
        title={`   نمایش تگ ساخته شده`}
      >
        <div className="ltr">
          <span> {preivew}</span>
        </div>
      </Modal>
    </div>
  );
};

export default SeoGenrator;
const TYPES = [
  {
    id: 1,
    title: "title tag",
  },
  {
    id: 2,
    title: "meta tag",
  },
  {
    id: 3,
    title: "link tag",
  },
];
