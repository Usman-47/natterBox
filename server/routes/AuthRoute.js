const { signToken } = require("../util/tokenFunc");
const { verifyToken } = require("../util/tokenFunc");
const passport = require("passport");
const mongoose = require("mongoose");
const User = require("../model/userModel");

module.exports = (app) => {
  app.get("/auth/twitter", passport.authenticate("twitter"));
  app.get(
    "/oauth/callback/twitter.com",
    passport.authenticate("twitter"),
    (req, res) => {
      res.redirect("http://localhost:3000/Landing");
      // res.redirect("https://sols.game");
    }
  );

  app.get("/api/logout", (req, res) => {
    req.logOut();
    res.redirect("http://localhost:3000");
    // res.redirect("https://sols.game");
  });
  app.get("/api/current_user", (req, res) => {
    if (req.user) {
      const tokenPayload = {
        name: req.user.displayName,
        email: req.user.isVerified,
        publicKey: req.user.publicKey,
        id: req.user._id,
        role: req.user.role,
        accessToken: req.user.accessToken,
        accessTokenSecret: req.user.accessTokenSecret,
      };
      const token = signToken(tokenPayload);

      var raidStatus;
      if (!req.user.raidStatus) {
        raidStatus = "";
      } else {
        raidStatus = req.user.raidStatus;
      }

      if (req.user.rewardStatus) {
        res.send({
          token,
          msg: `Welcome ${req.user.displayName}`,
          type: "success",
          isVerified: req.user.isVerified,
          role: req.user.role,
          id: req.user.twitterId,
          userName: req.user.userName,
          userId: req.user._id,
          rewardStatus: req.user.rewardStatus,
          raidStatus,
          amountToPay: req.user.amountToPay,
          accessToken: req.user.accessToken,
          accessTokenSecret: req.user.accessTokenSecret,
        });
      } else {
        res.send({
          token,
          msg: `Welcome ${req.user.displayName}`,
          type: "success",
          isVerified: req.user.isVerified,
          role: req.user.role,
          id: req.user.twitterId,
          userName: req.user.userName,
          userId: req.user._id,
          raidStatus,
          amountToPay: req.user.amountToPay,
          accessToken: req.user.accessToken,
          accessTokenSecret: req.user.accessTokenSecret,
        });
      }
    } else {
      res.send(req.user);
    }
  });
  app.patch("/api/addUserWalletPublicKey", async (req, res) => {
    try {
      const existingUser = await User.findOne({
        publicKey: req.body.publicKey,
      });
      if (!existingUser) {
        let user = await User.findOneAndUpdate(
          {
            twitterId: req.body.twitterId,
          },
          { $set: { publicKey: req.body.publicKey } },
          { $set: true }
        );
        return res.send(user);
      } else {
        return res.send(existingUser);
      }
    } catch (err) {
      console.log(err, "Error");
    }
  });
  app.patch("/api/addUserRewardToken", async (req, res) => {
    try {
      let rewardStatus = req.body.rewardStatus;
      const existingUser = await User.findOneAndUpdate(
        {
          twitterId: req.body.twitterId,
        },
        { $push: { rewardStatus } }
      );
      if (!existingUser) {
        res.send("User Not Found");
      } else {
        res.send(existingUser.rewardStatus);
      }
    } catch (err) {
      console.log(err, "Error");
    }
  });

  app.patch("/api/updateRewardStatus", async (req, res) => {
    try {
      const tokenHeader = req.headers.authorization;

      if (!tokenHeader) {
        return res.status(404).send({
          msg: "No tokenHeader available, route only for authorised user",
          type: "error",
        });
      }
      const token = tokenHeader.split(" ")[1];
      if (!token) {
        return res
          .status(404)
          .send({ msg: "token tampered, please sign in", type: "error" });
      }
      const payLoad = verifyToken(token);
      if (!payLoad || typeof payLoad === "string") {
        return res
          .status(401)
          .send({ msg: "Request denied, please sign in", type: "error" });
      }
      let tweetId = req.body.tweetId;
      let projectName = req.body.projectName;
      const userStatusUpdated = await User.findOneAndUpdate(
        // {
        //   "rewardStatus.tweetId": tweetId,
        // },
        {
          rewardStatus: {
            $elemMatch: { tweetId: tweetId, projectName: projectName },
          },
        },
        {
          $set: {
            "rewardStatus.$.isRewardpaid": true,
            "rewardStatus.$.paidTime": req.body.time,
          },
        },
        {
          new: true,
        }
      );
      if (!userStatusUpdated) {
        res.send("User Not Found");
      } else {
        res.send(userStatusUpdated);
      }
    } catch (err) {
      console.log(err, "Error");
    }
  });

  app.patch("/api/updateRaidRewardStatus", async (req, res) => {
    try {
      const tokenHeader = req.headers.authorization;

      if (!tokenHeader) {
        return res.status(404).send({
          msg: "No tokenHeader available, route only for authorised user",
          type: "error",
        });
      }
      const token = tokenHeader.split(" ")[1];
      if (!token) {
        return res
          .status(404)
          .send({ msg: "token tampered, please sign in", type: "error" });
      }
      const payLoad = verifyToken(token);
      if (!payLoad || typeof payLoad === "string") {
        return res
          .status(401)
          .send({ msg: "Request denied, please sign in", type: "error" });
      }
      var userStatusUpdated;
      if (req.body.likeStatus) {
        userStatusUpdated = await User.findOneAndUpdate(
          {
            twitterId: req.body.twitterId,
          },

          {
            $push: {
              "raidStatus.likeStatus": req.body.likeStatus,
            },
          },
          {
            new: true,
          }
        );
      } else if (req.body.retweetStatus) {
        userStatusUpdated = await User.findOneAndUpdate(
          {
            twitterId: req.body.twitterId,
          },
          {
            $push: {
              "raidStatus.retweetStatus": req.body.retweetStatus,
            },
          },
          {
            new: true,
          }
        );
      } else if (req.body.replyStatus) {
        userStatusUpdated = await User.findOneAndUpdate(
          {
            twitterId: req.body.twitterId,
          },
          {
            $push: {
              "raidStatus.replyStatus": req.body.replyStatus,
            },
          },
          {
            new: true,
          }
        );
      } else {
        console.log("wrong data");
      }

      if (!userStatusUpdated) {
        res.send("User Not Found");
      } else {
        res.send(userStatusUpdated);
      }
    } catch (err) {
      console.log(err, "Error");
    }
  });
};
