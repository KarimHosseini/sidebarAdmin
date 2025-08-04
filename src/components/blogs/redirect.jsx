import { Box, Button } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Dropdown, Modal, TextInput } from "../../components/common";
const RedirectModal = ({
  prevData,
  setPrevData,
  name,
  close,
  open,
  deleteMode,
  handleDelete,
}) => {
  const [data, setData] = useState({
    type: 301,
    [name]: "/",
  });
  const { userPermissions } = useSelector((state) => state.relationals);

  const editItem = () => {
    setPrevData({ ...prevData, [name]: data[name], redirectType: data.type });

    if (deleteMode) {
      handleDelete({
        ...prevData,
        [name]: data[name],
        redirectType: data.type,
      });
    } else {
      toast.info(
        `ریدایرکت از نوع${
          STATUS.find((item) => item?.value === data.type).title
        }  با ثبت تغیرات انجام می شود`
      );

      close({
        ...prevData,
        [name]: data[name],
        redirectType: data.type,
      });
    }
  };
  return (
    <Modal close={close} open={open} title="redirect">
      {userPermissions?.redirect?.update ? (
        <>
          {" "}
          <div className="flex flex-col gap-3">
            {deleteMode && (
              <div>آیا از حذف اطمینان دارید نحو ریدایرکت را مشخص کنید</div>
            )}
            <div className="leftInput">
              {" "}
              <TextInput
                label="url مبدا"
                disabled
                currentValue={prevData[name]}
              />{" "}
            </div>
            <div className="leftInput">
              {" "}
              <TextInput
                label="url مقصد"
                change={(e) => {
                  if (!isEnglishUrl(e)) {
                    toast.error(
                      "آدرس فقط باید شامل کاراکترهای انگلیسی و مجاز URL باشد"
                    );
                    return;
                  }
                  setData({ ...data, [name]: e });
                }}
                currentValue={data[name]}
                name="url"
              />
            </div>
            <Dropdown
              title="نوع تغیر مسیر"
              data={STATUS}
              value={STATUS.find((item) => item?.value === data.type)}
              change={(e) => setData({ ...data, type: e.value })}
            />
            <Box sx={{ display: "flex" }}>
              <Button
                disabed={!data[name]}
                variant="contained"
                color="primary"
                onClick={editItem}
              >
                <>ثبت اطلاعات</>
              </Button>
            </Box>
          </div>
        </>
      ) : (
        <div className="text-center font-bold text-red-600">
          شما دسترسی به ویرایش نشانی یا حذف آن را ندارید{" "}
        </div>
      )}
    </Modal>
  );
};

export default RedirectModal;
var STATUS = [
  { value: 410, title: "صفحه ای یافت نشد  ۴۱۰" },
  { value: 307, title: "۳۰۷ تغیر مسیر موقت" },
  { value: 302, title: "۳۰۲ انتقال موقت" },
  { value: 301, title: "۳۰۱ انتقال دائم" },
];
const isEnglishUrl = (value) => {
  const urlRegex = /^[a-zA-Z0-9-._~:/?#\[\]@!$&'()*+,;=%]*$/;
  return urlRegex.test(value);
};
