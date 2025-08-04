/* eslint-disable react-hooks/exhaustive-deps */
import { Login as LoginIcon, SystemUpdate } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { baseUrl, LOGIN, SEND_CODE } from "../helpers/api-routes";
import { configReq } from "../helpers/functions";
import { login } from "../redux/slices/user";
import { TextInput } from "./common";
import axiosInstance from "./dataFetch/axiosInstance";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  const sendCode = () => {
    setLoading(true);
    const data = {
      mobile: phoneNumber,
    };
    axiosInstance
      .post(`${baseUrl}/${SEND_CODE}`, data, configReq())
      .then(() => {
        setLoading(false);
        setIsCodeSent(true);
      })
      .catch((err) => {
        setError("کد ارسال نشد. دوباره تلاش کنید.");
        setLoading(false);
      });
  };

  const loginRequest = () => {
    setLoading(true);
    const data = {
      mobile: phoneNumber,
      code,
    };
    axiosInstance
      .post(`${baseUrl}/${LOGIN}`, data, configReq())
      .then((res) => {
        setLoading(false);
        dispatch(login(res.data));
      })
      .catch((err) => {
        setError("کد وارد شده اشتباه است.");
        setLoading(false);
      });
  };

  return (
    <Box sx={styles.container}>
      <Paper sx={styles.innerContainer}>
        {error && <Alert severity="error">{error}</Alert>}
        <Typography variant="h5" sx={styles.title}>
          وارد شوید. &nbsp;
        </Typography>
        <Box>
          <TextInput
            currentValue={phoneNumber}
            change={setPhoneNumber}
            label="شماره همراه"
            disabled={isCodeSent}
          />
          <Button sx={styles.sendCode} disabled={isCodeSent} onClick={sendCode}>
            <SystemUpdate />
            &nbsp; ارسال کد ورود
          </Button>
        </Box>
        <TextInput
          currentValue={code}
          change={setCode}
          label="کد پیام شده"
          disabled={!isCodeSent}
        />
        <Button
          variant="contained"
          size="large"
          disabled={loading}
          onClick={loginRequest}
          sx={styles.submit}
        >
          {loading ? (
            <CircularProgress sx={styles.loading} />
          ) : (
            <>
              ورود &nbsp;
              <LoginIcon />
            </>
          )}
        </Button>
      </Paper>
    </Box>
  );
};

const styles = {
  container: {
    width: "100%",
    height: "100vh",
    position: "fixed",
    top: "0",
    left: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,.7)",
    zIndex: "10",
    direction: "rtl",
  },
  innerContainer: {
    width: "80%",
    maxWidth: "340px",
    borderRadius: "15px",
    p: "20px 40px 30px",
    display: "flex",
    gap: 3,
    flexDirection: "column",
  },
  title: {
    textAlign: "center",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    my: 4,
  },
  sendCode: {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    cursor: "pointer",
    mt: "10px",
    color: "black",
  },
  loading: { height: "33px", width: "33px" },
  submit: { height: "43px", py: "5px" },
};

export default Login;
