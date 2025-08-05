import { Box, Button, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import Lottie from "react-lottie";
import { useLocation, useNavigate } from "react-router-dom";
import failureAnimation from "../../assets/animations/failure-payment.json";
import successAnimation from "../../assets/animations/success-payment.json";

// Styled Motion Components
const MotionPaper = motion(Paper);
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);

const PaymentResult = () => {
  const [countdown, setCountdown] = useState(5);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const params = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return params;
  }, [location.search]);

  const paymentInfo = useMemo(() => {
    if (queryParams.res) {
      try {
        const response = JSON.parse(queryParams.res);
        return response?.Data;
      } catch (e) {
        console.error("Error parsing payment response", e);
        return null;
      }
    }
    return null;
  }, [queryParams.res]);

  const startRedirectTimer = () => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (queryParams.from === "order") {
            navigate(`/order/${paymentInfo?.invoiceId}`);
          } else if (queryParams.from === "wallet") {
            navigate("/dashboard/wallet");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return timer;
  };

  useEffect(() => {
    let timer = null;

    if (queryParams.status === "1" && paymentInfo) {
      timer = startRedirectTimer();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [queryParams.status, paymentInfo, queryParams.from, navigate]);

  const successOptions = {
    loop: false,
    autoplay: true,
    animationData: successAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const failureOptions = {
    loop: false,
    autoplay: true,
    animationData: failureAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1.5,
      },
    },
  };

  return (
    <MotionBox
      className="py-7 bg-gray-50 mt-[-5px] payment-resualt-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <MotionPaper
        elevation={2}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{
          minHeight: "70vh",
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto",
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "16px",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          background: "linear-gradient(145deg, #ffffff, #f5f5f5)",
        }}
      >
        {/* Background decoration */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "150px",
            height: "150px",
            borderRadius: "0 0 0 100%",
            opacity: 0.1,
            background: queryParams.status === "1" ? "#4caf50" : "#f44336",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "150px",
            height: "150px",
            borderRadius: "0 100% 0 0",
            opacity: 0.1,
            background: queryParams.status === "1" ? "#4caf50" : "#f44336",
            zIndex: 0,
          }}
        />

        <Box sx={{ zIndex: 1, width: "100%", textAlign: "center" }}>
          {queryParams.status === "1" ? (
            <>
              <MotionBox variants={itemVariants} sx={{ mb: 4 }}>
                <Lottie options={successOptions} height={200} width={200} />
              </MotionBox>
              <MotionTypography
                variant="h5"
                fontWeight="600"
                sx={{ mb: 2 }}
                variants={itemVariants}
              >
                تراکنش شما با موفقیت ثبت و پرداخت شد
              </MotionTypography>
              {queryParams.from === "wallet" ? (
                <MotionTypography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                  sx={{ mb: 4, maxWidth: "500px", mx: "auto" }}
                  variants={itemVariants}
                >
                  شارژ کیف پول شما با موفقیت انجام شد
                </MotionTypography>
              ) : (
                <MotionTypography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                  sx={{ mb: 4, maxWidth: "500px", mx: "auto" }}
                  variants={itemVariants}
                >
                  جهت پیگیری سفارش خود به صفحه کاربری - گزارش سفارشات مراجعه
                  کنید
                </MotionTypography>
              )}
            </>
          ) : (
            <>
              <MotionBox variants={itemVariants} sx={{ mb: 4 }}>
                <Lottie options={failureOptions} height={200} width={200} />
              </MotionBox>
              <MotionTypography
                variant="h5"
                fontWeight="600"
                sx={{ mb: 2 }}
                variants={itemVariants}
              >
                متاسفانه تراکنش شما با مشکل روبرو شد
              </MotionTypography>
              <MotionTypography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{ mb: 4, maxWidth: "500px", mx: "auto" }}
                variants={itemVariants}
              >
                در صورت کسر مبلغ از حساب شما، مبلغ پرداخت شده حداکثر تا 72 ساعت
                به حساب شما برگشت خواهد شد در صورت نیاز میتوانید با همکاران ما
                در واحد پشتیبانی تماس بگیرید
              </MotionTypography>
            </>
          )}
        </Box>

        {paymentInfo ? (
          <MotionPaper
            elevation={0}
            variant="outlined"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            sx={{
              p: 3,
              my: 3,
              maxWidth: "450px",
              width: "100%",
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <MotionBox
              className="flex justify-between items-center w-full flex-wrap border-b mb-3 pb-3 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Typography variant="body2" color="text.secondary">
                شماره تراکنش :
              </Typography>
              <Typography variant="body1" fontWeight="600">
                {paymentInfo?.invoiceId}
              </Typography>
            </MotionBox>
            {paymentInfo?.referenceNumber && (
              <MotionBox
                className="flex justify-between items-center w-full flex-wrap border-b mb-3 pb-3 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Typography variant="body2" color="text.secondary">
                  شماره پیگیری :
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {paymentInfo?.referenceNumber}
                </Typography>
              </MotionBox>
            )}
            {paymentInfo?.gateway && (
              <MotionBox
                className="flex justify-between items-center w-full flex-wrap gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Typography variant="body2" color="text.secondary">
                  پرداخت به وسیله :
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {paymentInfo?.gateway}
                </Typography>
              </MotionBox>
            )}
          </MotionPaper>
        ) : null}

        <MotionBox
          sx={{
            display: "flex",
            flexWrap: "wrap",
            maxWidth: "450px",
            width: "100%",
            mb: 4,
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
          variants={itemVariants}
        >
          {queryParams.status === "1" && paymentInfo ? (
            <MotionBox
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              variants={itemVariants}
            >
              <MotionBox
                sx={{
                  position: "relative",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 100,
                  height: 100,
                }}
                variants={pulseVariants}
                animate="pulse"
              >
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e0e0e0"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#4caf50"
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: 283, strokeDashoffset: 283 }}
                    animate={{
                      strokeDashoffset: 283 - (283 * (5 - countdown)) / 5,
                    }}
                    transition={{
                      duration: 1,
                      ease: "easeInOut",
                    }}
                    style={{
                      transformOrigin: "center",
                      transform: "rotate(-90deg)",
                    }}
                  />
                </svg>
                <MotionTypography
                  variant="h4"
                  component="div"
                  sx={{
                    position: "absolute",
                    fontWeight: "600",
                    color: "#4caf50",
                  }}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  {countdown}
                </MotionTypography>
              </MotionBox>

              <MotionTypography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 4 }}
                variants={itemVariants}
              >
                انتقال خودکار در {countdown} ثانیه...
              </MotionTypography>

              {queryParams.from === "order" ? (
                <MotionButton
                  color="primary"
                  size="medium"
                  onClick={() => navigate(`/order/${paymentInfo?.invoiceId}`)}
                  variant="contained"
                  sx={{
                    borderRadius: "8px",
                    py: 1,
                    px: 3,
                    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  بازگشت به سفارش
                </MotionButton>
              ) : queryParams.from === "wallet" ? (
                <MotionButton
                  color="primary"
                  size="medium"
                  variant="contained"
                  onClick={() => navigate("/dashboard/wallet")}
                  sx={{
                    borderRadius: "8px",
                    py: 1,
                    px: 3,
                    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  دیدن کیف پول
                </MotionButton>
              ) : null}
            </MotionBox>
          ) : null}
        </MotionBox>
      </MotionPaper>
    </MotionBox>
  );
};

export default PaymentResult;
