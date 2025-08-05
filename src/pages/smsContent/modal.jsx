import { Delete } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal, TextInput } from "../../components/common";
import axiosInstance from "../../components/dataFetch/axiosInstance";
import Confirm from "../../components/modals/Confirm";
import {
  baseUrl,
  CREATE_SMS,
  DELETE_SMS,
  EDIT_SMS,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { logout } from "../../redux/slices/user";

const SmsContentModal = ({
  open,
  close,
  prevData = {},
  forEdit,
  setAllRows,
  allRows,
  smsType,
  allTelegrams,
  providers,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { userPermissions } = useSelector((state) => state.relationals);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedTelegram, setSelectedTelegram] = useState([]);
  const [selectedTelegramTitle, setSelectedTelegramTitle] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(prevData || { smsActive: true });
  useEffect(() => {
    if (forEdit) {
      setData({
        ...prevData,
        type: smsType.find(
          (item) => String(item.title) === String(prevData.type)
        ),
        target: smsType.find(
          (item) => String(item.id) === String(prevData?.target)
        ),
      });
      if (prevData.telegramGroupIds) {
        setSelectedTelegram(
          prevData.telegramGroupIds.split(",").map((itm) => Number(itm))
        );
      }
    } else {
      setData({ smsActive: true });
      setSelectedTelegram([]);
      setSelectedTelegramTitle([]);
    }
  }, [prevData, forEdit]);
  const submitData = () => {
    if (data.title) {
      setLoading(true);

      const jsonData = {
        message: data.message,
        target: data.target?.id,
        active: data.active ? true : false,
        title: data.title,
        sendToTelegram: data.sendToTelegram ? true : false,
        TelegramGroupIds: selectedTelegram.join(","),
        isUser: data.isUser ? true : false,
        emailActive: data.emailActive ? true : false,
        smsActive: data.smsActive ? true : false,
        email: data.emailActive ? data.email : undefined,
        templateRelations: data.templateRelations || [],
        providerVoiceTemplateId: data.providerVoiceTemplateId,
        voice: data.voice,
        voiceActive: data.voiceActive,
      };

      if (forEdit) {
        jsonData.id = data.id;
      }

      const url = forEdit
        ? `${baseUrl}/${EDIT_SMS}`
        : `${baseUrl}/${CREATE_SMS}`;
      const method = forEdit ? "post" : "post";

      axiosInstance[method](url, jsonData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setLoading(false);
          toast.success(forEdit ? "با موفقیت ویرایش شد" : "با موفقیت اضافه شد");

          const temp = [...allRows];
          if (forEdit) {
            const index = temp.findIndex((item) => item.id === data.id);
            temp[index] = res.data.data;
          } else {
            temp.unshift(res.data.data);
          }
          setAllRows(temp);

          close();
          setData({});
          setSelectedTelegram([]);
          setSelectedTelegramTitle([]);
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message);
          if (err.response?.status === 401) {
            dispatch(logout());
          }
        });
    } else {
      toast.error("عنوان را وارد کنید");
    }
  };
  const deleteAttr = () => {
    setLoading(true);
    axiosInstance
      .delete(`${baseUrl}/${DELETE_SMS}?id=${data.id}`, configReq(token))
      .then((res) => {
        var temp = [...allRows];
        var newData = temp.filter((item) => item.id !== data.id);
        setAllRows(newData);
        setLoading(false);
        setConfirmDelete(false);
        toast.success("با موفقیت حذف شد");
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
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedTelegram(typeof value === "string" ? value.split(",") : value);
  };
  useEffect(() => {
    var temp = [];
    selectedTelegram.map((item) => {
      temp.push(allTelegrams.find((it) => it.id === item)?.title);
    });
    setSelectedTelegramTitle(temp);
  }, [selectedTelegram]);
  const value = (id, name) => {
    return data?.templateRelations?.find((item) => item.smsProviderId === id)?.[
      name
    ];
  };
  const handleChangeProvider = (value, id, name) => {
    var temp = data?.templateRelations ? [...data?.templateRelations] : [];
    var index = temp.findIndex((item) => item.smsProviderId === id);
    if (index !== -1) {
      temp[index][name] = value;
    } else {
      temp.push({
        smsProviderId: id,
        [name]: value,
      });
    }
    setData({ ...data, templateRelations: temp });
  };
  return (
    <Modal
      open={open}
      close={() => {
        close();
      }}
      title={` ${forEdit ? "ویرایش" : "افزودن"}  پیام`}
    >
      <TextInput
        label=" عنوان"
        change={(e) => setData({ ...data, title: e })}
        currentValue={data?.title}
      />
      {providers.map((item, index) => (
        <div className="flex items-center gap-3" key={index}>
          <div className="flex gap-2 items-center">
            <div className="w-[150px] text-sm">آیدی قالب {item.title} : </div>{" "}
            <div className="leftInput">
              <input
                value={value(item.id, "providerTemplateId")}
                onChange={(e) =>
                  handleChangeProvider(
                    e.target.value,
                    item.id,
                    "providerTemplateId"
                  )
                }
                placeholder="آیدی قالب"
                className="border max-w-[80px] placeholder:text-right rounded-xl py-2 px-3 text-sm"
              />
            </div>
          </div>{" "}
          <div className="flex gap-2 items-center">
            <div className="w-[150px] text-sm">
              آیدی قالب {item.title} (صوتی):{" "}
            </div>{" "}
            <div className="leftInput">
              <input
                value={value(item.id, "providerVoiceTemplateId")}
                onChange={(e) =>
                  handleChangeProvider(
                    e.target.value,
                    item.id,
                    "providerVoiceTemplateId"
                  )
                }
                placeholder="آیدی قالب"
                className="border max-w-[80px] placeholder:text-right rounded-xl py-2 px-3 text-sm"
              />
            </div>
          </div>
        </div>
      ))}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          rowGap: 1,
          columnGap: 1,
        }}
      >
        <span className="text-sm "> ارسال با پیامک : </span>
        <Switch
          checked={data?.smsActive}
          onChange={(e) => setData({ ...data, smsActive: !data?.smsActive })}
        />
      </Box>{" "}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          rowGap: 1,
          columnGap: 1,
        }}
      >
        <span className="text-sm "> ارسال با ایمیل : </span>
        <Switch
          checked={data?.emailActive}
          onChange={(e) =>
            setData({ ...data, emailActive: !data?.emailActive })
          }
        />
      </Box>{" "}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          rowGap: 1,
          columnGap: 1,
        }}
      >
        <span className="text-sm "> ارسال به تلگرام : </span>
        <Switch
          checked={data?.sendToTelegram}
          onChange={(e) =>
            setData({ ...data, sendToTelegram: !data?.sendToTelegram })
          }
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          rowGap: 1,
          columnGap: 1,
        }}
      >
        <span className="text-sm "> ارسال با پیام صوتی : </span>
        <Switch
          checked={data?.voiceActive}
          onChange={(e) =>
            setData({ ...data, voiceActive: !data?.voiceActive })
          }
        />
      </Box>
      {data.sendToTelegram && (
        <FormControl>
          <InputLabel id="demo-multiple-checkbox-label">
            گروه های تلگرام
          </InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={selectedTelegram}
            onChange={handleChange}
            input={<OutlinedInput label="   گروه های تلگرام" />}
            renderValue={(selected) => selectedTelegramTitle.join(", ")}
          >
            {allTelegrams.map((name) => (
              <MenuItem key={name.id} value={name.id}>
                <Checkbox checked={selectedTelegram.indexOf(name.id) > -1} />
                <ListItemText primary={name.title} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {(data?.smsActive || data.sendToTelegram) && (
        <TextField
          multiline
          rows={4}
          label="   متن پیام"
          onChange={(e) => setData({ ...data, message: e.target.value })}
          value={data?.message}
        />
      )}{" "}
      {data.voiceActive && (
        <>
          <TextField
            multiline
            rows={4}
            label="   متن پیام صوتی"
            onChange={(e) => setData({ ...data, voice: e.target.value })}
            value={data?.voice}
          />
        </>
      )}
      {data?.emailActive && (
        <TextField
          multiline
          rows={4}
          label="   متن ایمیل"
          onChange={(e) => setData({ ...data, email: e.target.value })}
          value={data?.email}
        />
      )}
      <div className="grid grid-cols-2 gap-2">
        {guide.map((item, index) => (
          <span key={index}>{item}</span>
        ))}
      </div>
      <Autocomplete
        options={smsType || []}
        getOptionLabel={(option) => option.title || ""}
        value={data?.target || null}
        onChange={(e, newValue) => setData({ ...data, target: newValue })}
        renderInput={(params) => (
          <TextField
            {...params}
            label="انتخاب پیام هدف"
            variant="outlined"
            fullWidth
            margin="normal"
          />
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          rowGap: 1,
          columnGap: 1,
        }}
      >
        <span className="text-sm ">فعال/غیر فعال : </span>
        <Switch
          checked={data?.active}
          onChange={(e) => setData({ ...data, active: !data?.active })}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          rowGap: 1,
          columnGap: 1,
        }}
      >
        <span className="text-sm ">ارسال به کاربر : </span>
        <Switch
          checked={data?.isUser}
          onChange={(e) => setData({ ...data, isUser: !data?.isUser })}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {userPermissions?.sms?.delete && forEdit && (
          <IconButton size="large" onClick={() => setConfirmDelete(true)}>
            <Delete sx={{ color: "red" }} />
          </IconButton>
        )}
        <div style={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          color="primary"
          onClick={submitData}
          disabled={loading}
          sx={{ width: { xs: "50%", md: "auto" } }}
        >
          {loading ? <CircularProgress /> : <>ثبت اطلاعات</>}
        </Button>{" "}
      </Box>
      <Confirm
        message="آیا از حذف این پیام اطمینان دارید؟"
        close={() => setConfirmDelete(false)}
        submit={deleteAttr}
        open={confirmDelete}
      />
    </Modal>
  );
};

export default SmsContentModal;

var guide = [
  "{fn} - نام",
  "{ln} - نام خانوادگی",
  "{cd} - کد",
  "{wc} - کد مصرف",
  "{od} - مشخصات کامل سفارش",
  "{oi} - شماره سفارش",
  "{of} - قیمت نهایی سفارش",
  "{or} - شماره پیگیری سفارش",
  "{wv} - مقدار کیف پول",
  "{wr} - شماره پیگیری کیف پول",
  "{dt} - زمان",
  "{li} - کد درخواست وام",
  "{lm} - شرح پیام لیزینگ",
  "{dc} -   کد تحویل کالا",
  "{od} - شرح کامل",
  "{odt} - فقط نام محصول",
  "{oda} - همه ویژگی ها",
  "{od1} - فقط ویژگی 1",
  "{od2} - فقط ویژگی 2",
  "{odx} - عنوان کالا به همراه ویژگی 1",
  "{gw} -  درگاه پرداختی",
  "{pls} - شماره مرحله تسهیلات طرح",
  "{dt} - زمان مراجعه به باجه",
  "{pli} - شماره تسهیلات طرح",
  "{pl0} - لینک پرداخت هزینه پوشه مدارک تسهیلات طرح",
  "{pl1} - لینک پرداخت هزینه اعتبار سنجی تسهیلات طرح",
  "{pl3} - لینک پرداخت هزینه کارمزد طرح",
  "{lamo} - مبلغ وام رفاه",
  "{ireq} - شماره پیگیری وام رفاه",
  "{dd} - تاریخ تحویل",
  "{aod} - توضیحات سفارش ادمین",
  "{fn1} - نام نماینده",
  "{ln1} - نام خانوادگی نماینده",
  "{occ} - کد تایید سفارش",
  "{ofl} - قیمت نهایی تسهیلات",
  "{sc} - شرکت  حمل و نقل",
  "{tpi} - شماره بارنامه (کد رهگیری مرسوله)",
  "{offp} - مبلغ بازپرداخت تسهیلات  ",
  "{ofde} - مبلغ مابه التفاوت",
  "{usp} - میزان توان خرید کاربر",
  "{wch} - میزان شارژ کیف پول پس از سفارش",
  "{incl} - تعداد اقساط معوق",
  "{inpl} - مبلغ اقساط معوق",
  "{ext} - متن اضافه",
  "{fuln} - نام و نام خانوادگی",
  "{cr} - متن کپی رایت",
  "{ad} - آدرس شرکت",
  "{lc} - لوگوی شرکت",
  "{cpd} - توضیحات شرکت",
  "{em} - ایمیل",
  "{cn} - نام شرکت",
  "{tl} - شماره ثابت شرکت",
  "{ml} - موبایل شرکت",
  "{slo} - شعار شرکت",
  "{wha} - لینک واتساپ شرکت",
  "{telg} - لینک تلگرام شرکت",
  "{instg} - لینک اینستاگرام شرکت",
  "{web} - آدرس سایت",
  "{gwn} - درگاه سفارش",
];
