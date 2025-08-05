/* eslint-disable react-hooks/exhaustive-deps */
import {Paper} from "@mui/material";
import {PageTitle} from "../../components/common";

const NotFound = () => {

    return (
        <>
            <PageTitle
                broadCrumb={[
                    {
                        title: "   تنظیمات",
                        path: "/companyInfo",
                    },

                ]}
                title="یافت نشد "
            />
            <div className="md:mx-3 mx-1">
                <Paper
                    sx={{border: "1px solid #dbdfea", mb: 1, padding: "15px 16px"}}
                    elevation={0}
                >
                    <div className={"text-center my-10"}>صفحه مورد نظر یافت نشد</div>
                </Paper>

            </div>
            {" "}

        </>
    );
};

export default NotFound;
   