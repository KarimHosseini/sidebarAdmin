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
      sx={{
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1a1f35 0%, #101224 100%)"
            : "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backgroundImage: isDarkMode
          ? "url('https://www.transparenttextures.com/patterns/cubes.png')"
          : "url('https://www.transparenttextures.com/patterns/white-diamond-dark.png')",
        backgroundBlendMode: "overlay",
      }}
      className="login-container"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Paper
          elevation={isDarkMode ? 4 : 8}
          sx={{
            borderRadius: "16px",
            overflow: "hidden",
            background: isDarkMode
              ? "linear-gradient(135deg, #20213a 0%, #0e0f23 100%)"
              : "#fff",
            position: "relative",
            boxShadow: isDarkMode
              ? "0 10px 30px rgba(0,0,0,0.5)"
              : "0 10px 30px rgba(0,0,0,0.1)",
            border: isDarkMode
              ? "1px solid rgba(255,255,255,0.05)"
              : "1px solid rgba(0,0,0,0.05)",
          }}
        >
          {/* Decorative top bar with animation - more subtle for enterprise look */}
          <Box
            sx={{
              height: "6px",
              width: "100%",
              background: isDarkMode
                ? "linear-gradient(90deg, #1e3a8a 0%, #3f51b5 100%)"
                : "linear-gradient(90deg, #1e3a8a 0%, #3f51b5 100%)",
              backgroundSize: "200% 100%",
              animation: "gradientMove 6s ease infinite",
              "@keyframes gradientMove": {
                "0%": { backgroundPosition: "0% 50%" },
                "50%": { backgroundPosition: "100% 50%" },
                "100%": { backgroundPosition: "0% 50%" },
              },
            }}
          />

          {/* Logo and header - more enterprise styling */}
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

          {/* Form content - more enterprise styling */}
          <Box sx={{ padding: "0 32px 32px" }}>
            <AnimatePresence mode="wait">
              {state === 1 ? (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
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
                          borderRadius: "8px",
                          transition: "all 0.3s ease",
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#1e3a8a",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderWidth: "1px",
                            borderColor: "#1e3a8a",
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
                              sx={{
                                color: seePassword
                                  ? "#1e3a8a"
                                  : "text.secondary",
                                transition: "all 0.2s ease",
                                mr: "9px",
                              }}
                            >
                              {seePassword ? (
                                <VisibilityIcon />
                              ) : (
                                <VisibilityOffIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 4,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          transition: "all 0.3s ease",
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#1e3a8a",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderWidth: "1px",
                            borderColor: "#1e3a8a",
                          },
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={loading || !mobile || !passWord}
                      sx={{
                        py: 1.5,
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(30, 58, 138, 0.2)",
                        background: isDarkMode
                          ? "linear-gradient(to right, #1e3a8a, #3f51b5)"
                          : "linear-gradient(to right, #1e3a8a, #3f51b5)",
                        transition: "all 0.3s ease",
                        textTransform: "none",
                        fontWeight: 500,
                        letterSpacing: "0.5px",
                        "&:hover": {
                          boxShadow: "0 4px 12px rgba(30, 58, 138, 0.3)",
                        },
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "ورود"
                      )}
                    </Button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="otp-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={LoginRequest}>
                    {/* Timer display with circular progress - more enterprise styling */}
                    {isTimerActive && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 3,
                          p: 2,
                          borderRadius: "8px",
                          background: isDarkMode
                            ? "rgba(30, 58, 138, 0.08)"
                            : "rgba(30, 58, 138, 0.04)",
                          border: "1px solid",
                          borderColor: isDarkMode
                            ? "rgba(30, 58, 138, 0.2)"
                            : "rgba(30, 58, 138, 0.1)",
                        }}
                      >
                        <Box sx={{ position: "relative", mb: 1 }}>
                          <CircularProgress
                            variant="determinate"
                            value={(timer / 120) * 100}
                            size={50}
                            thickness={3}
                            sx={{
                              color: timer > 30 ? "#1e3a8a" : "#dc2626",
                              transition: "color 0.5s ease",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              bottom: 0,
                              right: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <TimerOutlinedIcon
                              sx={{
                                color: timer > 30 ? "#1e3a8a" : "#dc2626",
                                transition: "color 0.5s ease",
                                fontSize: "1.2rem",
                              }}
                            />
                          </Box>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: timer > 30 ? "#1e3a8a" : "#dc2626",
                            transition: "color 0.5s ease",
                            fontWeight: 500,
                          }}
                        >
                          {formatPersianTime(formatTime(timer))}
                        </Typography>
                      </Box>
                    )}

                    <TextField
                      variant="outlined"
                      label="کد تایید"
                      fullWidth
                      autoFocus
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      type="tel"
                      margin="normal"
                      disabled={!isTimerActive}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SmsOutlinedIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 4,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          transition: "all 0.3s ease",
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#1e3a8a",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderWidth: "1px",
                            borderColor: "#1e3a8a",
                          },
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={loading || !isTimerActive || !code}
                      sx={{
                        py: 1.5,
                        mb: 3,
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(30, 58, 138, 0.2)",
                        background: isDarkMode
                          ? "linear-gradient(to right, #1e3a8a, #3f51b5)"
                          : "linear-gradient(to right, #1e3a8a, #3f51b5)",
                        transition: "all 0.3s ease",
                        textTransform: "none",
                        fontWeight: 500,
                        letterSpacing: "0.5px",
                        "&:hover": {
                          boxShadow: "0 4px 12px rgba(30, 58, 138, 0.3)",
                        },
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "تایید و ورود"
                      )}
                    </Button>

                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
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
                        }}
                        sx={{
                          borderRadius: "8px",
                          py: 1.2,
                          borderWidth: "1px",
                          borderColor: isDarkMode
                            ? "rgba(255,255,255,0.3)"
                            : "rgba(0,0,0,0.23)",
                          color: isDarkMode
                            ? "rgba(255,255,255,0.8)"
                            : "rgba(0,0,0,0.7)",
                          textTransform: "none",
                          fontWeight: 400,
                          "&:hover": {
                            borderWidth: "1px",
                            backgroundColor: isDarkMode
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(0,0,0,0.04)",
                          },
                        }}
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
                          sx={{
                            borderRadius: "8px",
                            py: 1.2,
                            borderWidth: "1px",
                            textTransform: "none",
                            fontWeight: 400,
                            "&:hover": {
                              borderWidth: "1px",
                            },
                          }}
                        >
                          {loading ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            "ارسال مجدد کد"
                          )}
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
                        sx={{
                          mt: 2,
                          borderRadius: "8px",
                          py: 1,
                          color: isDarkMode
                            ? "rgba(255,255,255,0.7)"
                            : "rgba(0,0,0,0.6)",
                          textTransform: "none",
                          fontWeight: 400,
                          "&:hover": {
                            backgroundColor: isDarkMode
                              ? "rgba(255,255,255,0.03)"
                              : "rgba(0,0,0,0.03)",
                          },
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          "دریافت کد از طریق تماس صوتی"
                        )}
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
