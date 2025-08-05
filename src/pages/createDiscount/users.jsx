import { Box, Button, Grid, Pagination, Paper, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import React from "react";
import { Checkbox, Dropdown, TextInput } from "../../components/common";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
const Users = ({
  data,
  resetUserFilter,
  limit,
  setLimit,
  setApplySearch,
  setsearch,
  search,
  selectedUser,
  setUserChoosen,
  setPage,
  page,
  selectedAll,
  nextStep,
  setSelectedAll,
}) => {
  return (
    <div>
      {" "}
      <Paper elevation={0}  className=" rounded-sm py-6 mb-5">
        <div className="flex justify-between gap-4 flex-wrap items-center border-b-2 pb-4 mb-4 border-dashed">
          <div className="flex items-center">
            <span className="text-base font-semibold  pl-4 ml-4 border-l">
              نتایج جستجو :{" "}
            </span>

            <span className="text-xs text-[#8c8c8c] ml-4">تعداد نتایج:</span>
            <span className="text-sm ">
              {data?.meta?.total} تنوع
            </span>
          </div>
          <div>
            <Checkbox
              checked={selectedAll}
              label="  اعمال بر روی همه کاربران"
              change={setSelectedAll}
            />
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={resetUserFilter}
              variant="outlined"
              color="success"
            >
              <RestartAltIcon />
              ریست فیلتر
            </Button>
          </div>
        </div>
        <Box
          sx={{ label: { marginTop: "0 !important" } }}
          className="grid md:grid-cols-4 py-5  md:px-3 gap-4"
        >
          <Dropdown
            title="تعداد موارد"
            data={[5, 10, 15, 20, 30, 50]}
            value={limit}
            change={setLimit}
          />
          <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">جستجو</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              value={search}
              onChange={(e) => setsearch(e.target.value)}
              endAdornment={
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setApplySearch(search)}
                  >
                    جستجو
                  </Button>
                </>
              }
              label="Password"
            />
          </FormControl>
        </Box>
      </Paper>
      <Grid sx={{ mt: 4 }} container spacing={2}>
        {data?.data?.map((item, index) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
            {" "}
            <Box
              sx={{
                overflow: "none",
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                pt: "20px",
                borderRadius: "10px",
                cursor: "pointer",
                px: 2,
                backgroundColor: theme => 
                  selectedUser?.id === item.id || selectedAll
                    ? "#b7e8fd75"
                    : theme.palette.mode === "light" ? "white" : theme.palette.background.paper,
              }}
              key={index}
              onClick={() => {
                setSelectedAll(false);
                setUserChoosen(item);
              }}
              className="border rounded-sm pb-5 biggerInput"
            >
              {" "}
              <TextInput
                label="  نام و نام خانوادگی"
                disabled
                currentValue={item?.fname + " " + item?.lname}
              />
              <TextInput
                label=" شماره همراه"
                disabled
                currentValue={item?.mobile}
              />
            </Box>{" "}
          </Grid>
        ))}
      </Grid>
      {data?.meta?.total_pages > 1 && (
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Pagination
            count={data?.meta?.total_pages}
            variant="outlined"
            page={page}
            onChange={(_e, value) => {
              setPage(value);
            }}
            sx={{ my: 2 }}
          />
        </Box>
      )}
    </div>
  );
};

export default Users;
