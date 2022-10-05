import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { Icon } from "@iconify/react";
import CardContent from "@mui/material/CardContent";
import React from "react";
import RewardCards from "./RewardCrads";

import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
const Account = () => {
  const array = [
    { title: "Note", src: "solana.png" },
    { title: "Membership Discounts", src: "ethereum.png" },
  ];

  const statisticsArray = [
    { title: "Whitelists Obtained" },
    { title: "Raffles Entered" },
    { title: "Raffle Tickets Bought" },
    { title: "Raffles Won" },
    { title: "Auctions Won" },
    { title: "Total $FORGE Spent " },
  ];
  return (
    <>
      <Typography
        sx={{ background: "", width: "90%", margin: "0 auto", }}
        component="div"
      >
        <RewardCards />

        {/* <Grid container className="justify-content-xl-center">
          {array.map((item) => {
            return (
              <>
                <Grid item xs={12} md={5.5} lg={5.7} margin="7px">
                  <Card className="rewards_card2" sx={{ width: "100%" }}>
                    <Typography sx={{ margin: "0 30px 0 30px" }}>
                      <Typography
                        sx={{
                          borderBottom: "1px solid gray",    
                        }}
                        component="div"
                      >
                        <Typography
                          gutterBottom
                          
                          color="white"
                          component="div"
                          sx={{
                            display: "flex",
                            gap:"5px",
                            fontSize: "20px !important",
                            alignItems: "center",
                          }}
                        >
                          <Icon color="#47DDFC" icon="fe:warning" />

                          {item.title}
                        </Typography>
                      </Typography>
                      
                      <CardContent>
                        <Typography color="white" variant="body2">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s,
                          when an unknown printer took a galley of type and
                          scrambled it to make a type specimen book. It has
                          survived not only five centuries, but also the leap
                          into electronic.
                        </Typography>
                      </CardContent>
                    </Typography>
                  </Card>
                </Grid>
              </>
            );
          })}
        </Grid>

        <Grid container>
          <Grid className="ms-lg-4 m-2" item xs={12} md={10} lg={9}>
            <Card className="rewards_card2" sx={{ width: "100%" }}>
              <Typography sx={{ margin: "0 30px 30px 30px" }}>
                <Typography
                  sx={{
                    marginBottom: "30px",
                  }}
                  component="div"
                >
                  <Typography
                    gutterBottom
                   
                    color="white"
                    component="div"
                    sx={{
                      display: "flex",
                      gap:"5px",
                      fontSize: "24px !important",
                      alignItems: "center",
                    }}
                  >
                    <Icon color="#47DDFC" icon="fe:warning" />
                    Statistics
                  </Typography>
                </Typography>

                <CardContent>
                  {statisticsArray.map((item) => {
                    return (
                      <>
                        <CardActions
                          sx={{
                            justifyContent: "space-between",
                            borderBottom: "1px solid gray",
                            padding: "unset !important",
                            color:"white"
                          }}
                          disableSpacing
                        >
                          <IconButton
                            className="iconBtn"
                            sx={{
                              fontSize: "13px",
                              alignItems: "center",
                              gap: "5px",
                            }}
                            aria-label="add to favorites"
                          >
                            {item.title}
                          </IconButton>

                          <IconButton
                            className="iconBtn"
                            sx={{ fontSize: "12px", gap: "5px" }}
                            aria-label="share"
                          >
                            0
                          </IconButton>
                        </CardActions>
                      </>
                    );
                  })}
                </CardContent>
              </Typography>
            </Card>
          </Grid>
        </Grid> */}
      </Typography>
    </>
  );
};

export default Account;
