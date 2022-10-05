import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Icon } from "@iconify/react";
import { Divider, Grid } from "@mui/material";
import { minHeight } from "@mui/system";
export default function RewardCards() {
  const array = [
    {
      title: "Solana Wallet",
      src: "solana.png",
      btnText: "Select Solana Wallet",
    },
    {
      title: "Ethereum Wallet",
      src: "ethereum.png",
      btnText: "Select Ethereum Wallet",
    },
    { title: "Twitter", src: "twitter.png", btnText: "Connect Your Tweeter" },
  ];

  return (
    <>
      <Grid
        className="justify-content-xl-center"
        container
        sx={{ width: "100%", marginBottom: "10px", marginTop: "5px" }}
      >
        {array.map((item, i) => {
          return (
            <Grid key={i} item xs={11} md={6} xl={4} padding="5px">
              <Card className="rewards_card" sx={{ width: "100%" }}>
                <Typography
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                    component="div"
                  >
                    {i === 0 && (
                      <img
                        width={"40px"}
                        height={"40px"}
                        src={item.src}
                        alt="solana"
                      />
                    )}
                    {i === 1 && (
                      <img width={"30px"} src={item.src} alt="solana" />
                    )}
                    {i === 2 && (
                      <img width={"45px"} src={item.src} alt="solana" />
                    )}
                    <Typography
                      gutterBottom
                      variant="h6"
                      marginTop="10px"
                      color="white"
                      component="div"
                    >
                      {item.title}
                    </Typography>
                  </Typography>

                  <Typography sx={{ color: "white" }}>
                    0.050 sol <br />
                    <span
                      sx={{
                        fontSize: "10.9755px",
                        color: "#47DDFC !important",
                      }}
                    >
                      12.2%
                    </span>
                  </Typography>
                </Typography>

                <CardContent></CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                  <Button
                    sx={{
                      background:
                        "linear-gradient(95.18deg, #55EEFF 25.5%, #A431D0 108%)",
                      borderRadius: "38.1004px",
                      color: "white",
                      fontSize: "10px",
                    }}
                    size="large"
                  >
                    <img width={"30px"} height={"30px"} src={item.src} />
                    {item.btnText}
                  </Button>
                  <Typography color="white" className="edit-icon">
                    <Icon icon="ant-design:edit-outlined" />
                  </Typography>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}
