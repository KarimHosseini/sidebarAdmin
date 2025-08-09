/* eslint-disable react-hooks/exhaustive-deps */
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
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
import OtpInput from "react-otp-input";
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
    e?.preventDefault();
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
    e?.preventDefault();
    if (!code || code.length < 5) {
      toast.error("لطفا کد تایید ۵ رقمی را وارد کنید");
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

  // Auto-submit OTP when 5 digits are entered
  useEffect(() => {
    if (code.length === 5 && state === 2) {
      LoginRequest();
    }
  }, [code]);

  const isDarkMode = themeColor === "dark";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: isDarkMode
          ? "#0f0f1e"
          : "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
      }}
    >
      {/* Animated gradient background */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode
            ? "radial-gradient(ellipse at top left, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(139, 92, 246, 0.1) 0%, transparent 50%)"
            : "radial-gradient(ellipse at top left, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(139, 92, 246, 0.05) 0%, transparent 50%)",
          animation: "backgroundMove 15s ease infinite",
          "@keyframes backgroundMove": {
            "0%, 100%": { transform: "scale(1) rotate(0deg)" },
            "50%": { transform: "scale(1.1) rotate(5deg)" },
          },
        }}
      />

      {/* Floating orbs */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${
            isDarkMode ? "rgba(99, 102, 241, 0.2)" : "rgba(99, 102, 241, 0.15)"
          }, ${
            isDarkMode ? "rgba(139, 92, 246, 0.1)" : "rgba(139, 92, 246, 0.08)"
          })`,
          filter: "blur(60px)",
          animation: "float 20s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0) translateX(0)" },
            "33%": { transform: "translateY(-30px) translateX(-20px)" },
            "66%": { transform: "translateY(20px) translateX(10px)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-15%",
          left: "-10%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${
            isDarkMode ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.15)"
          }, ${
            isDarkMode ? "rgba(99, 102, 241, 0.1)" : "rgba(99, 102, 241, 0.08)"
          })`,
          filter: "blur(80px)",
          animation: "float 25s ease-in-out infinite reverse",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ zIndex: 1 }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "420px",
            borderRadius: "24px",
            overflow: "hidden",
            background: isDarkMode
              ? "rgba(255, 255, 255, 0.03)"
              : "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: isDarkMode
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: isDarkMode
              ? "0 20px 60px rgba(0, 0, 0, 0.5), inset 0 0 30px rgba(255, 255, 255, 0.02)"
              : "0 20px 60px rgba(0, 0, 0, 0.1), inset 0 0 30px rgba(255, 255, 255, 0.5)",
            position: "relative",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: isDarkMode
                ? "0 30px 80px rgba(0, 0, 0, 0.6), inset 0 0 40px rgba(255, 255, 255, 0.03)"
                : "0 30px 80px rgba(0, 0, 0, 0.15), inset 0 0 40px rgba(255, 255, 255, 0.6)",
            },
          }}
        >
          {/* Animated gradient border */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background:
                "linear-gradient(90deg, #6366f1 0%, #8b5cf6 25%, #3b82f6 50%, #6366f1 75%, #8b5cf6 100%)",
              backgroundSize: "200% 100%",
              animation: "gradientSlide 4s linear infinite",
              "@keyframes gradientSlide": {
                "0%": { backgroundPosition: "0% 0%" },
                "100%": { backgroundPosition: "200% 0%" },
              },
            }}
          />

          {/* Content */}
          <Box sx={{ padding: "40px 32px" }}>
            {/* Logo and header */}
            <Box sx={{ mb: 4, textAlign: "center" }}>
              {companyInfo?.companyLogo ? (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <Box
                    sx={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "20px",
                      background: isDarkMode
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(255, 255, 255, 0.8)",
                      backdropFilter: "blur(10px)",
                      border: isDarkMode
                        ? "1px solid rgba(255, 255, 255, 0.1)"
                        : "1px solid rgba(255, 255, 255, 0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                      boxShadow: isDarkMode
                        ? "0 8px 32px rgba(99, 102, 241, 0.2)"
                        : "0 8px 32px rgba(99, 102, 241, 0.1)",
                    }}
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
                        width: "60px",
                        height: "60px",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                </motion.div>
              ) : (
                <Skeleton
                  variant="rounded"
                  width={100}
                  height={100}
                  sx={{
                    borderRadius: "20px",
                    mb: 3,
                    mx: "auto",
                    bgcolor: isDarkMode
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                  }}
                />
              )}

              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-0.5px",
                }}
              >
                {state === 1 ? "خوش آمدید" : "تایید هویت"}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: isDarkMode
                    ? "rgba(255,255,255,0.6)"
                    : "rgba(0,0,0,0.6)",
                  fontSize: "0.9rem",
                }}
              >
                {state === 1
                  ? "برای ورود به پنل مدیریت اطلاعات خود را وارد کنید"
                  : `کد ارسال شده به ${mobile} را وارد کنید`}
              </Typography>
            </Box>

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
                            <PhoneAndroidOutlinedIcon
                              sx={{
                                color: "#6366f1",
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                          height: "56px",
                          borderRadius: "16px",
                          fontSize: "1.1rem",
                          background: isDarkMode
                            ? "rgba(255, 255, 255, 0.03)"
                            : "rgba(255, 255, 255, 0.5)",
                          backdropFilter: "blur(10px)",
                          transition: "all 0.3s ease",
                          "& input": {
                            fontSize: "1.1rem",
                            letterSpacing: "0.5px",
                          },
                          "&:hover": {
                            background: isDarkMode
                              ? "rgba(255, 255, 255, 0.05)"
                              : "rgba(255, 255, 255, 0.7)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#6366f1",
                            borderWidth: "2px",
                          },
                          "&.Mui-focused": {
                            background: isDarkMode
                              ? "rgba(255, 255, 255, 0.05)"
                              : "rgba(255, 255, 255, 0.8)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#6366f1",
                            borderWidth: "2px",
                          },
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: isDarkMode
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(99, 102, 241, 0.2)",
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: "1rem",
                          "&.Mui-focused": {
                            color: "#6366f1",
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
                            <LockOutlinedIcon
                              sx={{
                                color: "#6366f1",
                              }}
                            />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setseePassword(!seePassword)}
                              edge="end"
                              sx={{
                                color: seePassword ? "#6366f1" : "inherit",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  background: "rgba(99, 102, 241, 0.1)",
                                },
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
                          height: "56px",
                          borderRadius: "16px",
                          fontSize: "1.1rem",
                          background: isDarkMode
                            ? "rgba(255, 255, 255, 0.03)"
                            : "rgba(255, 255, 255, 0.5)",
                          backdropFilter: "blur(10px)",
                          transition: "all 0.3s ease",
                          "& input": {
                            fontSize: "1.1rem",
                            letterSpacing: "0.5px",
                          },
                          "&:hover": {
                            background: isDarkMode
                              ? "rgba(255, 255, 255, 0.05)"
                              : "rgba(255, 255, 255, 0.7)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#6366f1",
                            borderWidth: "2px",
                          },
                          "&.Mui-focused": {
                            background: isDarkMode
                              ? "rgba(255, 255, 255, 0.05)"
                              : "rgba(255, 255, 255, 0.8)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#6366f1",
                            borderWidth: "2px",
                          },
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: isDarkMode
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(99, 102, 241, 0.2)",
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: "1rem",
                          "&.Mui-focused": {
                            color: "#6366f1",
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
                      sx={{
                        height: "56px",
                        borderRadius: "16px",
                        background:
                          "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                        boxShadow: "0 8px 32px rgba(99, 102, 241, 0.3)",
                        transition: "all 0.3s ease",
                        textTransform: "none",
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        letterSpacing: "0.5px",
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background:
                            "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                        },
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 12px 40px rgba(99, 102, 241, 0.4)",
                          "&::before": {
                            opacity: 1,
                          },
                        },
                        "&:disabled": {
                          background: isDarkMode
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.1)",
                          boxShadow: "none",
                        },
                      }}
                    >
                      {loading ? (
                        <CircularProgress
                          size={28}
                          sx={{
                            color: "white",
                          }}
                        />
                      ) : (
                        <span style={{ position: "relative", zIndex: 1 }}>
                          ورود به حساب
                        </span>
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
                    {/* Timer display */}
                    {isTimerActive && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 4,
                          py: 2,
                        }}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            width: "80px",
                            height: "80px",
                          }}
                        >
                          <CircularProgress
                            variant="determinate"
                            value={(timer / 120) * 100}
                            size={80}
                            thickness={3}
                            sx={{
                              color: timer > 30 ? "#6366f1" : "#dc2626",
                              transition: "color 0.5s ease",
                              "& .MuiCircularProgress-circle": {
                                strokeLinecap: "round",
                              },
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
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <TimerOutlinedIcon
                              sx={{
                                color: timer > 30 ? "#6366f1" : "#dc2626",
                                fontSize: "1.5rem",
                                mb: 0.5,
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                color: timer > 30 ? "#6366f1" : "#dc2626",
                                fontWeight: 600,
                                fontSize: "0.9rem",
                              }}
                            >
                              {formatPersianTime(formatTime(timer))}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    )}

                    {/* OTP Input */}
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          mb: 2,
                          textAlign: "center",
                          color: isDarkMode
                            ? "rgba(255,255,255,0.7)"
                            : "rgba(0,0,0,0.7)",
                        }}
                      >
                        کد تایید ۵ رقمی را وارد کنید
                      </Typography>
                      <OtpInput
                        value={code}
                        onChange={setCode}
                        numInputs={5}
                        renderSeparator={<span style={{ width: "8px" }}></span>}
                        renderInput={(props) => (
                          <input
                            {...props}
                            style={{
                              width: "56px",
                              height: "56px",
                              borderRadius: "16px",
                              border: isDarkMode
                                ? "2px solid rgba(255, 255, 255, 0.2)"
                                : "2px solid rgba(99, 102, 241, 0.2)",
                              background: isDarkMode
                                ? "rgba(255, 255, 255, 0.03)"
                                : "rgba(255, 255, 255, 0.5)",
                              backdropFilter: "blur(10px)",
                              fontSize: "1.5rem",
                              fontWeight: "600",
                              textAlign: "center",
                              color: isDarkMode ? "#fff" : "#000",
                              transition: "all 0.3s ease",
                              outline: "none",
                              ...(props.style || {}),
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = "#6366f1";
                              e.target.style.background = isDarkMode
                                ? "rgba(255, 255, 255, 0.05)"
                                : "rgba(255, 255, 255, 0.8)";
                              e.target.style.transform = "scale(1.05)";
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = isDarkMode
                                ? "rgba(255, 255, 255, 0.2)"
                                : "rgba(99, 102, 241, 0.2)";
                              e.target.style.background = isDarkMode
                                ? "rgba(255, 255, 255, 0.03)"
                                : "rgba(255, 255, 255, 0.5)";
                              e.target.style.transform = "scale(1)";
                            }}
                            disabled={!isTimerActive || loading}
                          />
                        )}
                        shouldAutoFocus
                        inputType="tel"
                        containerStyle={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      />
                    </Box>

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading || !isTimerActive || code.length < 5}
                      sx={{
                        height: "56px",
                        mb: 3,
                        borderRadius: "16px",
                        background:
                          "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                        boxShadow: "0 8px 32px rgba(99, 102, 241, 0.3)",
                        transition: "all 0.3s ease",
                        textTransform: "none",
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        letterSpacing: "0.5px",
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background:
                            "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                        },
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 12px 40px rgba(99, 102, 241, 0.4)",
                          "&::before": {
                            opacity: 1,
                          },
                        },
                        "&:disabled": {
                          background: isDarkMode
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.1)",
                          boxShadow: "none",
                        },
                      }}
                    >
                      {loading ? (
                        <CircularProgress
                          size={28}
                          sx={{
                            color: "white",
                          }}
                        />
                      ) : (
                        <span style={{ position: "relative", zIndex: 1 }}>
                          تایید و ورود
                        </span>
                      )}
                    </Button>

                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => {
                          setState(1);
                          setCode("");
                          if (timerRef.current) {
                            clearInterval(timerRef.current);
                            setIsTimerActive(false);
                          }
                        }}
                        sx={{
                          height: "48px",
                          borderRadius: "12px",
                          borderColor: isDarkMode
                            ? "rgba(255,255,255,0.2)"
                            : "rgba(99, 102, 241, 0.3)",
                          color: isDarkMode
                            ? "rgba(255,255,255,0.8)"
                            : "#6366f1",
                          textTransform: "none",
                          fontWeight: 500,
                          backdropFilter: "blur(10px)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            borderColor: "#6366f1",
                            background: "rgba(99, 102, 241, 0.1)",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        بازگشت
                      </Button>

                      {!isTimerActive && (
                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={(e) => SendCode(e)}
                          disabled={loading}
                          sx={{
                            height: "48px",
                            borderRadius: "12px",
                            borderColor: "#6366f1",
                            color: "#6366f1",
                            textTransform: "none",
                            fontWeight: 500,
                            backdropFilter: "blur(10px)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              borderColor: "#6366f1",
                              background: "rgba(99, 102, 241, 0.1)",
                              transform: "translateY(-2px)",
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
                        fullWidth
                        onClick={(e) => SendCode(e, true)}
                        disabled={loading}
                        sx={{
                          mt: 2,
                          height: "40px",
                          borderRadius: "8px",
                          color: isDarkMode
                            ? "rgba(255,255,255,0.6)"
                            : "rgba(0,0,0,0.6)",
                          textTransform: "none",
                          fontWeight: 400,
                          fontSize: "0.9rem",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background: "rgba(99, 102, 241, 0.05)",
                            color: "#6366f1",
                          },
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={16} color="inherit" />
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
