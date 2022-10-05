const fetch = require("node-fetch");
const express = require("express");
const { TwitterApi } = require("twitter-api-v2");

var router = express.Router();

router.get("/getUserIdFromName/:username", async function (req, res) {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    };
    fetch(
      `https://api.twitter.com/2/users/by?usernames=${req.params.username}&user.fields=username`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        return res.send(data);
      });
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/getUserMentions/:username", async (req, res) => {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    };

    fetch(
      `https://api.twitter.com/2/users/by?usernames=${req.params.username}&user.fields=username`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data && data.data[0].id) {
          fetch(
            `https://api.twitter.com/2/users/${data.data[0].id}/mentions?expansions=author_id&user.fields=name&tweet.fields=created_at`,
            {
              headers,
            }
          )
            .then((response) => response.json())
            .then((data) => {
              return res.send(data);
            });
        }
      });
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/getUserFollowers/:userId", async (req, res) => {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    };

    fetch(`https://api.twitter.com/2/users/${req.params.userId}/followers`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        return res.send(data);
      });
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/getTweetById/:tweetId", async (req, res) => {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    };

    fetch(
      `https://api.twitter.com/2/tweets/${req.params.tweetId}?expansions=author_id&user.fields=name&tweet.fields=created_at`,
      {
        headers,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        return res.send(data);
      });
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/getTweetliked/:tweetId", async (req, res) => {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    };

    fetch(
      `https://api.twitter.com/2/tweets/${req.params.tweetId}/liking_users`,
      {
        headers,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        return res.send(data);
      });
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/getRetweets/:tweetId", async (req, res) => {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    };

    fetch(
      `https://api.twitter.com/2/tweets/${req.params.tweetId}/retweeted_by`,
      {
        headers,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        return res.send(data);
      });
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/getQuotedTweetsByTweetId/:tweetId", async (req, res) => {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    };

    fetch(
      `https://api.twitter.com/2/tweets/${req.params.tweetId}/quote_tweets?expansions=author_id&user.fields=name`,
      {
        headers,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        return res.send(data);
      });
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/getAllReplyForATweet/:tweetId", async function (req, res) {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    };
    // fetch(
    //   `https://api.twitter.com/2/tweets?ids=${req.params.tweetId}&tweet.fields=author_id,conversation_id,created_at,in_reply_to_user_id,referenced_tweets&expansions=author_id,in_reply_to_user_id,referenced_tweets.id&user.fields=name,username`,
    //   { headers }
    // )
    fetch(
      `https://api.twitter.com/2/tweets/search/recent?query=conversation_id:${req.params.tweetId}&tweet.fields=in_reply_to_user_id,author_id,created_at,conversation_id`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        return res.send(data);
      });
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/likeSpecificTweet/:tweetId", async (req, res) => {
  try {
    let { accessToken, accessTokenSecret, userId } = req.body;

    var T = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY,
      appSecret: process.env.TWITTER_CONSUMER_SECRET,
      accessToken: accessToken,
      accessSecret: accessTokenSecret,
    });

    let result = await T.v2.like(userId, req.params.tweetId);
    return res.send(result);
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/replyToTweetWithTweetId/:tweetId", async (req, res) => {
  try {
    let { tweetReply, accessToken, accessTokenSecret } = req.body;

    var T = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY,
      appSecret: process.env.TWITTER_CONSUMER_SECRET,
      accessToken: accessToken,
      accessSecret: accessTokenSecret,
    });

    let result = await T.v2.reply(tweetReply, req.params.tweetId);
    return res.send(result);
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/retweetATweet/:tweetId", async (req, res) => {
  try {
    let { userId, accessToken, accessTokenSecret } = req.body;

    var T = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY,
      appSecret: process.env.TWITTER_CONSUMER_SECRET,
      accessToken: accessToken,
      accessSecret: accessTokenSecret,
    });

    let result = await T.v2.retweet(userId, req.params.tweetId);
    return res.send(result);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
