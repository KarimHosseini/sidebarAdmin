import { Box, Divider } from "@mui/material";
import React, { useEffect, useState } from "react";

const CounterPreview = ({ data }) => {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!data?.endDate) return;
  
    // Parse the ISO date string into a Date object
    const targetDate = data?.endDate ? new Date(data?.endDate) : new Date();
    let interval; // Declare interval using let
  
    const updateCountdown = () => {
      const currentDate = new Date();
      const timeDifference = targetDate - currentDate;
  
      if (timeDifference <= 0) {
        clearInterval(interval);
        setCountdown("");
      } else {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  
        setCountdown({ days, hours, minutes, seconds });
      }
    };
  
    // Update the countdown initially
    if (data?.endDate) {
      updateCountdown();
    }
  
    // Update the countdown every second
    interval = setInterval(updateCountdown, 1000);
  
    // Clean up the interval on component unmount
    return () => {
      clearInterval(interval);
    };
  }, [data?.endDate]);
  return (
    <Divider
      sx={{
        ":after": {
          borderTopColor: data?.borderCounterColor || "#000" + "!important",
        },
        ":before": {
          borderTopColor: data?.borderCounterColor || "#000" + "!important",
        },
      }}
    >
      <Box className="flex justify-center flex-row-reverse items-center gap-2">
        <Box className="w-[60px] flex flex-col items-center ">
          <Box
            className="w-full text-center py-1 rounded-t-md"
            sx={{
              background: data?.labelBackGround || "#000",
              color: data?.labelColor || "#fff",
            }}
          >
            روز
          </Box>
          <Box
            className="w-full text-center py-1 rounded-b-md text-xl"
            sx={{
              background: data?.valueBackground || "#000",
              color: data?.valueColor || "#fff",
            }}
          >
            {countdown?.days}
          </Box>
        </Box>
        <Box className="w-[60px] flex flex-col items-center ">
          <Box
            className="w-full text-center py-1 rounded-t-md"
            sx={{
              background: data?.labelBackGround || "#000",
              color: data?.labelColor || "#fff",
            }}
          >
            ساعت
          </Box>
          <Box
            className="w-full text-center py-1 rounded-b-md text-xl"
            sx={{
              background: data?.valueBackground || "#000",
              color: data?.valueColor || "#fff",
            }}
          >
            {countdown?.hours}
          </Box>
        </Box>
        <Box className="w-[60px] flex flex-col items-center ">
          <Box
            className="w-full text-center py-1 rounded-t-md"
            sx={{
              background: data?.labelBackGround || "#000",
              color: data?.labelColor || "#fff",
            }}
          >
            دقیقه
          </Box>
          <Box
            className="w-full text-center py-1 rounded-b-md text-xl"
            sx={{
              background: data?.valueBackground || "#000",
              color: data?.valueColor || "#fff",
            }}
          >
            {countdown?.minutes}
          </Box>
        </Box>
        <Box className="w-[60px] flex flex-col items-center ">
          <Box
            className="w-full text-center py-1 rounded-t-md"
            sx={{
              background: data?.labelBackGround || "#000",
              color: data?.labelColor || "#fff",
            }}
          >
            ثانیه
          </Box>
          <Box
            className="w-full text-center py-1 rounded-b-md text-xl"
            sx={{
              background: data?.valueBackground || "#000",
              color: data?.valueColor || "#fff",
            }}
          >
            {countdown?.seconds}
          </Box>
        </Box>
      </Box>
    </Divider>
  );
};

export default CounterPreview;
