/* eslint-disable react-hooks/exhaustive-deps */
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  baseUrl,
  DOWNLOAD_FILE,
  getStaticsData,
  LOGIN,
  sendCodeAdmin,
} from "../../helpers/api-routes";
import { configReq } from "../../helpers/functions";
import { setCompanyInfo } from "../../redux/slices/relationals";
import { login } from "../../redux/slices/user";

const Login = () => {
  const [passWord, setpassWord] = useState("");
  const [mobile, setMobile] = useState("");
  const [code, setCode] = useState("");
  const [seePassword, setseePassword] = useState(false);
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const [state, setState] = useState(1);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { companyInfo } = useSelector((state) => state.relationals);
  const [timer, setTimer] = useState(120);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef(null);
  const { themeColor } = useSelector((state) => state.themeColor);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", ""]);
  const otpRefs = useRef([]);
  
  // Keep code string in sync with segmented OTP inputs
  useEffect(() => {
    setCode(otpDigits.join(""));
  }, [otpDigits]);

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...otpDigits];
    next[index] = value;
    setOtpDigits(next);

    if (value && index < otpDigits.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Auto-submit when 5 digits entered
  useEffect(() => {
    if (state === 2 && otpDigits.every((d) => d !== "") && isTimerActive && !loading) {
      const form = document.getElementById("otp-form");
      form?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }
  }, [otpDigits, state, isTimerActive, loading]);

  // Focus first OTP input when entering OTP step
  useEffect(() => {
    if (state === 2) {
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  }, [state]);

  useEffect(() => {
    axios(`${baseUrl}/${getStaticsData}`)
      .then((res) => {
        const { data } = res;
        dispatch(setCompanyInfo(data?.data?.company));
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  // Fix timer logic - ensure it starts immediately when state changes to 2
  useEffect(() => {
    if (state === 2) {
      startTimer();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state]);

  const startTimer = () => {
    setTimer(120);
    setIsTimerActive(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(timerRef.current);
          setIsTimerActive(false);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  const formatPersianTime = (timeStr) => {
    return timeStr
      .replace(/0/g, "۰")
      .replace(/1/g, "۱")
      .replace(/2/g, "۲")
      .replace(/3/g, "۳")
      .replace(/4/g, "۴")
      .replace(/5/g, "۵")
      .replace(/6/g, "۶")
      .replace(/7/g, "۷")
      .replace(/8/g, "۸")
      .replace(/9/g, "۹");
  };

  const SendCode = (e, isVoiceCall = false) => {
    e.preventDefault();
    if (!mobile || !passWord) {
      toast.error("لطفا شماره همراه و رمز عبور را وارد کنید");
      return;
    }

    setLoading(true);
    const data = {
      mobile: mobile,
      password: passWord,
    };
    axios
      .post(
        `${baseUrl}/${sendCodeAdmin}${isVoiceCall ? "?isVoiceCall=true" : ""}`,
        data,
        configReq()
      )
      .then((res) => {
        if (state === 1) {
          setState(2);
        }
        startTimer();
        setLoading(false);
        toast.success("کد تایید ارسال شد");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "خطا در ارسال کد");
        setLoading(false);
      });
  };

  const LoginRequest = (e) => {
    e.preventDefault();
    if (!code) {
      toast.error("لطفا کد تایید را وارد کنید");
      return;
    }

    setLoading(true);
    const data = {
      mobile: mobile,
      code,
    };
    axios
      .post(`${baseUrl}/${LOGIN}`, data, configReq())
      .then((res) => {
        setLoading(false);
        toast.success("ورود موفقیت آمیز");
        navigate("/");
        dispatch(login(res.data));
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "خطا در ورود");
        setLoading(false);
      });
  };

  const isDarkMode = themeColor === "dark";

  return (
    <Box
      sx={{ position: "relative" }}
      className="gradient-page login-container"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {loading && (
          <div className="auth-loading-overlay">
            <CircularProgress size={36} color="inherit" />
          </div>
        )}
        <Paper
          elevation={0}
          className="auth-card"
          sx={{
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div className="auth-card-accent" />

          <Box
            sx={{
              padding: "32px 32px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ mb: 3, textAlign: "center" }}>
              {companyInfo?.companyLogo ? (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <img
                    src={`${baseUrl}/${DOWNLOAD_FILE}/${
                      isDarkMode
                        ? companyInfo?.companyDarkLogo ||
                          companyInfo?.companyLogo
                        : companyInfo?.companyLogo
                    }`}
                    alt={companyInfo?.companyTitle || "Company Logo"}
                    style={{
                      width: "80px",
                      height: "40px",
                      objectFit: "contain",
                      margin: "0 auto",
                      filter: isDarkMode
                        ? "drop-shadow(0 2px 4px rgba(255,255,255,0.1))"
                        : "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    }}
                  />
                  {companyInfo?.companyTitle && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          mt: 2,
                          fontWeight: 500,
                          color: isDarkMode
                            ? "rgba(255,255,255,0.9)"
                            : "rgba(0,0,0,0.85)",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {companyInfo?.companyTitle}
                      </Typography>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Skeleton
                    width={180}
                    height={90}
                    variant="rectangular"
                    sx={{
                      borderRadius: 2,
                      bgcolor: isDarkMode
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                    }}
                  />
                  <Skeleton
                    width={120}
                    height={30}
                    variant="text"
                    sx={{
                      mt: 1.5,
                      borderRadius: 1,
                      bgcolor: isDarkMode
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                    }}
                  />
                </Box>
              )}
            </Box>

            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 500,
                mb: 1,
                color: isDarkMode ? "#fff" : "#333",
                letterSpacing: "0.3px",
              }}
            >
              {state === 1 ? "ورود به پنل مدیریت" : "تایید کد یکبار مصرف"}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mb: 4,
                color: isDarkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                textAlign: "center",
              }}
            >
              {state === 1
                ? "لطفا اطلاعات خود را وارد کنید"
                : `کد ارسال شده به شماره ${mobile} را وارد کنید`}
            </Typography>
          </Box>

          <Box sx={{ padding: "0 32px 28px" }}>
            <AnimatePresence mode="wait">
              {state === 1 ? (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.25 }}
                >
                  <form onSubmit={SendCode}>
                    <TextField
                      variant="outlined"
                      label="شماره همراه"
                      fullWidth
                      autoFocus
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      type="tel"
                      name="phoneNumber"
                      margin="normal"
                      inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneAndroidOutlinedIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 2.5,
                        "& .MuiOutlinedInput-root": {
                          height: 56,
                          borderRadius: "12px",
                          transition: "all 0.3s ease",
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#6366f1",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderWidth: "1px",
                            borderColor: "#6366f1",
                          },
                        },
                      }}
                    />

                    <TextField
                      variant="outlined"
                      label="رمز عبور"
                      fullWidth
                      value={passWord}
                      onChange={(e) => setpassWord(e.target.value)}
                      type={seePassword ? "text" : "password"}
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setseePassword(!seePassword)}
                              edge="end"
                              sx={{ mr: "6px" }}
                            >
                              {seePassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                          height: 56,
                          borderRadius: "12px",
                          transition: "all 0.3s ease",
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#6366f1",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderWidth: "1px",
                            borderColor: "#6366f1",
                          },
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading || !mobile || !passWord}
                      className="gradient-button"
                      sx={{ py: 1.6, borderRadius: "12px" }}
                    >
                      {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : <span>ورود</span>}
                    </Button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="otp-form"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <form id="otp-form" onSubmit={LoginRequest}>
                    {isTimerActive && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 2,
                          p: 2,
                          borderRadius: "12px",
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid var(--glass-border)",
                        }}
                      >
                        <Box sx={{ position: "relative", mb: 1 }}>
                          <CircularProgress
                            variant="determinate"
                            value={(timer / 120) * 100}
                            size={54}
                            thickness={3}
                            sx={{ color: timer > 30 ? "#6366f1" : "#dc2626" }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              inset: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <TimerOutlinedIcon sx={{ color: timer > 30 ? "#6366f1" : "#dc2626" }} />
                          </Box>
                        </Box>
                        <Typography variant="body2" sx={{ color: timer > 30 ? "#e5e7eb" : "#fca5a5" }}>
                          {formatPersianTime(formatTime(timer))}
                        </Typography>
                      </Box>
                    )}

                    <div className="otp-inputs">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (otpRefs.current[idx] = el)}
                          className="otp-input"
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value.replace(/\D/g, ""))}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          disabled={!isTimerActive}
                        />
                      ))}
                    </div>

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading || !isTimerActive || code.length !== 5}
                      className="gradient-button"
                      sx={{ py: 1.6, mb: 2, borderRadius: "12px" }}
                    >
                      {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : <span>تایید و ورود</span>}
                    </Button>

                    <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                      <Button
                        variant="outlined"
                        color="inherit"
                        fullWidth
                        onClick={() => {
                          setState(1);
                          if (timerRef.current) {
                            clearInterval(timerRef.current);
                            setIsTimerActive(false);
                          }
                          setOtpDigits(["", "", "", "", ""]);
                          setCode("");
                        }}
                        sx={{ borderRadius: "12px", py: 1.2 }}
                      >
                        بازگشت
                      </Button>

                      {!isTimerActive && (
                        <Button
                          variant="outlined"
                          color="primary"
                          fullWidth
                          onClick={(e) => SendCode(e)}
                          disabled={loading}
                          sx={{ borderRadius: "12px", py: 1.2 }}
                        >
                          {loading ? <CircularProgress size={18} /> : "ارسال مجدد کد"}
                        </Button>
                      )}
                    </Box>

                    {!isTimerActive && (
                      <Button
                        variant="text"
                        color="inherit"
                        fullWidth
                        onClick={(e) => SendCode(e, true)}
                        disabled={loading}
                        sx={{ mt: 1, borderRadius: "12px", py: 1 }}
                      >
                        {loading ? <CircularProgress size={18} /> : "دریافت کد از طریق تماس صوتی"}
                      </Button>
                    )}
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Login;
