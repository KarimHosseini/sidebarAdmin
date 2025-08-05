import { Grid } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { TextInput } from "../../components/common";

const Social = ({ data, setData }) => {
  const { userPermissions } = useSelector((state) => state.relationals);

  return (
    <Grid container gap={3}>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <TextInput
          label="لینک واتساپ "
          ltr
          currentValue={data?.socialAddress1}
          change={(e) => setData({ ...data, socialAddress1: e })}
          disabled={!userPermissions?.companyInfo?.update}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <TextInput
          label="لینک تلگرام "
          ltr
          currentValue={data?.socialAddress2}
          change={(e) => setData({ ...data, socialAddress2: e })}
          disabled={!userPermissions?.companyInfo?.update}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <TextInput
          label="لینک اینستاگرام "
          ltr
          currentValue={data?.socialAddress3}
          change={(e) => setData({ ...data, socialAddress3: e })}
          disabled={!userPermissions?.companyInfo?.update}
        />
      </Grid>
    </Grid>
  );
};

export default Social;
