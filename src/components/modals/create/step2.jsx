import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import {
  baseUrl,
  DELETE_SHOWCASE_IMAGE,
  DOWNLOAD_FILE,
} from "../../../helpers/api-routes";
import { ColorInput, NumberInput, UploadImage } from "../../common";
import ColorModal from "../../common/colorModal";

const fadeAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

const Step2ShowCase = ({
  data,
  setData,
  backgroundConfig,
  updateBackgroundConfig,
  valueTab,
  setValueTab,
}) => {
  const handleBackgroundChange = (type, settings) => {
    updateBackgroundConfig({
      ...backgroundConfig,
      [type]: {
        ...backgroundConfig[type],
        ...settings,
      },
    });
  };

  const handlePositions = (type, value) => {
    const positions = {
      0: { possitionY: "top", possitionX: "right" },
      1: { possitionY: "top", possitionX: "center" },
      2: { possitionY: "top", possitionX: "left" },
      3: { possitionY: "center", possitionX: "right" },
      4: { possitionY: "center", possitionX: "center" },
      5: { possitionY: "center", possitionX: "left" },
      6: { possitionY: "bottom", possitionX: "right" },
      7: { possitionY: "bottom", possitionX: "center" },
      8: { possitionY: "bottom", possitionX: "left" },
    };

    handleBackgroundChange(type, {
      settings: {
        ...backgroundConfig[type].settings,
        ...positions[value],
      },
    });
  };

  const checkBgPosition = (type, value) => {
    const settings = backgroundConfig[type]?.settings || {};
    const positions = {
      0: settings.possitionY === "top" && settings.possitionX === "right",
      1: settings.possitionY === "top" && settings.possitionX === "center",
      2: settings.possitionY === "top" && settings.possitionX === "left",
      3: settings.possitionY === "center" && settings.possitionX === "right",
      4: settings.possitionY === "center" && settings.possitionX === "center",
      5: settings.possitionY === "center" && settings.possitionX === "left",
      6: settings.possitionY === "bottom" && settings.possitionX === "right",
      7: settings.possitionY === "bottom" && settings.possitionX === "center",
      8: settings.possitionY === "bottom" && settings.possitionX === "left",
    };
    return positions[value] || false;
  };
  const renderBackgroundSection = (type) => {
    const settings = backgroundConfig[type]?.settings || {};
    const title = type === "desktop" ? "دسکتاپ" : "موبایل";

    const convertFileToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        if (!file) {
          resolve(null);
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () =>
          reject(new Error("Failed to convert file to Base64"));
        reader.readAsDataURL(file);
      });
    };

    return (
      <motion.div className="space-y-4" {...fadeAnimation}>
        <h3 className="text-lg font-medium text-gray-800">
          تصویر پس زمینه {title}
        </h3>
        <div className="p-6 rounded-lg border">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col space-y-4">
              <Paper elevation={1} className="p-4 h-full rounded-lg">
                <UploadImage
                  file={backgroundConfig[type].avatar}
                  change={async (file) => {
                    const base64Image = await convertFileToBase64(file);
                    handleBackgroundChange(type, {
                      avatar: file,
                      selectedImage: base64Image,
                    });
                  }}
                  selectedProductImage={
                    backgroundConfig[type].selectedProductImage
                  }
                  setselectedProductImage={(image) =>
                    handleBackgroundChange(type, {
                      selectedProductImage: image,
                      selectedImage: `${baseUrl}/${DOWNLOAD_FILE}/${image}`,
                    })
                  }
                  setNeedPreview={(preview) =>
                    handleBackgroundChange(type, { needPreview: preview })
                  }
                  needPreview
                  id={backgroundConfig[type]?.id}
                  removeApi={DELETE_SHOWCASE_IMAGE}
                  hasRemoved={() => {
                    handleBackgroundChange(type, {
                      selectedImage: null,
                      selectedProductImage: null,
                    });
                  }}
                />
              </Paper>
              <Paper elevation={1} className="p-4 h-full rounded-lg">
                <div className="text-sm text-gray-700 mb-2">پهنای تصویر</div>
                <FormControl
                  sx={{
                    ".MuiTypography-root": {
                      fontSize: "0.875rem",
                    },
                  }}
                >
                  <RadioGroup>
                    <FormControlLabel
                      onClick={() =>
                        handleBackgroundChange(type, {
                          settings: { ...settings, size: "contain" },
                        })
                      }
                      control={
                        <Radio
                          size="small"
                          checked={settings.size === "contain"}
                        />
                      }
                      label="اندازه تمام تصویر"
                    />
                    <FormControlLabel
                      onClick={() =>
                        handleBackgroundChange(type, {
                          settings: { ...settings, size: "cover" },
                        })
                      }
                      control={
                        <Radio
                          size="small"
                          checked={settings.size === "cover"}
                        />
                      }
                      label="پوشش تمام عرض صفحه"
                    />
                  </RadioGroup>
                </FormControl>
              </Paper>
            </div>

            <div className="flex flex-col space-y-4">
              <Paper elevation={1} className="p-4 rounded-lg">
                <div className="text-sm font-medium text-[#673AB7] mb-3">
                  تنظیمات نمایشی
                </div>
                <div className="space-y-2">
                  <CheckboxOption
                    label="نمایش به صورت پارالکس"
                    checked={settings.parallex}
                    onChange={() =>
                      handleBackgroundChange(type, {
                        settings: { ...settings, parallex: !settings.parallex },
                      })
                    }
                  />
                  <CheckboxOption
                    label="دارای تکرار"
                    checked={settings.repeat}
                    onChange={() =>
                      handleBackgroundChange(type, {
                        settings: { ...settings, repeat: !settings.repeat },
                      })
                    }
                  />
                  <CheckboxOption
                    label="عکس داخل کانتینر"
                    checked={settings.inContainer}
                    onChange={() =>
                      handleBackgroundChange(type, {
                        settings: {
                          ...settings,
                          inContainer: !settings.inContainer,
                        },
                      })
                    }
                  />
                  <CheckboxOption
                    label="دارای پوشش زمینه"
                    checked={settings.overlay}
                    onChange={() =>
                      handleBackgroundChange(type, {
                        settings: { ...settings, overlay: !settings.overlay },
                      })
                    }
                  />
                  <div className="mt-3 pr-2">
                    <ColorModal
                      label="رنگ پوشش زمینه"
                      color={settings.overlayColor || "#000"}
                      setColor={(color) =>
                        handleBackgroundChange(type, {
                          settings: { ...settings, overlayColor: color },
                        })
                      }
                      width={14}
                      height={14}
                    />
                  </div>
                </div>
              </Paper>
            </div>

            <div className="flex flex-col space-y-4">
              <Paper elevation={1} className="p-4 h-full rounded-lg">
                <div className="text-sm font-medium text-[#673AB7] mb-3">
                  موقعیت تصویر
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[...Array(9)].map((_, index) => (
                    <div
                      key={index}
                      className="flex justify-center items-center"
                    >
                      <Radio
                        checked={checkBgPosition(type, index)}
                        onClick={() => handlePositions(type, index)}
                        size="small"
                      />
                    </div>
                  ))}
                </div>
                <NumberInput
                  label="وضوح تصویر"
                  change={(value) =>
                    handleBackgroundChange(type, {
                      settings: { ...settings, opacity: value },
                    })
                  }
                  value={settings.opacity}
                  min={0}
                  max={100}
                />
              </Paper>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const CheckboxOption = ({ label, checked, onChange }) => (
    <div
      className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-50 cursor-pointer"
      onClick={onChange}
    >
      <span className="text-sm text-gray-700">{label}</span>
      <Checkbox checked={checked} size="small" />
    </div>
  );

  return (
    <div className="w-full">
      <Tabs
        value={valueTab}
        onChange={(e, newValue) => setValueTab(newValue)}
        aria-label="background options"
        sx={{
          flexGrow: 1,
          height: "3.07rem",
          minHeight: "40px !important",
          ".MuiTab-root": {
            minHeight: "40px !important",
            background: "#BDBDBD",
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px",
            fontWeight: 500,
          },
          ".Mui-selected": {
            background: (theme) => theme.palette.primary.main + "!important",
            color: "#fff !important",
          },
          background: (theme) => theme.palette.background.default,
        }}
      >
        <Tab label="رنگ" value={0} />
        <Tab label="تصویر" value={1} />
      </Tabs>

      <AnimatePresence mode="wait">
        {valueTab === 1 ? (
          <motion.div
            className="space-y-8 p-6"
            key="image-tab"
            {...fadeAnimation}
          >
            {renderBackgroundSection("desktop")}
            {renderBackgroundSection("mobile")}
          </motion.div>
        ) : (
          <motion.div className="p-6" key="color-tab" {...fadeAnimation}>
            <div className="grid md:grid-cols-2 gap-6">
              <ColorSection
                title="تنظیمات رنگ دسکتاپ"
                type="desktop"
                settings={backgroundConfig.desktop.settings}
                handleBackgroundChange={handleBackgroundChange}
              />
              <ColorSection
                title="تنظیمات رنگ موبایل"
                type="mobile"
                settings={backgroundConfig.mobile.settings}
                handleBackgroundChange={handleBackgroundChange}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ColorSection = ({ title, type, settings, handleBackgroundChange }) => (
  <Paper elevation={2} className="p-6 rounded-lg space-y-4">
    <h3 className="text-lg font-medium text-gray-800">{title}</h3>
    <div className="space-y-4">
      <ColorInput
        color={settings?.color || "#ffffff"}
        hasName={false}
        setColor={(color) =>
          handleBackgroundChange(type, {
            settings: {
              ...settings,
              color,
            },
          })
        }
        label="رنگ پس زمینه"
      />
      <div
        className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-50 cursor-pointer"
        onClick={() =>
          handleBackgroundChange(type, {
            settings: {
              ...settings,
              inContainer: !settings?.inContainer,
            },
          })
        }
      >
        <span className="text-sm text-gray-700">بک گراند کانتینر</span>
        <Checkbox checked={settings?.inContainer} size="small" />
      </div>
      <div
        className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-50 cursor-pointer"
        onClick={() =>
          handleBackgroundChange(type, {
            settings: {
              ...settings,
              invert: !settings?.invert,
            },
          })
        }
      >
        <span className="text-sm text-gray-700">معکوس کردن رنگ متن ها</span>
        <Checkbox checked={settings?.invert} size="small" />
      </div>
    </div>
  </Paper>
);

export default React.memo(Step2ShowCase);
