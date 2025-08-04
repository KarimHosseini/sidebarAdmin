import { Box, Paper } from "@mui/material";
import React from "react";
import { TextInput } from "../../../common";

const Stories = ({ data, setData, editMode }) => {
  return (
    <>
      {" "}
      {data?.viewType?.id === 57 && (
        <Paper
          sx={{
            border: "1px solid #dbdfea",
            mb: 1,
            padding: "25px 16px 15px 16px",

            transition: "all 400ms ease",
          }}
          elevation={0}
          className="col-span-12 relative"
        >
          {" "}
          <div className="bg-[#198DFF] text-white flex justify-center items-center px-4 py-2 absolute -top-5 right-3 text-sm">
            عناوین استوری ها
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            {Array.from(Array(data?.storyLength).keys()).map((item, i) => (
              <Box className="w-full" sx={{ maxWidth: "150px" }} key={i}>
                <TextInput
                  label={`عنوان استوری ${i + 1}`}
                  change={(e) => {
                    var temp = data.stories
                      ? [...data?.stories]
                      : Array(data?.storyLength);
                    if (editMode) {
                      temp[i] = {
                        ...temp[i],
                        title: e,
                      };
                    } else {
                      temp[i] = {
                        title: e,
                        content: [],
                        banner: null,
                      };
                    }

                    setData({ ...data, stories: temp });
                  }}
                  currentValue={data?.stories ? data?.stories[i]?.title : ""}
                />
              </Box>
            ))}
          </div>
        </Paper>
      )}
    </>
  );
};

export default Stories;
