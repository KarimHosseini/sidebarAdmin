import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { baseUrl, SET_MANDATORY } from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const CategoryInsuranceForceModal = ({ open, close, prevData, reset }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(prevData);
  }, [prevData]);

  const handleSelectInsurance = (event) => {
    const selectedId = parseInt(event.target.value);
    const updatedData = data.map((item) => ({
      ...item,
      isMandatory: item.insuranceId === selectedId,
    }));
    setData(updatedData);
  };
  const handleSave = () => {
    const insuranceId = data.find((item) => item.isMandatory)?.insuranceId;
    var obj = { categoryId: id };
    if (insuranceId) obj = { ...obj, insuranceId };
    axiosInstance
      .post(
        `${baseUrl}/${SET_MANDATORY}`,
        {
          ...obj,
        },
        configReq(token)
      )
      .then((res) => {
        setLoading(false);
        toast.success("با موفقیت ویرایش شد");
        reset();
        close();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      });
  };
  return (
    <Modal
      open={open}
      close={() => {
        close();
      }}
      title={` انتخاب خدمات اجباری`}
    >
      {data && (
        <div>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="force-insurance"
              name="force-insurance-group"
              value={data.find((item) => item.isMandatory)?.insuranceId || ""}
              onChange={handleSelectInsurance}
            >
              {data.map((item) => (
                <FormControlLabel
                  key={item.insuranceId}
                  value={item.insuranceId?.toString()}
                  control={<Radio />}
                  label={item.insuranceTitle}
                />
              ))}{" "}
              <FormControlLabel
                value={null}
                control={
                  <Radio checked={!data.find((item) => item.isMandatory)} />
                }
                label={"هیچ کدام"}
              />
            </RadioGroup>
          </FormControl>
        </div>
      )}
      <div className="flex gap-3  justify-end">
        <Button disabled={loading} onClick={handleSave} variant="contained">
          {loading ? <CircularProgress /> : <>ثبت اطلاعات</>}
        </Button>
      </div>
    </Modal>
  );
};

export default CategoryInsuranceForceModal;
