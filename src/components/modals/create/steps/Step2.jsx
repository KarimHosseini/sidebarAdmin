import React from 'react';
import { Tab, Tabs } from '@mui/material';
import { ColorInput } from '../../../common';
import Background from '../components/step2/Background';

const Step2 = ({
  data,
  setData,
  backgroundConfig: {
    desktop: {
      avatar,
      setAvatar,
      selectedImage,
      setSelectedImage,
      settings,
      setSettings,
      setNeedPreview,
    },
    mobile: {
      avatar: avatarM,
      setAvatar: setAvatarM,
      selectedImage: selectedImageM,
      setSelectedImage: setSelectedImageM,
      settings: settingsM,
      setSettings: setSettingsM,
      setNeedPreview: setNeedPreviewM,
    },
  },
  tabConfig: {
    value: valueTab,
    onChange: handleChange,
  },
  onRemove,
}) => {
  const getImageId = (selectedImage) => 
    data?.gallery?.find(item => item.galleryId === selectedImage)?.id;

  return (
    <div className="col-span-3">
      <Tabs
        value={valueTab}
        onChange={handleChange}
        aria-label="background configuration tabs"
        sx={{
          flexGrow: 1,
          height: "3.07rem",
          minHeight: "40px !important",
          ".MuiTab-root": {
            minHeight: "40px !important",
            background: "#BDBDBD",
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px",
          },
          ".Mui-selected": {
            background: (theme) => theme.palette.primary.main + "!important",
            color: "#fff !important",
          },
          background: (theme) => theme.palette.background.default,
        }}
      >
        <Tab label="رنگ" />
        <Tab label="تصویر" />
      </Tabs>

      {valueTab === 1 ? (
        <div className="grid md:grid-cols-2 px-3 gap-3">
          <Background
            avatar={avatar}
            setAvatar={setAvatar}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            settings={settings}
            setSettings={setSettings}
            setNeedPreview={setNeedPreview}
            id={getImageId(selectedImage)}
            onRemove={() => onRemove("desktop")}
          />
          <Background
            avatar={avatarM}
            setAvatar={setAvatarM}
            selectedImage={selectedImageM}
            setSelectedImage={setSelectedImageM}
            settings={settingsM}
            setSettings={setSettingsM}
            setNeedPreview={setNeedPreviewM}
            id={getImageId(selectedImageM)}
            onRemove={() => onRemove("mobile")}
          />
        </div>
      ) : (
        <div className="w-full flex flex-col items-center gap-2 p-4">
          <ColorInput
            label="رنگ پس زمینه"
            value={data.backgroundColor || "rgba(255,255,255,0)"}
            onChange={(color) => setData({ ...data, backgroundColor: color })}
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(Step2);
