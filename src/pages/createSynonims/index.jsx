/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Delete } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loading, PageTitle, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import { baseUrl, EDIT_SYNOIM } from "../../helpers/api-routes";
import { configReq, snackMaker } from "../../helpers/functions";
import { addSnack } from "../../redux/slices/snacks";
const CreateSynonyms = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [worlds, setWorlds] = useState([]);
  const [world, setWorld] = useState("");
  const [baseworld, setBaseWorld] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSave = () => {
    setLoading(true);
    var string = "";
    worlds.map((item) => {
      string += `,${item}`;
    });
    const formData = new FormData();
    formData.append("original", baseworld);
    formData.append("synonims", string.slice(1));
    axiosInstance
      .post(`${baseUrl}/${EDIT_SYNOIM}`, formData, configReq(token))
      .then((res) => {
        setLoading(false);

        navigate("/synonyms");
        dispatch(addSnack(snackMaker("success", "با موفقیت اضافه شد")));
      })
      .catch((err) => {
        setLoading(false);
        dispatch(addSnack(snackMaker("error", "درخواست ویرایش انجام نشد")));
      });
  };
  const allWorld = () => {
    var temp = [...worlds];
    if (world) {
      temp.push(world);
    }
    setWorld("");
    setWorlds(temp);
  };
  const handleDelete = (item) => {
    var temp = [...worlds];

    temp = temp.filter((i) => i !== item);
    setWorlds(temp);
  };
  return (
    <div className="container ">
      <PageTitle
        title=" افزودن واژه "
        broadCrumb={[
          {
            title: "واژه ها",
            path: "/synonyms",
          },
        ]}
      />
      {loading && <Loading />}
      <div className="flex flex-col bg-white p-7 rounded-md">
        <div className="flex items-center  justify-between border-b border-dashed mb-5 pb-4">
          <div className="flex items-center  gap-10">
            <div className="max-w-[200px]">
              <TextInput
                label="افزودن واژه "
                change={setBaseWorld}
                currentValue={baseworld}
              />
            </div>
            <div className="max-w-[200px]">
              <TextInput
                label="افزودن واژه مترادف"
                change={setWorld}
                currentValue={world}
              />
            </div>
          </div>

          <Button
            sx={{ maxHeight: "40px" }}
            onClick={allWorld}
            variant="contained"
            color="primary"
          >
            افزودن
          </Button>
        </div>
        <div className="flex flex-wrap justify-between">
          <div className="flex flex-wrap gap-4 flex-col">
            <span className="text-base font-semibold">مترادف ها : </span>
            <div className="flex flex-wrap gap-4">
              {worlds.map((item) => (
                <div
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-3xl flex gap-2 items-center"
                  key={item}
                >
                  {item}
                  <IconButton onClick={() => handleDelete(item)}>
                    <Delete
                      color="error"
                      sx={{ fontSize: "15px !important" }}
                    />
                  </IconButton>
                </div>
              ))}
            </div>
          </div>
          {worlds.length > 0 && (
            <div className="flex items-center justify-center">
              <Button variant="contained" onClick={handleSave} color="success">
                ثبت اطلاعات
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateSynonyms;
