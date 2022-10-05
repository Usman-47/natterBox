import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import useStatesFunc from "../hooks/useStatesFunc";
import { useWallet } from "@solana/wallet-adapter-react";
import Button from "@mui/material/Button";
import { web3 } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
} from "@solana/spl-token";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import IDL from "./twitter_program.json";

const UserMentions = ({ currentUser, data }) => {
  const [{ token }] = useStatesFunc();

  const [getClientMentions, setGetClientMentions] = useState();
  const { wallet, connect, sendTransaction, connecting, publicKey } =
    useWallet();
  const [projectName, setProjectName] = useState(data.projectName);
  const [mentionUserTweet, setMentionUserTweet] = useState([""]);
  const [mentionUserFallowers, setMentionUserFallowers] = useState("");
  const [rewardCategory, setRewardCategory] = useState("");
  const [claimStartTime, setClaimStartTime] = useState("");
  const [rewardToken, setRewardToken] = useState("");
  const [userCreatedTweets, setUserCreatedTweets] = useState("");
  const [rewardTokenForClaim, setRewardTokenForClaim] = useState("");
  const [tweetTextForTweetCreation, setTweetTextForTweetCreation] =
    useState("");
  const [userCreatedTweetAt, setUserCreatedTweetAt] = useState("");
  const [rewardFrequencyToClaimReward, setRewardFrequencyToClaimReward] =
    useState("");
  const [tweetForReward, setTweetForReward] = useState("");
  const [isRewardPaid, setIsRewardPaid] = useState(false);
  const [rewardClaimTime, setRewardClaimTime] = useState("");

  const [userSelectTweetForClaim, setUserSelectTweetForClaim] = useState("");
  useEffect(() => {
    if (data) {
      setProjectName(data.projectName);
    }
  }, [data]);
  const solConnection = new web3.Connection(
    web3.clusterApiUrl("devnet"),
    "processed"
  );

  let cloneWindow = window;
  let provider = new anchor.Provider(
    solConnection,
    cloneWindow["solana"],
    anchor.Provider.defaultOptions()
  );
  const program = new anchor.Program(
    IDL,
    "6GfMewRfdC6ArLcg2oNbwq9mfE87UorRYRvGJApbVGrk",
    provider
  );

  const checkWalletNfts = async () => {
    const allNFTs = await Metadata?.findDataByOwner(solConnection, publicKey);
    return allNFTs;
  };
  const createTweet = async () => {
    try {
      if (tweetForReward === "" || rewardToken === "") {
        toast.error("Please select tweet and reward token");
        return;
      }
      let tweetId = tweetForReward;
      if (publicKey) {
        const data = {
          rewardStatus: {
            rewardToken,
            tweetId,
            projectName,
            tweetText: tweetTextForTweetCreation,
            tweetCreatedAt: moment().unix(),
          },
          twitterId: currentUser?.id,
        };

        const response = await axios.patch(
          `${process.env.REACT_APP_SERVERURL}/api/addUserRewardToken`,
          data,
          {
            headers: {
              Authorization: `BEARER ${currentUser.token}`,
            },
          }
        );
        if (response) {
          window.location.reload();
        }
      }
      // console.log(tx, "tx");
      // return tx;
    } catch (e) {
      console.log(e);
      alert("Something went wrong");
    }
  };

  const claimReward = async (rewardAmount) => {
    try {
      const id = parseInt(Math.random() * 250);
      const id2 = parseInt(Math.random() * 250);

      const clientAddress = new PublicKey(data?.invoiceCreaterPublicKey);

      const mintAddress = new PublicKey(rewardTokenForClaim);
      if (publicKey) {
        const [poolAta] = await anchor.web3.PublicKey.findProgramAddress(
          [
            anchor.utils.bytes.utf8.encode("poolAta"),
            clientAddress.toBuffer(),
            mintAddress.toBuffer(),
            Buffer.from(projectName),
          ],
          program.programId
        );

        console.log(poolAta.toString(), "poolAta");

        const [poolAddress] = await anchor.web3.PublicKey.findProgramAddress(
          [
            anchor.utils.bytes.utf8.encode("pool"),
            clientAddress.toBuffer(),
            mintAddress.toBuffer(),
            Buffer.from(projectName),
          ],
          program.programId
        );

        console.log(poolAddress.toString(), "poolAddress");
        const userAtaCheck = await solConnection.getTokenAccountsByOwner(
          provider.wallet.publicKey,
          { mint: mintAddress }
        );

        let userAta = (
          await PublicKey.findProgramAddress(
            [
              provider.wallet.publicKey.toBuffer(),
              TOKEN_PROGRAM_ID.toBuffer(),
              mintAddress.toBuffer(), // mint address
            ],
            ASSOCIATED_TOKEN_PROGRAM_ID
          )
        )[0];

        console.log(userAta.toString(), "associatedTokenAccountPubkey");

        const [globalAuth, globalBump] =
          await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from("global-authority")],

            program.programId
          );
        console.log(globalAuth.toString(), "globalAuth");
        const globalAta = await solConnection.getTokenAccountsByOwner(
          globalAuth,
          { mint: mintAddress }
        );

        globalAta.value.map((item) => {
          console.log(item.pubkey.toString());
        });

        if (userAtaCheck.value.length > 0) {
          const tx = await program.rpc.claimReward(
            new anchor.BN(47),
            new anchor.BN(162),
            globalBump,
            new anchor.BN(rewardAmount * 1000000000),
            {
              accounts: {
                user: provider.wallet.publicKey,

                globalAuthority: globalAuth,

                pool: poolAddress,
                poolAta: poolAta,
                userAta: userAta,
                poolMint: mintAddress,

                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
              },
            }
          );
          console.log(tx, "tx");
          return tx;
        } else {
          console.log("2nd condition");
          let instructions = [
            Token.createAssociatedTokenAccountInstruction(
              ASSOCIATED_TOKEN_PROGRAM_ID,
              TOKEN_PROGRAM_ID,
              mintAddress,
              userAta,
              provider.wallet.publicKey,
              provider.wallet.publicKey
            ),
          ];
          const tx = await program.rpc.claimRewardInit(
            new anchor.BN(47),
            new anchor.BN(162),
            globalBump,
            projectName,
            new anchor.BN(rewardAmount * 1000000000),
            {
              accounts: {
                user: provider.wallet.publicKey,
                // client: clientAddress,

                globalAuthority: globalAuth,

                pool: poolAddress,
                poolAta: poolAta,

                userAta: userAta,

                poolMint: mintAddress,

                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
                rent: SYSVAR_RENT_PUBKEY,
              },
              instructions,
            }
          );
          console.log(tx, "tx");
          return tx;
        }
      } else {
        alert("connect wallet");
      }
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };
  const checkClientMentionByOthers = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVERURL}/tweet/getUserMentions/${data?.projectTwitterUsername}`,
      {
        headers: {
          Authorization: `BEARER ${token}`,
        },
      }
    );
    setGetClientMentions(res.data);
  };

  const getMentionUserTweet = async () => {
    var tempArray = [];
    getClientMentions?.data?.map((tweet) => {
      let isTweetCreated = userCreatedTweets.some(
        (item) => item.tweetId === tweet.id
      );
      if (tweet?.author_id === currentUser?.id && !isTweetCreated) {
        tempArray.push(tweet);
      }
    });
    setMentionUserTweet(tempArray);
  };

  useEffect(() => {
    if (getClientMentions) {
      getMentionUserTweet();
    }
  }, [getClientMentions]);

  useEffect(() => {
    var tempArray = [];

    currentUser?.rewardStatus?.map((status) => {
      if (projectName === status.projectName) {
        tempArray.push(status);
      }
    });
    setUserCreatedTweets(tempArray);
    // setTweetForReward(tempArray[0]?.tweetId);
  }, [currentUser, projectName]);

  useEffect(() => {
    if (data?.projectTwitterUsername) {
      checkClientMentionByOthers();
    }
  }, [data?.projectTwitterUsername]);

  const getCurrentUserFollower = async () => {
    if (!currentUser?.id) {
      alert("Please sigin first");
      return;
    }
    const res = await axios.get(
      `${process.env.REACT_APP_SERVERURL}/tweet/getUserFollowers/${currentUser?.id}`,
      {
        headers: {
          Authorization: `BEARER ${token}`,
        },
      }
    );
    setMentionUserFallowers(res?.data?.data?.length);
  };

  useEffect(() => {
    if (currentUser?.id && rewardTokenForClaim) {
      getCurrentUserFollower();
    }
  }, [rewardTokenForClaim, currentUser?.id]);

  useEffect(() => {
    if (rewardTokenForClaim) {
      data?.pool?.map((data) => {
        if (data.splToken === rewardTokenForClaim) {
          setRewardCategory(data.category);
          setClaimStartTime(parseInt(data.startTime));

          var rewardFrequencyInSecond = 86400;
          if (data.rewardFrequency === "week") {
            rewardFrequencyInSecond = 7 * 86400;
          } else if (data.rewardFrequency === "month") {
            rewardFrequencyInSecond = 30 * 86400;
          }
          setRewardFrequencyToClaimReward(rewardFrequencyInSecond);
        }
      });
    }
  }, [rewardTokenForClaim]);
  useEffect(() => {
    var latestPaidTime = 0;
    var latestRewardToken = 0;
    if (currentUser?.rewardStatus) {
      currentUser?.rewardStatus?.map((status) => {
        if (status.projectName === projectName) {
          if (status.isRewardpaid === true) {
            if (parseInt(status.paidTime) > latestPaidTime) {
              latestPaidTime = parseInt(status.paidTime);
              latestRewardToken = status.rewardToken;
            }
          }
        }
      });
    }
    setRewardClaimTime(latestPaidTime);
  }, [currentUser]);

  const checkIsRewardPaid = () => {
    if (userSelectTweetForClaim) {
      if (currentUser?.rewardStatus) {
        currentUser?.rewardStatus?.map((status) => {
          if (
            status.tweetId === userSelectTweetForClaim &&
            status.projectName === projectName
          ) {
            if (status.isRewardpaid === true) {
              setIsRewardPaid(true);
            } else {
              setIsRewardPaid(false);
            }
          }
        });
      } else {
        alert("You have not created any tweet");
      }
    } else {
      alert("Select tweet before claim");
    }
  };

  useEffect(() => {
    if (userSelectTweetForClaim) {
      checkIsRewardPaid();
      userCreatedTweets?.map((tweet) => {
        if (userSelectTweetForClaim === tweet.tweetId) {
          setRewardTokenForClaim(tweet?.rewardToken);
          setUserCreatedTweetAt(parseInt(tweet?.tweetCreatedAt));
        }
      });
    }
  }, [userSelectTweetForClaim]);
  const claimRewardWithSolana = async () => {
    try {
      if (isRewardPaid) {
        toast.error("you have applied");
        return;
      }

      if (claimStartTime + rewardFrequencyToClaimReward > moment().unix()) {
        toast.error("reward claim time is not reached after start time");
        return;
      }
      if (
        parseInt(rewardClaimTime) + rewardFrequencyToClaimReward >
        moment().unix()
      ) {
        toast.error(
          "early claim is not allowed after the claim of another tweet"
        );
        return;
      }
      if (userCreatedTweetAt + rewardFrequencyToClaimReward > moment().unix()) {
        toast.error("you tweet must be old enough");
        return;
      }
      var isClaimAble = true;
      var countNfts = 0;
      if (data?.mintCreatorAddress) {
        isClaimAble = false;
      }
      let allCreatorOfWallet = await checkWalletNfts();

      if (allCreatorOfWallet && allCreatorOfWallet.length > 0) {
        allCreatorOfWallet?.map((metadata) => {
          metadata?.data?.creators?.map((creator) => {
            if (data?.mintCreatorAddress === creator?.address) {
              countNfts++;
            }
          });
        });
        if (countNfts >= data?.numberOfNft) {
          isClaimAble = true;
        }
      }
      if (!isClaimAble) {
        toast.error(
          `You don't have the enough tokens of ${data?.mintCreatorAddress} candy machine`
        );
        return;
      }
      if (userSelectTweetForClaim === "") {
        toast.error("Please select a tweet First");
        return;
      }
      if (rewardTokenForClaim === "") {
        toast.error("Reward Token Not Found");
        return;
      }
      if (!data && !mentionUserFallowers) {
        toast.error("No tweet data found");
        return;
      }

      var reward = 0;

      if (mentionUserFallowers >= 2 && mentionUserFallowers <= 99) {
        reward = rewardCategory[0];
      } else if (mentionUserFallowers >= 100 && mentionUserFallowers <= 299) {
        reward = rewardCategory[1];
      } else if (mentionUserFallowers >= 300 && mentionUserFallowers <= 499) {
        reward = rewardCategory[2];
      } else if (mentionUserFallowers >= 500 && mentionUserFallowers <= 999) {
        reward = rewardCategory[3];
      } else if (mentionUserFallowers >= 1000 && mentionUserFallowers <= 4999) {
        reward = rewardCategory[4];
      } else if (mentionUserFallowers >= 5000 && mentionUserFallowers <= 9999) {
        reward = rewardCategory[5];
      } else if (mentionUserFallowers >= 10000) {
        reward = rewardCategory[6];
      }

      // let txResult = await claimReward(reward);

      // let result = await solConnection.confirmTransaction(txResult);

      const body = {
        tweetId: userSelectTweetForClaim,
        projectName,
        mintAddress: rewardTokenForClaim,
        isRaid: false,
        // poolAddress,
        invoiceCreaterPublicKey: data.invoiceCreaterPublicKey,
        userPublicKey: publicKey,
      };

      const response = await axios.patch(
        `${process.env.REACT_APP_SERVERURL}/reward/addRewardRecord`,
        body,
        {
          headers: {
            Authorization: `BEARER ${currentUser.token}`,
          },
        }
      );

      if (response) {
        const data = {
          tweetId: userSelectTweetForClaim,
          projectName,
          time: moment().unix(),
        };
        const response = await axios.patch(
          `${process.env.REACT_APP_SERVERURL}/api/updateRewardStatus`,
          data,
          {
            headers: {
              Authorization: `BEARER ${currentUser.token}`,
            },
          }
        );
        if (response) {
          window.location.reload();
        }
      }
    } catch (e) {
      console.log(e, "Something went wrong");
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    if (tweetForReward) {
      mentionUserTweet.map((tweet) => {
        if (tweet.id === tweetForReward) {
          setTweetTextForTweetCreation(tweet?.text);
        }
      });
    }
  }, [tweetForReward]);
  return (
    <>
      {/* <div>Project: {projectName}</div> */}

      <div className="mb-3">
        <label
          className="form-label"
          htmlFor="userType"
          style={{ color: "white" }}
        >
          Reward Token
        </label>
        {data?.pool ? (
          <select
            className="form-select"
            id="splToken"
            required={true}
            // defaultValue={data?.pool[0].splToken}
            value={rewardToken}
            onChange={(e) => {
              setRewardToken(e.target.value);
            }}
          >
            {!rewardToken ? <option value={""}>{"Select Token"}</option> : null}
            {data?.pool?.map((pool, i) => (
              <>
                <option
                  key={i}
                  style={{ fontSize: "12px" }}
                  value={pool.splToken}
                >
                  {pool.splToken}
                </option>
              </>
            ))}
          </select>
        ) : null}
      </div>
      {mentionUserTweet?.length > 0 ? (
        <div className="mb-3">
          <label
            className="form-label"
            htmlFor="userType"
            style={{ color: "white" }}
          >
            Select Your Tweet For Reward
          </label>
          <select
            className="form-select"
            id="splToken"
            required={true}
            // defaultValue={mentionUserTweet[0]?.id}
            value={tweetForReward}
            onChange={(e) => {
              setTweetForReward(e.target.value);
            }}
          >
            {!tweetForReward ? (
              <option value={""}>{"Select Tweet"}</option>
            ) : null}
            {mentionUserTweet.map((tweet, i) => (
              <>
                <option key={i} value={tweet.id}>
                  {tweet.text}
                </option>
              </>
            ))}
          </select>
        </div>
      ) : null}
      {mentionUserTweet?.length > 0 ? (
        <Button
          id="headings"
          style={{ marginBottom: "20px" }}
          variant="contained"
          onClick={createTweet}
        >
          Verify
        </Button>
      ) : null}
      {userCreatedTweets.length > 0 ? (
        <div className="mb-3">
          <label
            className="form-label"
            htmlFor="userType"
            style={{ color: "white" }}
          >
            Select Your Tweet For Claim Reward
          </label>
          {userCreatedTweets ? (
            <select
              className="form-select"
              id="splToken"
              required={true}
              // defaultValue={userCreatedTweets[0]?.tweetId}
              value={userSelectTweetForClaim}
              onChange={(e) => {
                setUserSelectTweetForClaim(e.target.value);
              }}
            >
              {!userSelectTweetForClaim ? (
                <option value={""}>{"Select Tweet For Claim"}</option>
              ) : null}
              {userCreatedTweets &&
                userCreatedTweets?.map((tweet, i) => (
                  <>
                    <option key={i} value={tweet.tweetId}>
                      {tweet.tweetText ? tweet.tweetText : tweet.tweetId}
                    </option>
                  </>
                ))}
            </select>
          ) : null}
        </div>
      ) : null}
      {userCreatedTweets &&
        userCreatedTweets?.map((tweet, i) => {
          // if (tweet.projectName !== rewardPaidProjectName) {
          return (
            <Button
              key={i}
              id="headings"
              style={{ marginBottom: "20px" }}
              variant="contained"
              onClick={claimRewardWithSolana}
            >
              Claim
            </Button>
          );
          // }
        })}
    </>
  );
};
export default UserMentions;
