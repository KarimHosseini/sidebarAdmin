import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";
import { DELETE_SHOWCASE_IMAGE } from "../../../helpers/api-routes";
import { NumberInput, UploadImage } from "../../common";
import ColorModal from "../../common/colorModal";

const Background = ({
  avatar,
  setAvatar,
  selectedProductImage,
  setselectedProductImage,
  bgSetting,
  setBgSetting,
  setNeedPreview,
  id,
  hasRemoved,
}) => {
  const handlePositions = (value) => {
    if (value === 0) {
      setBgSetting({ ...bgSetting, possitionY: "top", possitionX: "right" });
    } else if (value === 1) {
      setBgSetting({ ...bgSetting, possitionY: "top", possitionX: "center" });
    } else if (value === 2) {
      setBgSetting({ ...bgSetting, possitionY: "top", possitionX: "left" });
    } else if (value === 3) {
      setBgSetting({ ...bgSetting, possitionY: "center", possitionX: "right" });
    } else if (value === 4) {
      setBgSetting({
        ...bgSetting,
        possitionY: "center",
        possitionX: "center",
      });
    } else if (value === 5) {
      setBgSetting({ ...bgSetting, possitionY: "center", possitionX: "left" });
    } else if (value === 6) {
      setBgSetting({ ...bgSetting, possitionY: "bottom", possitionX: "right" });
    } else if (value === 7) {
      setBgSetting({
        ...bgSetting,
        possitionY: "bottom",
        possitionX: "center",
      });
    } else if (value === 8) {
      setBgSetting({ ...bgSetting, possitionY: "bottom", possitionX: "left" });
    }
  };
  const checkBg = (value) => {
    if (value === 0) {
      return (
        bgSetting?.possitionY === "top" && bgSetting?.possitionX === "right"
      );
    } else if (value === 1) {
      return (
        bgSetting?.possitionY === "top" && bgSetting?.possitionX === "center"
      );
    } else if (value === 2) {
      return (
        bgSetting?.possitionY === "top" && bgSetting?.possitionX === "left"
      );
    } else if (value === 3) {
      return (
        bgSetting?.possitionY === "center" && bgSetting?.possitionX === "right"
      );
    } else if (value === 4) {
      return (
        bgSetting?.possitionY === "center" && bgSetting?.possitionX === "center"
      );
    } else if (value === 5) {
      return (
        bgSetting?.possitionY === "center" && bgSetting?.possitionX === "left"
      );
    } else if (value === 6) {
      return (
        bgSetting?.possitionY === "bottom" && bgSetting?.possitionX === "right"
      );
    } else if (value === 7) {
      return (
        bgSetting?.possitionY === "bottom" && bgSetting?.possitionX === "center"
      );
    } else if (value === 8) {
      return (
        bgSetting?.possitionY === "bottom" && bgSetting?.possitionX === "left"
      );
    }
  };
  return (
    <div className="mb-10 mt-4 border py-3 px-7 rounded-md grid md:grid-cols-3 gap-3">
      <div className="flex flex-col">
        <UploadImage
          file={avatar}
          change={setAvatar}
          address={selectedProductImage}
          selectedProductImage={selectedProductImage}
          setselectedProductImage={setselectedProductImage}
          needPreview={true}
          setNeedPreview={setNeedPreview}
          id={id}
          removeApi={DELETE_SHOWCASE_IMAGE}
          hasRemoved={hasRemoved}
        />
        <div className="flex text-sm items-center mt-4 gap-3 rounded-md border px-3 py-2">
          <div>
            <span className="text-xs"> پهنای تصویر :‌</span>
          </div>
          <FormControl
            sx={{
              ".MuiTypography-root": {
                fontSize: "0.75rem !important",
              },
            }}
          >
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
            >
              <FormControlLabel
                onClick={() => setBgSetting({ ...bgSetting, size: "contain" })}
                value="female"
                control={
                  <Radio size="small" checked={bgSetting?.size === "contain"} />
                }
                label="اندازه تمام تصویر"
              />
              <FormControlLabel
                onClick={() => setBgSetting({ ...bgSetting, size: "cover" })}
                value="male"
                control={
                  <Radio size="small" checked={bgSetting?.size === "cover"} />
                }
                label="پوشش تمام عرض صفحه"
              />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
      <div className="flex flex-col ">
        <span className="text-sm text-[#673AB7]">تنظیمات نمایشی</span>
        <div className="border rounded-md flex flex-col items-end px-3 py-3">
          <div
            onClick={() =>
              setBgSetting({ ...bgSetting, parallex: !bgSetting?.parallex })
            }
            className="flex items-center"
          >
            <span className="text-xs">نمایش به صورت پارالکس :‌</span>
            <Checkbox checked={bgSetting?.parallex} />
          </div>
          <div
            onClick={() =>
              setBgSetting({ ...bgSetting, repeat: !bgSetting?.repeat })
            }
            className="flex items-center"
          >
            <span className="text-xs">دارای تکرار :‌</span>
            <Checkbox checked={bgSetting?.repeat} />
          </div>
          <div
            onClick={() =>
              setBgSetting({
                ...bgSetting,
                inContainer: !bgSetting?.inContainer,
              })
            }
            className="flex items-center"
          >
            <span className="text-xs"> عکس داخل کانتینر :‌</span>
            <Checkbox checked={bgSetting?.inContainer} />
          </div>
          <div
            onClick={() =>
              setBgSetting({ ...bgSetting, overlay: !bgSetting?.overlay })
            }
            className="flex items-center"
          >
            <span className="text-xs">دارای پوشش زمینه :</span>
            <Checkbox checked={bgSetting?.overlay} />
          </div>

          <div className="ml-2">
            {" "}
            <ColorModal
              label="رنگ پوشش زمینه :"
              color={bgSetting?.overlayColor || "#000"}
              setColor={(e) => setBgSetting({ ...bgSetting, overlayColor: e })}
              width={14}
              height={14}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col ">
        <span className="text-sm text-[#673AB7]"> موقعیت تصویر</span>
        <div className="border rounded-md grid grid-cols-3 mb-5">
          <Radio checked={checkBg(0)} onClick={() => handlePositions(0)} />
          <Radio checked={checkBg(1)} onClick={() => handlePositions(1)} />
          <Radio checked={checkBg(2)} onClick={() => handlePositions(2)} />
          <Radio checked={checkBg(3)} onClick={() => handlePositions(3)} />
          <Radio checked={checkBg(4)} onClick={() => handlePositions(4)} />
          <Radio checked={checkBg(5)} onClick={() => handlePositions(5)} />
          <Radio checked={checkBg(6)} onClick={() => handlePositions(6)} />
          <Radio checked={checkBg(7)} onClick={() => handlePositions(7)} />
          <Radio checked={checkBg(8)} onClick={() => handlePositions(8)} />
        </div>
        <NumberInput
          label=" وضوح تصویر "
          change={(e) => setBgSetting({ ...bgSetting, opacity: e })}
          value={bgSetting?.opacity}
          min={0}
          max={100}
        />
      </div>
    </div>
  );
};

export default React.memo(Background);
/*    <div className="grid md:grid-cols-3 gap-6 mt-6">
        <div className="flex flex-col gap3">
          <div>
            <span>موقعیت طولی تصویر :‌</span>
          </div>
          <div className="flex gap-2 items-center mt-4">
            <Box
              sx={{
                bgcolor:
                  bgSetting?.possitionY === "top" ? "#673AB7" : "transparent",
                color: bgSetting?.possitionY === "top" ? "white" : "initial",
              }}
              onClick={() => setBgSetting({ ...bgSetting, possitionY: "top" })}
              className="w-16 h-8 rounded-md border flex items-center justify-center text-xs cursor-pointer transition-all "
            >
              بالا
            </Box>
            <Box
              sx={{
                bgcolor:
                  bgSetting?.possitionY === "center"
                    ? "#673AB7"
                    : "transparent",
                color: bgSetting?.possitionY === "center" ? "white" : "initial",
              }}
              onClick={() =>
                setBgSetting({ ...bgSetting, possitionY: "center" })
              }
              className="w-16 h-8 rounded-md border flex items-center justify-center text-xs cursor-pointer transition-all "
            >
              وسط
            </Box>
            <Box
              sx={{
                bgcolor:
                  bgSetting?.possitionY === "bottom"
                    ? "#673AB7"
                    : "transparent",
                color: bgSetting?.possitionY === "bottom" ? "white" : "initial",
              }}
              onClick={() =>
                setBgSetting({ ...bgSetting, possitionY: "bottom" })
              }
              className="w-16 h-8 rounded-md border flex items-center justify-center text-xs cursor-pointer transition-all "
            >
              پایین
            </Box>
          </div>
        </div>
        <div className="flex flex-col  gap3">
          <div>
            <span>موقعیت عرضی تصویر :‌</span>
          </div>
          <div className="flex gap-2 items-center mt-4">
            <Box
              sx={{
                bgcolor:
                  bgSetting?.possitionX === "right" ? "#673AB7" : "transparent",
                color: bgSetting?.possitionX === "right" ? "white" : "initial",
              }}
              onClick={() =>
                setBgSetting({ ...bgSetting, possitionX: "right" })
              }
              className="w-16 h-8 rounded-md border flex items-center justify-center text-xs cursor-pointer transition-all "
            >
              راست
            </Box>
            <Box
              sx={{
                bgcolor:
                  bgSetting?.possitionX === "center"
                    ? "#673AB7"
                    : "transparent",
                color: bgSetting?.possitionX === "center" ? "white" : "initial",
              }}
              onClick={() =>
                setBgSetting({ ...bgSetting, possitionX: "center" })
              }
              className="w-16 h-8 rounded-md border flex items-center justify-center text-xs cursor-pointer transition-all "
            >
              وسط
            </Box>
            <Box
              sx={{
                bgcolor:
                  bgSetting?.possitionX === "left" ? "#673AB7" : "transparent",
                color: bgSetting?.possitionX === "left" ? "white" : "initial",
              }}
              onClick={() => setBgSetting({ ...bgSetting, possitionX: "left" })}
              className="w-16 h-8 rounded-md border flex items-center justify-center text-xs cursor-pointer transition-all "
            >
              چپ
            </Box>
          </div>
        </div>

        <div className="col-span-3 grid md:grid-cols-4 gap-4">
          <div className="max-w-[170px]">
            <NumberInput
              label=" وضوح "
              change={(e) => setBgSetting({ ...bgSetting, opacity: e })}
              value={bgSetting?.opacity}
              min={0}
              max={100}
            />
          </div>
        </div>
      </div> */
