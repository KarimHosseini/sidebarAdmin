import { Paper } from "@mui/material";
import React from "react";
import { NumberInput } from "../../../common";
import ColorModal from "../../../common/colorModal";

const Borders = ({ data, setData, triger }) => {
  return (
    <Paper
      sx={{
        border: "1px solid #dbdfea",
        mb: 1,
        padding: "25px 16px 15px 16px",
        zIndex: triger[3] ? 1 : -1,
        transform: triger[3] ? "translateY(0)" : "translateY(-100%)",
      }}
      elevation={0}
      className="col-span-9 relative"
    >
      {" "}
      <div className="bg-[#198DFF] text-white flex justify-center items-center px-4 py-2 absolute -top-5 right-3 text-sm">
        تنظیمات فواصل و کادر دور
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="col-span-3">
          <span className="font-bold"> - تنظیمات دسکتاپ</span>
        </div>
        {(data?.viewType?.id === 6 ||
          data?.viewType?.id === 4 ||
          data?.viewType?.id === 15 ||
          data?.viewType?.id === 9 ||
          data?.viewType?.id === 31 ||
          data?.viewType?.id === 9 ||
          data?.viewType?.id === 61 ||
          data?.viewType?.id === 63 ||
          data?.viewType?.id === 11) && (
          <div className="grid md:grid-cols-2 border-l gap-2 pl-2 ml-2">
            <div className="flex flex-col gap-4">
              <NumberInput
                label="  تعداد ستون  دسکتاپ"
                change={(e) => {
                  setData({
                    ...data,
                    column: e /* , gridTemplateColumn: {} */,
                  });
                }}
                value={data?.column}
                min={0}
              />{" "}
            </div>
            <div className="flex flex-col gap-4">
              {" "}
              <NumberInput
                label=" فاصله عناصر دسکتاپ"
                change={(e) => setData({ ...data, gridGap: e })}
                value={data?.gridGap}
              />{" "}
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2 border-l ml-2 pl-2 border-dashed">
          <div className="ml-2 pl-2 border-dashed border-l flex flex-col pt-1">
            <ColorModal
              label=" رنگ ضخامت دور عنصر:"
              color={data?.elementBorderColor || "#e5e7eb"}
              setColor={(e) => setData({ ...data, elementBorderColor: e })}
            />
            <p className="text-[9px] m2-2">ضخامت دور عنصر</p>{" "}
            <div className="grid grid-cols-2 gap-1">
              <div className="w-full max-h-[30px]">
                <input
                  type="number"
                  min={0}
                  className="h-6 border w-full text-xs px-1"
                  onChange={(e) =>
                    setData({ ...data, elementBorderRight: e.target?.value })
                  }
                  value={data?.elementBorderRight}
                />
              </div>{" "}
              <div className="w-full max-h-[30px]">
                <input
                  type="number"
                  className="h-6 border w-full text-xs px-1"
                  onChange={(e) =>
                    setData({ ...data, elementBorderTop: e.target?.value })
                  }
                  value={data?.elementBorderTop}
                  min={0}
                />
              </div>
              <div className="w-full max-h-[30px]">
                <input
                  type="number"
                  min={0}
                  className="h-6 border w-full text-xs px-1"
                  onChange={(e) =>
                    setData({ ...data, elementBorderBottom: e.target?.value })
                  }
                  value={data?.elementBorderBottom}
                />
              </div>
              <div className="w-full max-h-[30px]">
                <input
                  type="number"
                  min={0}
                  className="h-6 border w-full text-xs px-1"
                  onChange={(e) =>
                    setData({ ...data, elementBorderLeft: e.target?.value })
                  }
                  value={data?.elementBorderLeft}
                />
              </div>
            </div>
            <div className="mt-[1px]">
              <span className="text-[9px]"> خمیدگی دور عنصر</span>
              <div className="grid grid-cols-2 gap-1">
                <div className="w-full max-h-[30px]">
                  <input
                    type="number"
                    min={0}
                    className="h-6 border w-full text-xs px-1"
                    onChange={(e) =>
                      setData({
                        ...data,
                        borderElementRaduisRight: e.target?.value,
                      })
                    }
                    value={data?.borderElementRaduisRight}
                  />
                </div>{" "}
                <div className="w-full max-h-[30px]">
                  <input
                    type="number"
                    min={0}
                    className="h-6 border w-full text-xs px-1"
                    onChange={(e) =>
                      setData({
                        ...data,
                        borderElementRaduisTop: e.target?.value,
                      })
                    }
                    value={data?.borderElementRaduisTop}
                  />
                </div>
                <div className="w-full max-h-[30px]">
                  <input
                    type="number"
                    min={0}
                    className="h-6 border w-full text-xs px-1"
                    onChange={(e) =>
                      setData({
                        ...data,
                        borderElementRaduisBottom: e.target?.value,
                      })
                    }
                    value={data?.borderElementRaduisBottom}
                  />
                </div>
                <div className="w-full max-h-[30px]">
                  <input
                    type="number"
                    min={0}
                    className="h-6 border w-full text-xs px-1"
                    onChange={(e) =>
                      setData({
                        ...data,
                        borderElementRaduisLeft: e.target?.value,
                      })
                    }
                    value={data?.borderElementRaduisLeft}
                  />
                </div>
              </div>
            </div>
          </div>
          <div lassName="ml-2 pl-2 border-dashed border-l flex flex-col pt-1">
            <ColorModal
              label=" رنگ ضخامت دور سکشن:"
              color={data?.borderSectionColor || "#e5e7eb"}
              setColor={(e) => setData({ ...data, borderSectionColor: e })}
            />
            <p className="text-[9px] mt-2"> ضخامت دور سکشن</p>
            <div className="grid grid-cols-2 gap-1">
              <div className="w-full max-h-[30px]">
                <input
                  type="number"
                  min={0}
                  className="h-6 border w-full text-xs px-1"
                  onChange={(e) =>
                    setData({ ...data, sectionBorderRight: e.target?.value })
                  }
                  value={data?.sectionBorderRight}
                />
              </div>{" "}
              <div className="w-full max-h-[30px]">
                <input
                  type="number"
                  min={0}
                  className="h-6 border w-full text-xs px-1"
                  onChange={(e) =>
                    setData({ ...data, sectionBorderTop: e.target?.value })
                  }
                  value={data?.sectionBorderTop}
                />
              </div>
              <div className="w-full max-h-[30px]">
                <input
                  type="number"
                  min={0}
                  className="h-6 border w-full text-xs px-1"
                  onChange={(e) =>
                    setData({ ...data, sectionBorderBottom: e.target?.value })
                  }
                  value={data?.sectionBorderBottom}
                />
              </div>
              <div className="w-full max-h-[30px]">
                <input
                  type="number"
                  min={0}
                  className="h-6 border w-full text-xs px-1"
                  onChange={(e) =>
                    setData({ ...data, sectionBorderLeft: e.target?.value })
                  }
                  value={data?.sectionBorderLeft}
                />
              </div>
            </div>{" "}
            <div>
              <span className="text-[9px]">خمیدگی دور سکشن</span>
              <div className="grid grid-cols-2 gap-1">
                <div className="w-full max-h-[30px]">
                  <input
                    type="number"
                    min={0}
                    className="h-6 border w-full text-xs px-1"
                    onChange={(e) =>
                      setData({
                        ...data,
                        borderSectionRaduisRight: e.target?.value,
                      })
                    }
                    value={data?.borderSectionRaduisRight}
                  />
                </div>{" "}
                <div className="w-full max-h-[30px]">
                  <input
                    type="number"
                    min={0}
                    className="h-6 border w-full text-xs px-1"
                    onChange={(e) =>
                      setData({
                        ...data,
                        borderSectionRaduisTop: e.target?.value,
                      })
                    }
                    value={data?.borderSectionRaduisTop}
                  />
                </div>
                <div className="w-full max-h-[30px]">
                  <input
                    type="number"
                    min={0}
                    className="h-6 border w-full text-xs px-1"
                    onChange={(e) =>
                      setData({
                        ...data,
                        borderSectionRaduisBottom: e.target?.value,
                      })
                    }
                    value={data?.borderSectionRaduisBottom}
                  />
                </div>
                <div className="w-full max-h-[30px]">
                  <input
                    type="number"
                    min={0}
                    className="h-6 border w-full text-xs px-1"
                    onChange={(e) =>
                      setData({
                        ...data,
                        borderSectionRaduisLeft: e.target?.value,
                      })
                    }
                    value={data?.borderSectionRaduisLeft}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-3">
            <div></div>
            <div>
              <input
                type="number"
                min={0}
                className="h-6 border w-full text-xs px-1"
                onChange={(e) =>
                  setData({ ...data, marginTop: e.target?.value })
                }
                value={data?.marginTop}
              />
            </div>
            <div></div>
          </div>
          <div className="grid grid-cols-3 border border-dashed gap-1 p-1 mt-2">
            <div></div>
            <div>
              <input
                type="number"
                min={0}
                className="h-6 border w-full text-xs px-1"
                onChange={(e) =>
                  setData({ ...data, paddingTop: e.target?.value })
                }
                value={data?.paddingTop}
              />
            </div>
            <div></div>
            <div>
              <input
                type="number"
                className="h-6 border w-full text-xs px-1"
                onChange={(e) =>
                  setData({ ...data, paddingRight: e.target?.value })
                }
                value={data?.paddingRight}
              />
            </div>
            <div className="flex items-center justify-center">
              <div className="text-[9px] text-center text-blue-600">
                padding
              </div>
            </div>
            <div>
              <input
                type="number"
                className="h-6 border w-full text-xs px-1"
                onChange={(e) =>
                  setData({ ...data, paddingLeft: e.target?.value })
                }
                value={data?.paddingLeft}
              />
            </div>
            <div></div>
            <div>
              {" "}
              <div>
                <input
                  type="number"
                  className="h-6 border w-full text-xs px-1"
                  onChange={(e) =>
                    setData({ ...data, paddingBottom: e.target?.value })
                  }
                  value={data?.paddingBottom}
                />
              </div>
            </div>
            <div></div>
          </div>
          <div className="grid grid-cols-3 mt-2">
            <div></div>
            <div>
              <input
                type="number"
                className="h-6 border w-full text-xs px-1"
                onChange={(e) =>
                  setData({ ...data, marginBottom: e.target?.value })
                }
                value={data?.marginBottom}
              />
            </div>
            <div></div>
          </div>
        </div>

        {/*  ---------------- for mobile ---------------------- */}
        <div className="col-span-3 md:grid grid-cols-3 gap-4 border-t border-dashed mt-3 pt-3">
          <div className="col-span-3">
            <span className="font-bold"> - تنظیمات موبایل</span>
          </div>
          {(data?.viewType?.id === 6 ||
            data?.viewType?.id === 4 ||
            data?.viewType?.id === 15 ||
            data?.viewType?.id === 9 ||
            data?.viewType?.id === 31 ||
            data?.viewType?.id === 9 ||
            data?.viewType?.id === 61 ||
            data?.viewType?.id === 63 ||
            data?.viewType?.id === 11) && (
            <div className="grid md:grid-cols-2 border-l gap-2 pl-2 ml-2">
              <div className="flex flex-col gap-4">
                <NumberInput
                  label="  تعداد ستون  موبایل"
                  change={(e) => {
                    setData({
                      ...data,
                      columnMobile: e /* , gridTemplateColumnMobile: {} */,
                    });
                  }}
                  value={data?.columnMobile}
                  min={0}
                />{" "}
              </div>
              <div className="flex flex-col gap-4">
                <NumberInput
                  label=" فاصله عناصر موبایل"
                  change={(e) => setData({ ...data, gridGapMobile: e })}
                  value={data?.gridGapMobile}
                />
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2 border-l ml-2 pl-2 border-dashed">
            <div className="ml-2 pl-2 border-dashed border-l flex flex-col pt-1">
              <ColorModal
                label=" رنگ ضخامت دور عنصر:"
                color={data?.elementBorderColorMobile || "#e5e7eb"}
                setColor={(e) =>
                  setData({ ...data, elementBorderColorMobile: e })
                }
              />
              <p className="text-[9px] m2-2">ضخامت دور عنصر</p>{" "}
              <div className="grid grid-cols-2 gap-1">
                <div className="w-full max-h-[30px]">
                  <input
                    type="number"
                    min={0}
                    className="h-6 border w-full text-xs px-1"
                    onChange={(e) =>
                      setData({
                        ...data,
                        elementBorderRightMobile: e.target?.value,
                      })
                    }
                    value={data?.elementBorderRightMobile}
                  />
                </div>{" "}
                <div className="w-full max-h-[30px]">
                  <input
                    type="number"
                    className="h-6 border w-full text-xs px-1"
                    onChange={(e) =>
                      setData({
                        ...data,
                        elementBorderTopMobile: e.target?.value,
                      })
                    }
                    value={data?.elementBorderTopMobile}
                    min={0}
                  />
                </div>
                <div className="w-full max-h-[30px]">
                  <input
                    type="number"
                    min={0}
                    className="h-6 border w-full text-xs px-1"
                    onChange={(e) =>
                      setData({
                        ...data,
                        elementBorderBottomMobile: e.target?.value,
                      })
                    }
                    value={data?.elementBorderBottomMobile}
                  />
                </div>
                <div className="w-full max-h-[30px]">
                  <input
                    type="number"
                    min={0}
                    className="h-6 border w-full text-xs px-1"
                    onChange={(e) =>
                      setData({
                        ...data,
                        elementBorderLeftMobile: e.target?.value,
                      })
                    }
                    value={data?.elementBorderLeftMobile}
                  />
                </div>
              </div>
              <div className="mt-[1px]">
                <span className="text-[9px]"> خمیدگی دور عنصر</span>
                <div className="grid grid-cols-2 gap-1">
                  <div className="w-full max-h-[30px]">
                    <input
                      type="number"
                      min={0}
                      className="h-6 border w-full text-xs px-1"
                      onChange={(e) =>
                        setData({
                          ...data,
                          borderElementRaduisRightMobile: e.target?.value,
                        })
                      }
                      value={data?.borderElementRaduisRightMobile}
                    />
                  </div>{" "}
                  <div className="w-full max-h-[30px]">
                    <input
                      type="number"
                      min={0}
                      className="h-6 border w-full text-xs px-1"
                      onChange={(e) =>
                        setData({
                          ...data,
                          borderElementRaduisTopMobile: e.target?.value,
                        })
                      }
                      value={data?.borderElementRaduisTopMobile}
                    />
                  </div>
                  <div className="w-full max-h-[30px]">
                    <input
                      type="number"
                      min={0}
                      className="h-6 border w-full text-xs px-1"
                      onChange={(e) =>
                        setData({
                          ...data,
                          borderElementRaduisBottomMobile: e.target?.value,
                        })
                      }
                      value={data?.borderElementRaduisBottomMobile}
                    />
                  </div>
                  <div className="w-full max-h-[30px]">
                    <input
                      type="number"
                      min={0}
                      className="h-6 border w-full text-xs px-1"
                      onChange={(e) =>
                        setData({
                          ...data,
                          borderElementRaduisLeftMobile: e.target?.value,
                        })
                      }
                      value={data?.borderElementRaduisLeftMobile}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div lassName="ml-2 pl-2 border-dashed border-l flex flex-col pt-1">
              <ColorModal
                label=" رنگ ضخامت دور سکشن:"
                color={data?.borderSectionColorMobile || "#e5e7eb"}
                setColor={(e) =>
                  setData({ ...data, borderSectionColorMobile: e })
                }
              />
              <p className="text-[9px] mt-2"> ضخامت دور سکشن</p>
              <div className="grid grid-cols-2 gap-1">
                <div className="w-full max-h-[30px]">
                  <input
                    type="number"
                    min={0}
                    className="h-6 border w-full text-xs px-1"
                    onChange={(e) =>
                      setData({
                        ...data,
                        sectionBorderRightMobile: e.target?.value,
                      })
                    }
                    value={data?.sectionBorderRightMobile}
                  />
                </div>{" "}
                <div className="w-full max-h-[30px]">
                  <input
                    type="number"
                    min={0}
                    className="h-6 border w-full text-xs px-1"
                    onChange={(e) =>
                      setData({
                        ...data,
                        sectionBorderTopMobile: e.target?.value,
                      })
                    }
                    value={data?.sectionBorderTopMobile}
                  />
                </div>
                <div className="w-full max-h-[30px]">
                  <input
                    type="number"
                    min={0}
                    className="h-6 border w-full text-xs px-1"
                    onChange={(e) =>
                      setData({
                        ...data,
                        sectionBorderBottomMobile: e.target?.value,
                      })
                    }
                    value={data?.sectionBorderBottomMobile}
                  />
                </div>
                <div className="w-full max-h-[30px]">
                  <input
                    type="number"
                    min={0}
                    className="h-6 border w-full text-xs px-1"
                    onChange={(e) =>
                      setData({
                        ...data,
                        sectionBorderLeftMobile: e.target?.value,
                      })
                    }
                    value={data?.sectionBorderLeftMobile}
                  />
                </div>
              </div>{" "}
              <div>
                <span className="text-[9px]">خمیدگی دور سکشن</span>
                <div className="grid grid-cols-2 gap-1">
                  <div className="w-full max-h-[30px]">
                    <input
                      type="number"
                      min={0}
                      className="h-6 border w-full text-xs px-1"
                      onChange={(e) =>
                        setData({
                          ...data,
                          borderSectionRaduisRightMobile: e.target?.value,
                        })
                      }
                      value={data?.borderSectionRaduisRightMobile}
                    />
                  </div>{" "}
                  <div className="w-full max-h-[30px]">
                    <input
                      type="number"
                      min={0}
                      className="h-6 border w-full text-xs px-1"
                      onChange={(e) =>
                        setData({
                          ...data,
                          borderSectionRaduisTopMobile: e.target?.value,
                        })
                      }
                      value={data?.borderSectionRaduisTopMobile}
                    />
                  </div>
                  <div className="w-full max-h-[30px]">
                    <input
                      type="number"
                      min={0}
                      className="h-6 border w-full text-xs px-1"
                      onChange={(e) =>
                        setData({
                          ...data,
                          borderSectionRaduisBottomMobile: e.target?.value,
                        })
                      }
                      value={data?.borderSectionRaduisBottomMobile}
                    />
                  </div>
                  <div className="w-full max-h-[30px]">
                    <input
                      type="number"
                      min={0}
                      className="h-6 border w-full text-xs px-1"
                      onChange={(e) =>
                        setData({
                          ...data,
                          borderSectionRaduisLeftMobile: e.target?.value,
                        })
                      }
                      value={data?.borderSectionRaduisLeftMobile}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-3">
              <div></div>
              <div>
                <input
                  type="number"
                  min={0}
                  className="h-6 border w-full text-xs px-1"
                  onChange={(e) =>
                    setData({ ...data, marginTopMobile: e.target?.value })
                  }
                  value={data?.marginTopMobile}
                />
              </div>
              <div></div>
            </div>
            <div className="grid grid-cols-3 border border-dashed gap-1 p-1 mt-2">
              <div></div>
              <div>
                <input
                  type="number"
                  min={0}
                  className="h-6 border w-full text-xs px-1"
                  onChange={(e) =>
                    setData({ ...data, paddingTopMobile: e.target?.value })
                  }
                  value={data?.paddingTopMobile}
                />
              </div>
              <div></div>
              <div>
                <input
                  type="number"
                  className="h-6 border w-full text-xs px-1"
                  onChange={(e) =>
                    setData({ ...data, paddingRightMobile: e.target?.value })
                  }
                  value={data?.paddingRightMobile}
                />
              </div>
              <div className="flex items-center justify-center">
                <div className="text-[9px] text-center text-blue-600">
                  padding
                </div>
              </div>
              <div>
                <input
                  type="number"
                  className="h-6 border w-full text-xs px-1"
                  onChange={(e) =>
                    setData({ ...data, paddingLeftMobile: e.target?.value })
                  }
                  value={data?.paddingLeftMobile}
                />
              </div>
              <div></div>
              <div>
                {" "}
                <div>
                  <input
                    type="number"
                    className="h-6 border w-full text-xs px-1"
                    onChange={(e) =>
                      setData({ ...data, paddingBottomMobile: e.target?.value })
                    }
                    value={data?.paddingBottomMobile}
                  />
                </div>
              </div>
              <div></div>
            </div>
            <div className="grid grid-cols-3 mt-2">
              <div></div>
              <div>
                <input
                  type="number"
                  className="h-6 border w-full text-xs px-1"
                  onChange={(e) =>
                    setData({ ...data, marginBottomMobile: e.target?.value })
                  }
                  value={data?.marginBottomMobile}
                />
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default Borders;
