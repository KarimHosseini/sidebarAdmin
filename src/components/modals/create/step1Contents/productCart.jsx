import { Paper, Switch } from "@mui/material";
import React from "react";
import ColorModal from "../../../common/colorModal";

const ProductsCarts = ({ data, setData }) => {
  return (
    <>
      {(data?.viewType?.id === 60 ||
        data?.viewType?.id === 61 ||
        data?.viewType?.id === 62 ||
        data?.viewType?.id === 63 ||
        data?.viewType?.id === 1) && (
        <Paper
          sx={{
            border: "1px solid #dbdfea",
            mb: 1,
            padding: "25px 16px 15px 16px",

            transition: "all 400ms ease",
          }}
          elevation={0}
          className="col-span-12 relative"
        >
          {" "}
          <div className="bg-[#198DFF] text-white flex justify-center items-center px-4 py-2 absolute -top-5 right-3 text-sm">
            تنظیمات کارت محصولات
          </div>
          <div className="md:grid grid-cols-6 gap-3">
            <div className="flex justify-between items-center">
              <span>نمایش پروموشن :‌</span>
              <Switch
                onChange={(e) =>
                  setData({ ...data, showPromotion: !data.showPromotion })
                }
                checked={data.showPromotion}
              />
            </div>
            <div className="flex justify-between items-center">
              <span>
                نمایش{" "}
                <a
                  className="mx-[1px] "
                  style={{ textDecoration: "underline" }}
                  href={"/companyInfo#9"}
                  target="_blank"
                  rel="noreferrer"
                >
                  آیکون{" "}
                </a>
                پرموشن :‌
              </span>
              <Switch
                onChange={(e) =>
                  setData({
                    ...data,
                    showPromotionIcon: !data.showPromotionIcon,
                  })
                }
                checked={data.showPromotionIcon}
              />
            </div>
            <div className="flex justify-between items-center">
              <span>نمایش شمارنده :‌</span>
              <Switch
                onChange={(e) =>
                  setData({ ...data, showCounter: !data.showCounter })
                }
                checked={data.showCounter}
              />
            </div>
            <div className="flex justify-between items-center">
              <span>نمایش عکس :‌</span>
              <Switch
                onChange={(e) => setData({ ...data, showImg: !data.showImg })}
                checked={data.showImg}
              />
            </div>
            <div className="flex justify-between items-center">
              <span>نمایش عنوان :‌</span>
              <Switch
                onChange={(e) =>
                  setData({ ...data, showProductTitle: !data.showProductTitle })
                }
                checked={data.showProductTitle}
              />
            </div>
            <div className="flex justify-between items-center">
              <span>نمایش رنگ ها :‌</span>
              <Switch
                onChange={(e) =>
                  setData({ ...data, showColor: !data.showColor })
                }
                checked={data.showColor}
              />
            </div>
            <div className="flex justify-between items-center">
              <span>نمایش امتیاز :‌</span>
              <Switch
                onChange={(e) =>
                  setData({ ...data, showScore: !data.showScore })
                }
                checked={data.showScore}
              />
            </div>
            <div className="flex justify-between items-center">
              <span>نمایش درصد تخفیف :‌</span>
              <Switch
                onChange={(e) =>
                  setData({ ...data, showPrecent: !data.showPrecent })
                }
                checked={data.showPrecent}
              />
            </div>
            <div className="flex justify-between items-center">
              <span>نمایش قیمت قدیم :‌</span>
              <Switch
                onChange={(e) =>
                  setData({ ...data, showOldPrice: !data.showOldPrice })
                }
                checked={data.showOldPrice}
              />
            </div>
            <div className="flex justify-between items-center">
              <span>نمایش آیکون تومن :‌</span>
              <Switch
                onChange={(e) =>
                  setData({ ...data, tomanIcon: !data.tomanIcon })
                }
                checked={data.tomanIcon}
              />
            </div>
            <div className="flex justify-between items-center">
              <span>نمایش آیکون ارسال :‌</span>
              <Switch
                onChange={(e) =>
                  setData({ ...data, showDelivery: !data.showDelivery })
                }
                checked={data.showDelivery}
              />
            </div>
            <div className="flex justify-between items-center">
              <span>نمایش قیمت :‌</span>
              <Switch
                onChange={(e) =>
                  setData({ ...data, showPrice: !data.showPrice })
                }
                checked={data.showPrice}
              />
            </div>{" "}
            <div className="flex justify-between items-center pl-3">
              <span className="min-w-max">ضخامت بردر پروموشن :‌</span>
              <input
                onChange={(e) =>
                  setData({
                    ...data,
                    borderBottomPromotion: e.target.value,
                  })
                }
                type="number"
                className="border rounded-md w-[50px]"
                value={data.borderBottomPromotion}
              />
            </div>{" "}
            <div className="flex items-center gap-2">
              <ColorModal
                label=" رنگ پس زمینه پروموشن"
                color={data?.promotionBg || "#FFA94D"}
                setColor={(e) => setData({ ...data, promotionBg: e })}
              />
            </div>{" "}
            <div className="flex items-center gap-2">
              <ColorModal
                label=" رنگ بردر زیر پروموشن"
                color={data?.borderBottomPromotionColor || "#FFA94D"}
                setColor={(e) =>
                  setData({ ...data, borderBottomPromotionColor: e })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <ColorModal
                label=" رنگ شمارنده"
                color={data?.counterColor || "#fff"}
                setColor={(e) => setData({ ...data, counterColor: e })}
              />
            </div>
          </div>
        </Paper>
      )}
    </>
  );
};

export default ProductsCarts;
