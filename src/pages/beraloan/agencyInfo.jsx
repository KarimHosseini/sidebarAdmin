import {Paper} from "@mui/material";
import React from "react";
import {TextInput} from "../../components/common";

const AgencyInfo = ({reuqestDetail, setRequesDetail}) => {
    return (
        <div>
            {" "}
            <div className="md:mx-3 mx-1 ">
                <Paper sx={{border: "1px solid #dbdfea", mt: 2, px: 2}} elevation={0}>
                    <div className="grid md:grid-cols-4 gap-4 py-4">
                        <TextInput
                            disabled
                            currentValue={reuqestDetail.agentId}
                            label="   کد نماینده  "
                        />{" "}
                        <TextInput
                            disabled
                            currentValue={reuqestDetail.agentFullName}
                            label="     نام نماینده"
                        />{" "}
                        <TextInput
                            disabled
                            currentValue={
                                ENUM.find((item) => item.id === reuqestDetail.chargeType)
                                    ?.title || ""
                            }
                            label="     نوع تسویه نماینده"
                        />{" "}
                        {reuqestDetail.chargeType === 2 ? (
                            <>
                                <TextInput
                                    disabled
                                    currentValue={reuqestDetail.agentWage}
                                    label="     درصد پورسانت نماینده"
                                />{" "}
                                <TextInput
                                    disabled
                                    currentValue={reuqestDetail.agentWageAmount || ""}
                                    label="     مبلغ واریز شده پورسانت نماینده"
                                    price
                                    number
                                />{" "}
                            </>
                        ) : reuqestDetail.chargeType === 1 ? (
                            <>
                                {" "}
                                <TextInput
                                    disabled
                                    currentValue={reuqestDetail.wage}
                                    label={`    درصد کارمزد ${process.env.REACT_APP_COMPANY_TITLE} `}
                                />{" "}
                                <TextInput
                                    disabled
                                    currentValue={reuqestDetail.wageAmount || ""}
                                    label={`     مبلغ کسر کارمزد ${process.env.REACT_APP_COMPANY_TITLE} `}
                                    price
                                    number
                                />{" "}
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                </Paper>
            </div>
        </div>
    );
};

export default AgencyInfo;
const ENUM = [
    {id: 1, title: "شارژ کیف پول"},
    {id: 2, title: "پورسانت به نماینده"},
];
