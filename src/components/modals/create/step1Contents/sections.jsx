import {Box, Paper, Switch} from "@mui/material";
import React from "react";
import {Dropdown, NumberInput, TextInput} from "../../../common";
import ColorModal from "../../../common/colorModal";

const Sections = ({data, setData, triger, GRID_NO, editMode}) => {
    return (
        <Paper
            sx={{
                border: "1px solid #dbdfea",
                mb: 1,
                padding: "25px 16px 15px 16px",
                zIndex: triger[3] ? 1 : -1,
                transform: triger[3] ? "translateY(0)" : "translateY(-100%)",
                transition: "all 400ms ease",
            }}
            elevation={0}
            className="col-span-3 relative"
        >
            {" "}
            <div
                className="bg-[#198DFF] text-white flex justify-center items-center px-4 py-2 absolute -top-5 right-3 text-sm">
                تنظیمات سکشن
            </div>
            <div className="grid grid-cols-2">
                <div className="ml-2 pl-2 border-l border-dashed flex flex-col gap-4">
                    <Dropdown
                        value={GRID_NO.find((item) => item?.id === data?.gridNumber?.id)}
                        change={(e) => setData({...data, gridNumber: e})}
                        data={GRID_NO}
                        title=" عرض سکشن"
                    />
                    <Box className="flex items-center gap-2">
                        {" "}
                        <span className="text-xs"> داخل کانتینر:</span>{" "}
                        <Switch
                            checked={data?.hasContainer}
                            size="small"
                            onChange={() =>
                                setData({...data, hasContainer: !data?.hasContainer})
                            }
                        />{" "}
                    </Box>
                    <Box className="flex items-center gap-2">
                        <span className="text-xs">معکوس کردن رنگ : </span>
                        <Switch
                            checked={data?.invert}
                            size="small"
                            onChange={() =>
                                setData({
                                    ...data,
                                    invert: !data?.invert,
                                })
                            }
                        />{" "}
                    </Box>

                    <TextInput label={"نام کلاس"} currentValue={data?.className} change={(e) =>
                        setData({
                            ...data,
                            className: e
                        })
                    }/>
                </div>

                <div className="flex flex-col gap-4">
                    {" "}
                    {data?.filter?.id !== "5" && data?.filter?.id !== "8" && (
                        <>
                            <NumberInput
                                label="  تعداد کل عناصر		"
                                change={(e) => setData({...data, showCaseLimit: e})}
                                value={data?.showCaseLimit}
                                disabled={editMode && data?.viewType?.id === 20}
                            />
                        </>
                    )}
                    {(data?.viewType?.id === 1 ||
                        data?.viewType?.id === 2 ||
                        data?.viewType?.id === 5 ||
                        data?.viewType?.id === 14 ||
                        data?.viewType?.id === 7 ||
                        data?.viewType?.id === 60 ||
                        data?.viewType?.id === 62 ||
                        data?.viewType?.id === 8) && (
                        <>
                            {" "}
                            <NumberInput
                                /*   disabled={editMode} */
                                label="تعداد عناصر نمایشی"
                                change={(e) => setData({...data, carouselNumber: e})}
                                value={data?.carouselNumber}
                            />
                        </>
                    )}
                    <div className="flex items-center gap-2">
                        <ColorModal
                            label=" رنگ سایه"
                            color={data?.shadow || "#000"}
                            setColor={(e) => setData({...data, shadow: e})}
                        />
                    </div>
                </div>
            </div>
        </Paper>
    );
};

export default Sections;
