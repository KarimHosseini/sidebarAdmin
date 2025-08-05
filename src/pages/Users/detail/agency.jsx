import {Button, CircularProgress, Switch} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import {Dropdown, TextInput} from "../../../components/common";
import axiosInstance from "../../../components/dataFetch/axiosInstance";
import {Confirm} from "../../../components/modals";
import {ADD_USER_AGENCY, baseUrl, EDIT_USER_AGENCY, REMOVE_USER_AGENCY,} from "../../../helpers/api-routes";
import {configReq} from "../../../helpers/functions";

const Agency = ({prevData, facility, editMode, hasDeleted}) => {
    const [loadingButton, setLoadingButton] = useState(false);
    const [loadingButton2, setLoadingButton2] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const {userPermissions} = useSelector((state) => state.relationals);

    const [data, setData] = useState({});
    const {token} = useSelector((state) => state.user);
    const {id} = useParams();
    useEffect(() => {
        setData({...prevData});
    }, [prevData]);
    const handleSumbit = () => {
        setLoadingButton(true);
        if (editMode) {
            axiosInstance
                .put(
                    `${baseUrl}/${EDIT_USER_AGENCY}`,
                    {...data, userId: id},
                    configReq(token)
                )
                .then((res) => {
                    setLoadingButton(false);
                    toast.success("با موفقیت ویرایش شد");
                    /*           setData(res.data.data);
                     */
                })
                .catch((err) => {
                    setLoadingButton(false);
                    toast.error(err.response?.data?.message);
                });
        } else {
            axiosInstance
                .post(
                    `${baseUrl}/${ADD_USER_AGENCY}`,
                    {...data, userId: id},
                    configReq(token)
                )
                .then((res) => {
                    setLoadingButton(false);
                    toast.success("با موفقیت ویرایش شد");
                    setData(res.data.data[res.data.data.length - 1]);
                })
                .catch((err) => {
                    setLoadingButton(false);
                    toast.error(err.response?.data?.message);
                });
        }
    };
    const handleDelete = () => {
        setLoadingButton2(true);
        axiosInstance
            .delete(
                `${baseUrl}/${REMOVE_USER_AGENCY}?id=${data.id}`,
                configReq(token)
            )
            .then((res) => {
                setLoadingButton2(false);
                setOpenDelete(false);
                toast.success("با موفقیت حذف شد");
                if (editMode) {
                    hasDeleted();
                } else {
                    setData({});
                }
            })
            .catch((err) => {
                setLoadingButton2(false);
                toast.error(err.response?.data?.message);
            });
    };
    return (
        <div>
            <div className="grid md:grid-cols-4 gap-3 items-center">
                <div className="flex justify-between items-center gap-2">
                    <span className="text-xs text-[#8094ae]"> فعال / غیر فعال:‌ </span>
                    <Switch
                        onClick={() => setData({...data, IsActive: !data?.IsActive})}
                        /*  color="success" */
                        checked={data?.IsActive}
                    />
                </div>
                <>
                    {" "}
                    <div className="flex justify-between items-center gap-2">
                        <span className="text-xs text-[#8094ae]"> شارژ کیف پول :‌ </span>
                        <Switch
                            onClick={() =>
                                setData({...data, chargeWallet: !data?.chargeWallet})
                            }
                            /*  color="success" */
                            checked={data?.chargeWallet}
                        />
                    </div>
                    <Dropdown
                        value={ENUM.find((item) => item.id === data.chargeType)}
                        change={(e) => setData({...data, chargeType: e.id})}
                        data={ENUM}
                        title=" نوع شارژ"
                    />{" "}
                    <Dropdown
                        value={facility.find((item) => item.id === data.FacilityId)}
                        change={(e) => setData({...data, FacilityId: e.id})}
                        data={facility}
                        title=" تسهیلات"
                    />{" "}
                    <TextInput
                        label=" کارمزد تسهیل گر"
                        change={(e) => setData({...data, FacilitatorWagePercent: e})}
                        currentValue={data.FacilitatorWagePercent || ""}
                        number
                        price
                        priceLabel="%"
                    />
                    <TextInput
                        label={`  کارمزد ${process.env.REACT_APP_COMPANY_TITLE} `}
                        change={(e) => setData({...data, CompanyWagePercent: e})}
                        currentValue={data.CompanyWagePercent || ""}
                        number
                    />
                    <TextInput
                        label="   کارمزد توسعه فروش نماینده"
                        change={(e) => setData({...data, SalesDevelopmentFee: e})}
                        currentValue={data.SalesDevelopmentFee || ""}
                        number
                        price
                        priceLabel="%"
                    />
                </>
            </div>
            <div className="flex justify-end items-center w-full mt-5 gap-3">
                {data.id && userPermissions?.AgentSetting?.delete && (
                    <Button
                        variant="contained"
                        onClick={() => setOpenDelete(true)}
                        color="error"
                    >
                        {loadingButton2 ? <CircularProgress/> : "  حذف"}
                    </Button>
                )}
                {userPermissions?.AgentSetting?.edit && (
                    <Button variant="outlined" onClick={handleSumbit}>
                        {loadingButton ? <CircularProgress/> : "  ثبت تغییرات"}
                    </Button>
                )}
            </div>

            <Confirm
                message="آیا از حذف این تنظیمات اطمینان دارید؟"
                close={() => setOpenDelete(false)}
                submit={handleDelete}
                open={openDelete}
            />
        </div>
    );
};

export default Agency;
const ENUM = [
    {id: 1, title: "شارژ کیف پول"},
    {id: 2, title: "پورسانت به نماینده"},
];
