import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { baseUrl, CREATE_SYNONIM } from "../../../helpers/api-routes";
import { configReq } from "../../../helpers/functions";
import { ActionButton, Loading, Modal, TextInput } from "../../common";
import axiosInstance from "../../dataFetch/axiosInstance";

const CreateSynonimModal = ({ open, close }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);

  const [original, setOriginal] = useState("");
  const [synonim, setSynonim] = useState("");
  const [loading, setLoading] = useState(false);

  const submitData = () => {
    const data = {
      original,
      synonim,
    };
    if (original && synonim) {
      setLoading(true);
      axiosInstance
        .post(`${baseUrl}/${CREATE_SYNONIM}`, data, configReq(token))
        .then((res) => {
          setLoading(false);
          close();
          toast.success("با موفقیت ویرایش شد");
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setLoading(false);
        });
    } else {
    }
  };

  return (
    <Modal open={open} close={close} title="افزودن واژه جدید">
      {loading && <Loading />}
      <TextInput
        label="واژه اصلی"
        change={setOriginal}
        currentValue={original}
      />
      <TextInput
        label="مشابه/معادل"
        change={setSynonim}
        currentValue={synonim}
      />
      <ActionButton click={submitData} />
    </Modal>
  );
};

export default CreateSynonimModal;
