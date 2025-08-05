import { Button, Radio, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import {
  ADD_FORCE_INSURANCE,
  baseUrl,
  GET_CATEGORY_INSURANCE,
  GetSavedForceInsurancesAndRelatedCategoriesByParentId,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";

const InsuranceModal = ({
  open,
  close,
  prevData = {},
  categroies,
  reset,
  allRows,
  GATES,
}) => {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const [selected, setSelected] = useState({});
  const { token } = useSelector((state) => state.user);
  useEffect(() => {
    if (open === false) {
      setSelected({});
    }
  }, [open]);
  useEffect(() => {
    if (prevData.categoryIds?.length > 0) {
      setLoading(true);

      const fetchAllProducts = async () => {
        const productData = await Promise.all(
          prevData.categoryIds.map(getProducts)
        );
        setCategory(productData.filter((product) => product !== null));
        setLoading(false);
      };
      fetchAllProducts();
    }
    setLoading3(true);
    axiosInstance
      .post(
        `${baseUrl}/${GetSavedForceInsurancesAndRelatedCategoriesByParentId}`,
        {
          parentId: prevData.id,
        },
        configReq(token)
      )
      .then((res) => {
        var temp = {};
        res.data.data.map((item) => {
          temp = { ...temp, [item.categoryId]: item.insurance.insuranceId };
        });
        setSelected(temp);
        setLoading3(false);
      })
      .catch((err) => {
        setLoading3(false);
        toast.error(err.response?.data?.message);
      });
  }, [prevData]);
  const getProducts = async (item) => {
    const { data } = await axiosInstance.get(
      `${baseUrl}/${GET_CATEGORY_INSURANCE}?Page=1&Limit=10000&categoryId=${item}`,
      configReq(token)
    );
    return {
      insurance: [...data.data],

      categoryId: item,
      categoryName: categroies.find((it) => it.id === item)?.title,
    };
  };

  const handleSave = () => {
    setLoading2(true);
    const temp = [];
    for (var prop in selected) {
      if (selected[prop]) {
        temp.push({ InsuranceId: selected[prop], CategoryId: prop });
      }
    }
    axiosInstance
      .post(
        `${baseUrl}/${ADD_FORCE_INSURANCE}`,
        {
          parentId: prevData.id,
          request: JSON.stringify(temp),
        },
        configReq(token)
      )
      .then((res) => {
        setLoading2(false);
        toast.success("با موفقیت ویرایش شد");
        reset();
        close();
      })
      .catch((err) => {
        setLoading2(false);
        toast.error(err.response?.data?.message);
      });
  };
  return (
    <Modal
      open={open}
      close={() => {
        close();
      }}
      title={`ویرایش خدمات اجباری`}
    >
      {loading ? (
        <div className="flex flex-col gap-2 px-3">
          <Skeleton height={50} variant="rounded" width={"100%"} />
          <Skeleton height={50} variant="rounded" width={"100%"} />
          <Skeleton height={50} variant="rounded" width={"100%"} />
        </div>
      ) : (
        <>
          {category.map((item) => (
            <div className="flex gap-3 items-center" key={item.categoryId}>
              <span className="font-bold w-full text-sm">
                {item.categoryName} :{" "}
              </span>
              {item.insurance.length > 0 ? (
                <>
                  {" "}
                  {item.insurance.map((it) => (
                    <div
                      onClick={() => {
                        setSelected({
                          ...selected,
                          [item.categoryId]: it.insuranceId,
                        });
                      }}
                      className="flex gap-1 items-center  w-full"
                      key={it.id}
                    >
                      <Radio
                        checked={selected[item.categoryId] === it.insuranceId}
                      />
                      <span className="text-xs">{it.insuranceTitle}</span>
                    </div>
                  ))}
                  <div
                    onClick={() => {
                      setSelected({
                        ...selected,
                        [item.categoryId]: undefined,
                      });
                    }}
                    className="flex gap-1 items-center  w-full"
                  >
                    <Radio checked={selected[item.categoryId] === undefined} />
                    <span className="text-xs">هیچ کدام</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-end gap-2 items-center w-full">
                  <small className="text-xs text-red-700">فاقد خدمات</small>
                  <Button
                    href={`/categories/${item.categoryId}?title=${item.categoryName}`}
                    target="_blank"
                    variant="outlined"
                    size="small"
                  >
                    ثبت خدمات{" "}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </>
      )}
      <div className="flex justify-end">
        <Button
          disabled={loading || loading2}
          onClick={handleSave}
          variant="contained"
        >
          ثبت اطلاعات
        </Button>
      </div>
    </Modal>
  );
};

export default InsuranceModal;
