import {
  Alert,
  Autocomplete,
  FormControlLabel,
  Paper,
  Radio,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import {
  Dropdown,
  NumberInput,
  TextInput,
  UploadImage,
} from "../../../components/common";

const Step1 = ({
  data,
  setData,
  urls,
  allUser,
  companies,
  editMode,
  planStarted,
}) => {
  return (
    <div className="w-full">
      <Paper elevation={0}>
        {" "}
        <Alert sx={{ mb: "5px" }} variant="outlined" severity="info">
          تا زمانی که طرح فروش و تخفیفات آغاز نشده یا فعال نشده می توانید مقادیر
          را ویرایش کنید
          <br />
          زمانی که طرح فروش و تخفیفات آغاز میگردد ، فقط می توانید زمانبندی
          پایانی و لیست کاربران و لیست محصولات را ویرایش نمایید.
        </Alert>
      </Paper>

      {data?.planType !== "0" && editMode ? (
        <></>
      ) : (
        <>
          {" "}
          <FormControlLabel
            onClick={() => setData({ ...data, planType: "0" })}
            value="male"
            control={<Radio size="small" checked={data?.planType === "0"} />}
            label="ایجاد طرح  فروش"
          />
          <div className="relative">
            {data?.planType !== "0" || planStarted ? (
              <Box
                sx={{
                  zIndex: data?.planType !== "0" ? 20 : planStarted ? 10 : 0,
                }}
                className="absolute z-20 cursor-not-allowed bg-gray-100 opacity-40 w-full h-full top-0 right-0"
              ></Box>
            ) : (
              <div></div>
            )}
            <Paper
              elevation={0}
              className="rounded-lg re  border-[#dbdfea] border w-full py-6 md:px-5 px-2 flex flex-col gap-6 mt-2 mb-10"
            >
              <div className="grid grid-cols-1  md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6 sm:grid-cols-6 gap-4  text-xs">
                <div className="col-span-1">
                  <TextInput
                    label=" عنوان طرح"
                    currentValue={data?.titleP}
                    change={(e) => setData({ ...data, titleP: e })}
                    disabled={data?.planType !== "0"}
                  />
                </div>
                <div className="col-span-1">
                  <TextInput
                    label="کد تجاری طرح   "
                    change={(e) => setData({ ...data, codeP: e })}
                    currentValue={data?.codeP}
                    disabled={data?.planType !== "0"}
                  />
                </div>
                <div className="col-span-1">
                  <Autocomplete
                    value={data.link || ""}
                    onChange={(event, newValue) => {
                      setData({ ...data, link: newValue });
                    }}
                    disabled={data?.planType !== "0"}
                    /*      inputValue={data.link || ""} */
                    getOptionLabel={(option) => option}
                    id="controllable-states-demo"
                    sx={{
                      ".MuiOutlinedInput-root": {
                        padding: "7px !important",
                      },
                    }}
                    options={urls || []}
                    renderInput={(params) => (
                      <TextField
                        focused
                        {...params}
                        sx={{
                          input: {
                            paddingRight: "20px !important",
                          },
                        }}
                        label={"    لینک نمایش طرح"}
                      />
                    )}
                  />
                </div>
                <UploadImage
                  file={data?.avatarP}
                  change={(e) => setData({ ...data, avatarP: e })}
                  address={data.galleryIdP}
                  selectedProductImage={data?.selectedProductImageP}
                  setselectedProductImage={(e) =>
                    setData({ ...data, selectedProductImageP: e })
                  }
                />
                <div className="col-span-2">
                  <div className="flex items-center justify-end">
                    <Typography sx={{ fontSize: "13px" }}>
                      فعال / غیر فعال
                    </Typography>
                    <Switch
                      onClick={(e) =>
                        setData({ ...data, activeP: !data?.activeP })
                      }
                      checked={data?.activeP}
                      disabled={data?.planType !== "0"}
                    />
                  </div>
                </div>
              </div>
              <div className=" items-end relative z-10 gap-4 flex-wrap col-span-6">
                <TextField
                  rows={3}
                  multiline
                  label="توضیحات طرح"
                  onChange={(e) =>
                    setData({ ...data, descriptionP: e.target.value })
                  }
                  value={data?.descriptionP}
                  fullWidth
                  disabled={data?.planType !== "0"}
                />
              </div>
            </Paper>
          </div>
        </>
      )}
      {data?.planType !== "1" && editMode ? (
        <></>
      ) : (
        <>
          {" "}
          <FormControlLabel
            onClick={() => setData({ ...data, planType: "1" })}
            value="male"
            control={<Radio size="small" checked={data?.planType === "1"} />}
            label=" ایجاد کد تخفیف   "
            /*    disabled={data?.planType !== "0"} */
          />{" "}
          <div className="relative">
            {data?.planType !== "1" || planStarted ? (
              <Box
                sx={{
                  zIndex: data?.planType !== "0" ? 20 : planStarted ? 10 : 0,
                }}
                className="absolute z-20 cursor-not-allowed bg-gray-100 opacity-40 w-full h-full top-0 right-0"
              ></Box>
            ) : (
              <div></div>
            )}{" "}
            <Paper
              elevation={0}
              className="rounded-lg  border-[#dbdfea] border w-full py-6 md:px-5 px-2 flex flex-col gap-6 mt-2 "
              sx={{
                pointerEvents: data?.planType === "0" ? "none" : "",
                cursor: data?.planType === "0" ? "not-allowed !important" : "",
              }}
            >
              {" "}
              <>
                <div className="grid grid-cols-1  md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6 sm:grid-cols-6 gap-4  text-xs">
                  <div className="col-span-1">
                    <TextInput
                      label="عنوان تخفیف"
                      change={(e) => setData({ ...data, title: e })}
                      currentValue={data?.title}
                      disabled={data?.planType === "0"}
                    />
                  </div>

                  <div className="col-span-1">
                    <TextInput
                      label="کد تخفیف"
                      change={(e) => setData({ ...data, code: e })}
                      currentValue={data?.code}
                      disabled={data?.planType === "0"}
                    />
                  </div>
                  <div className="col-span-2">
                    {" "}
                    <UploadImage
                      file={data?.avatar}
                      change={(e) => setData({ ...data, avatar: e })}
                      address={data.galleryId}
                      selectedProductImage={data?.selectedProductImage}
                      setselectedProductImage={(e) =>
                        setData({ ...data, selectedProductImage: e })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center justify-end">
                      <Typography sx={{ fontSize: "13px" }}>
                        فعال / غیر فعال
                      </Typography>
                      <Switch
                        onClick={(e) =>
                          setData({ ...data, active: !data?.active })
                        }
                        checked={data?.active}
                        disabled={data?.planType === "0"}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-2 relative z-20">
                  <TextField
                    rows={3}
                    multiline={true}
                    label="شرح تخفیف"
                    onChange={(e) =>
                      setData({ ...data, description: e.target.value })
                    }
                    value={data?.description}
                    disabled={data?.planType === "0"}
                    fullWidth
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1   lg:grid-cols-3  xl:grid-cols-3 sm:grid-cols-1  gap-3 w-full">
                  <Box
                    sx={{
                      background: (theme) =>
                        data?.codeType === "0"
                          ? theme.palette.mode === "dark"
                            ? "#351936"
                            : "#FFF1F1"
                          : "tranparent",
                      border: data?.codeType === "0" ? "1px solid" : "none",
                    }}
                    className="flex items-center justify-between h-[104px] p-2  border-[#707070] rounded-[10px]"
                  >
                    <div className="flex">
                      <Radio
                        size="small"
                        checked={data?.codeType === "0"}
                        onClick={() =>
                          setData({ ...data, codeType: "0", codeLimit: null })
                        }
                      />
                      <Typography
                        sx={{ fontSize: "1rem", ml: "5px", fontWeight: "bold" }}
                      >
                        کد یکتا
                      </Typography>
                    </div>
                    <div className="flex items-center">
                      <Typography
                        sx={{
                          fontSize: "1rem",
                          mr: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        محدودیت تعداد استفاده{" "}
                      </Typography>
                      <Paper
                        elevation={0}
                        className="flex justify-center items-center  w-[55px]  "
                      >
                        <NumberInput
                          change={(e) => setData({ ...data, codeLimit: e })}
                          value={data?.codeLimit}
                          min="1"
                          disabled={
                            data?.planType === "0" || data?.codeType !== "0"
                          }
                        />
                      </Paper>
                    </div>
                  </Box>
                  <Box
                    sx={{
                      background: (theme) =>
                        data?.codeType === "1"
                          ? theme.palette.mode === "dark"
                            ? "#351936"
                            : "#FFF1F1"
                          : "tranparent",
                      border: data?.codeType === "1" ? "1px solid" : "none",
                    }}
                    className="flex col-span-2 items-center gap-5  pr-4 p-2  border-[#707070] rounded-[10px] max-w-md"
                  >
                    <div className="flex items-center">
                      <FormControlLabel
                        onClick={(e) =>
                          setData({ ...data, codeType: "1", codeLimit: null })
                        }
                        value="male"
                        control={
                          <Radio
                            size="small"
                            checked={data?.codeType === "1"}
                          />
                        }
                        disabled={data?.planType === "0"}
                        label={
                          <span className="text-sm"> تولید کد تخفیف رندوم</span>
                        }
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-sm">تعداد تولید کد تخفیف</p>
                      <Paper elevation={0} className="w-[58px] mr-2">
                        <NumberInput
                          change={(e) => setData({ ...data, num: e })}
                          value={data?.num}
                          min="1"
                          disabled={data?.codeType !== "1"}
                        />
                      </Paper>

                      {/*     <Button variant="contained">تولید کد</Button> */}
                    </div>
                  </Box>
                </div>
                <Box
                  sx={{
                    background: (theme) =>
                      theme.palette.mode === "dark" ? "#351936" : "#F0F2F5",
                  }}
                  className="w-auto m-4 md:h-[163px] border border-[#707070] rounded-[10px] p-6"
                >
                  <Typography sx={{ fontWeight: "bold" }}>
                    شرایط مبلغی و مصرفی
                  </Typography>
                  <div className="grid md:grid-cols-3 gap-10 mt-4">
                    <Paper elevation={0}>
                      {" "}
                      <Dropdown
                        change={(e) =>
                          setData({ ...data, discountType: e?.id })
                        }
                        value={discountType?.find(
                          (item) => item.id === data.discountType
                        )}
                        title="نوع تخفیف"
                        disabled={data?.planType === "0"}
                        data={discountType}
                      />
                    </Paper>
                    <Paper elevation={0}>
                      {" "}
                      <TextInput
                        label="ارزش تخفیف"
                        change={(e) => setData({ ...data, discountAmount: e })}
                        currentValue={data?.discountAmount}
                        disabled={data?.planType === "0"}
                      />
                    </Paper>
                  </div>
                  <p className="mt-4 text-xs">
                    در صورت انتخاب نوع تخفیف مبلغی ارزش تخفیف را به تومان وارد
                    کنید
                  </p>
                </Box>
                <div className="flex items-center">
                  {/*           <Box
                    sx={{
                      background: (theme) =>
                        theme.palette.mode === "dark" ? "#351936" : "#F0F2F5",
                    }}
                    className="m-4 py-[14px]  border border-[#707070] rounded-[10px]"
                  >
                    <div className="flex items-center w-auto px-2">
                      <Checkbox disabled={data?.planType === "0"} />
                      <label className="mr-[6px] font-bold">
                        تخصیص کد تخفیف برای کاربران سایت
                      </label>
                    </div>
                  </Box>
                  <Box
                    sx={{
                      background: (theme) =>
                        theme.palette.mode === "dark" ? "#351936" : "#F0F2F5",
                    }}
                    className="flex items-center py-2 pl-2 m-4 w-auto  border border-[#707070] rounded-[10px]"
                  >
                    <div className="flex items-center w-auto px-2 ">
                      <Checkbox
                        disabled={data?.planType === "0"}
                        defaultChecked={data.companyId}
                        size="medium"
                      />
                      <label className="mr-[6px] font-bold text-base">
                        {" "}
                        تخصیص کد تخفیف برای کاربران سازمانی{" "}
                      </label>
                    </div>
                    <div className="w-[211px]">
                      <Dropdown
                        disabled={data?.planType === "0"}
                        title="انتخاب شرکت"
                        data={companies}
                        change={(e) => {
                          setData({ ...data, companyId: e?.id });
                        }}
                        value={companies?.find(
                          (item) => item.id === data.companyId
                        )}
                      />
                    </div>
                  </Box>{" "} */}
                </div>
              </>{" "}
            </Paper>
          </div>
        </>
      )}

      <div className="w-full relative">
        {" "}
        {planStarted ? (
          <div className="absolute z-20 cursor-not-allowed bg-gray-100 opacity-40 w-full h-full top-0 right-0"></div>
        ) : (
          <div></div>
        )}
        <p className="mt-4 mb-2">- بازاریاب</p>
        <Paper
          elevation={0}
          className="rounded-lg  border-[#dbdfea] border w-full py-6 md:px-5 px-2 flex flex-col gap-6 mt-2 "
        >
          <div className="grid md:grid-cols-6 gap-6">
            {allUser && allUser?.length > 0 && (
              <Autocomplete
                value={allUser?.find((item) => item.id === data.marketer)}
                onChange={(event, newValue) => {
                  setData({ ...data, marketer: newValue?.id });
                }}
                /*  inputValue={data.marketer || ""} */
                getOptionLabel={(option) => option?.fname + ` ${option?.lname}`}
                id="controllable-states-demo"
                options={allUser || []}
                renderInput={(params) => (
                  <TextField
                    focused
                    {...params}
                    sx={{
                      input: {
                        paddingRight: "20px !important",
                      },
                    }}
                    label={"    انتخاب بازاریاب"}
                  />
                )}
              />
            )}{" "}
            <Dropdown
              change={(e) => setData({ ...data, commissionType: e?.id })}
              value={commissionType?.find(
                (item) => item.id === data.commissionType
              )}
              title="نوع کمسیون"
              data={commissionType}
            />{" "}
            <NumberInput
              change={(e) => setData({ ...data, commissionAmount: e })}
              value={data?.commissionAmount}
              min="0"
              label="ارزش کمسیون"
              float={true}
            />
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default Step1;
const discountType = [
  { id: 0, title: "درصدی" },
  { id: 1, title: "مبلغی" },
];
const commissionType = [{ id: 0, title: "درصدی" }];
