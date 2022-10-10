import React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Icon } from "@iconify/react";
import IconButton from "@mui/material/IconButton";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import { Grid } from "@mui/material";

const TotalRaids = () => {
  const arr = [1, 2, 3, 4];
  return (
    <>
      {arr.map((item, i) => {
        return (
          <Grid key={i} item md={6}>
            <Typography component="div" sx={{ padding: "10px" }}>
              <CardHeader
                sx={{
                  // position: "absolute",
                  padding: "10px 10px 10px 10px",
                  bottom: "0",
                  left: "0",
                  width: "100%",
                  color: "white",
                  background:
                    "linear-gradient(98.97deg, #2C2C2E 1.64%, rgba(0, 0, 0, 0.5) 102.85%)",
                  border: "1px solid #313131",
                  borderRadius: "12px",
                }}
                avatar={
                  <Avatar
                    sx={{
                      //   bgcolor: red[500],
                      borderRadius: "10px",
                      background: "rgba(255, 255, 255, 0.03)",
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                      backdropFilter: "blur(2px)",
                    }}
                    aria-label="recipe"
                  >
                    <Icon color="#47DDFC" icon="ant-design:retweet-outlined" />
                  </Avatar>
                }
                action={
                  <IconButton
                    aria-label="settings"
                    sx={{
                      color: "white",
                    }}
                  >
                    {/* <MoreVertIcon /> */}
                    <Typography
                      className="raids_card"
                      component="div"
                      sx={{
                        width: "67px",
                        fontSize: "17px",
                        height: "44px",
                        // background: "#00ACEE",
                        // borderRadius: "50px 0px 0px 50px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      + 2SOL
                    </Typography>
                  </IconButton>
                }
                title="Total Raids"
                subheader="Earned SOLs"
              />
            </Typography>
          </Grid>
        );
      })}
    </>
  );
};

export default TotalRaids;
