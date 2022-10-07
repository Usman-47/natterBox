import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";

import useStatesFunc from "../../../../hooks/useStatesFunc";
import useDispatchFunc from "../../../../hooks/useDispatchFunc";

import CreateInvoiceApi from "../../../../apis/private/Invoice/CreateInvoiceApi";

import MiniSpinner from "../../../../helpers/MiniSpinner";
import Loader from "../../../../helpers/Loader";

import NothingToShow from "../../Others/NothingToShow";
import { ADMIN, MANAGER } from "../../../../helpers/UserRoles";
import useUserFunc from "../../../../hooks/useUserFunc";
import { Tooltip, FormGroup, Switch, FormControlLabel } from "@mui/material";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {
  Keypair,
  Transaction,
  Connection,
  PublicKey,
  clusterApiUrl,
  SystemProgram,
} from "@solana/web3.js";
import {
  Token,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import * as bs58 from "bs58";
import { useWallet } from "@solana/wallet-adapter-react";
import AddPool from "./AddPool";
import ReadAllInvoices from "./ReadAllInvoices";
import AddTweet from "./AddTweet";

const steps = [
  {
    label: "Step 1",
  },
  {
    label: "Step 2",
  },
  {
    label: "Step 3",
  },
  {
    label: "Step 4",
  },
  {
    label: "Step 5",
  },
];

const CreateInvoice = ({ auth }) => {
  const { connect, publicKey } = useWallet();
  const initialState = {
    projectName: "",
    projectTwitterUsername: "",
    discordForProjectContact: "",
    mintCreatorAddress: "",
    numberOfNft: "",
  };
  const [activeStep, setActiveStep] = React.useState(0);
  const [stateValues, setStateValues] = useState(initialState);
  const [isRaid, setIsRaid] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [ProjectID, setProjectID] = useState();
  const [poolID, setPoolID] = useState();

  const [{ token, loading }] = useStatesFunc();
  const [dispatch] = useDispatchFunc();
  const navigate = useNavigate();
  const [, , checkUserAccess] = useUserFunc();

  const solConnection = new Connection(clusterApiUrl("devnet"));

  useEffect(() => {
    console.log(publicKey.toString());
  }, [publicKey]);

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  if (!checkUserAccess([ADMIN, MANAGER])) {
    toast.warning("You cant access");
    return (
      <>
        <NothingToShow />
      </>
    );
  }
  const SubmitForm = async (ev) => {
    ev.preventDefault();
    dispatch({ type: "loadingStart" });
    let body = {
      userId: auth?.userId,
    };
    const res = await axios.post(
      `${process.env.REACT_APP_SERVERURL}/wallet/new`,
      body,
      {
        headers: {
          Authorization: `BEARER ${token}`,
        },
      }
    );
    if (res.data.type === "success") {
      const {
        projectName,
        discordForProjectContact,
        projectTwitterUsername,
        mintCreatorAddress,
        numberOfNft,
      } = stateValues;

      if (
        !projectName ||
        !discordForProjectContact ||
        !projectTwitterUsername
      ) {
        toast.warning("No empty values allowed");
        dispatch({ type: "loadingStop" });

        return;
      }

      const body = {
        projectName,
        discordForProjectContact,
        projectTwitterUsername,
        mintCreatorAddress,
        numberOfNft,
        isRaid,
      };
      const { data } = await CreateInvoiceApi(body, token);
      console.log(data, "pooldataID");
      setProjectID(data?.createdInvoice?._id);
      dispatch({ type: "loadingStop" });

      if (data.type === "success") {
        toast.success(data.msg);
        setIsSuccessful(true);
        // navigate("/app/invoice/readAll");
      } else {
        toast.error(data.msg);
        dispatch({ type: "loadingStop" });
      }
    } else {
      toast.error("Something went wrong");
      dispatch({ type: "loadingStop" });
    }
  };
  // return (
  //   <>
  //     <div
  //       className="container my-5 p-3"
  //       style={{ background: "#2C2C2E", borderRadius: '19.5591px' }}
  //     >
  //       <FormGroup>
  //         <FormControlLabel
  //           className="text-white"
  //           control={
  //             <Switch
  //               checked={isRaid}
  //               onChange={(e) => {
  //                 setIsRaid(e.target.checked);
  //               }}
  //             />
  //           }
  //           label="Raid"
  //         />
  //       </FormGroup>
  //       <form className="p-md-3 text-white">
  //         {/* invoiceLogo */}
  //         <div className="mb-3">
  //           <label className="form-label">Project Name</label>
  //           <input
  //             type="text"
  //             id="tweetUrl"
  //             placeholder="Project Name"
  //             className="form-control"
  //             value={stateValues.tweetUrl}
  //             onChange={(e) =>
  //               setStateValues((prev) => ({
  //                 ...prev,
  //                 projectName: e.target.value,
  //               }))
  //             }
  //           />
  //         </div>

  //         <div className="mb-3">
  //           <label className="form-label">Project Twitter Username</label>
  //           <Tooltip
  //             title="Enter Twitter username without '@' sign, and without spaces."
  //             placement="top"
  //           >
  //             <input
  //               type="text"
  //               id="tweetUrl"
  //               placeholder="Project Twitter Username"
  //               className="form-control"
  //               value={stateValues.projectTwitterUsername}
  //               onChange={(e) =>
  //                 setStateValues((prev) => ({
  //                   ...prev,
  //                   projectTwitterUsername: e.target.value,
  //                 }))
  //               }
  //             />
  //           </Tooltip>
  //         </div>

  //         <div className="mb-3">
  //           <label className="form-label" htmlFor="timeToclaim">
  //             Discord For Project Contact
  //           </label>
  //           <input
  //             type="text"
  //             id="timeToclaim"
  //             placeholder="Discord For Project Contact"
  //             className="form-control"
  //             value={stateValues.discordForProjectContact}
  //             onChange={(e) =>
  //               setStateValues((prev) => ({
  //                 ...prev,
  //                 discordForProjectContact: e.target.value,
  //               }))
  //             }
  //           />
  //         </div>

  //         <div className="mb-3">
  //           <label className="form-label">Creator Address For mint</label>
  //           <input
  //             type="text"
  //             id="tweetUrl"
  //             placeholder="Address"
  //             className="form-control"
  //             value={stateValues.mintCreatorAddress}
  //             onChange={(e) =>
  //               setStateValues((prev) => ({
  //                 ...prev,
  //                 mintCreatorAddress: e.target.value,
  //               }))
  //             }
  //           />
  //         </div>

  //         <div className="mb-3">
  //           <label className="form-label">Number of Nfts Required</label>
  //           <input
  //             type="text"
  //             id="tweetUrl"
  //             placeholder="Require Number Of Nfts"
  //             className="form-control"
  //             value={stateValues.numberOfNft}
  //             onChange={(e) =>
  //               setStateValues((prev) => ({
  //                 ...prev,
  //                 numberOfNft: e.target.value,
  //               }))
  //             }
  //           />
  //         </div>

  //         {/* here btns */}
  //         <div className="mt-5 mb-3 col">
  //           {loading && (
  //             <>
  //               <MiniSpinner />
  //             </>
  //           )}

  //           <button
  //           style={{borderRadius: '19.5591px'}}
  //             className="btn btn-dark border-dark text-white w-100"
  //             type="button"
  //             onClick={(ev) => SubmitForm(ev)}
  //           >
  //             Submit
  //           </button>
  //         </div>
  //       </form>
  //     </div>
  //   </>
  // );

  // export default function VerticalLinearStepper() {

  const handleNext = () => {
    // if (!isSuccessful && activeStep > 0) {
    if (false) {
      alert("Submit form first");
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const getProvider = () => {
    if ("phantom" in window) {
      const provider = window.phantom?.solana;

      if (provider?.isPhantom) {
        return provider;
      }
    }

    window.open("https://phantom.app/", "_blank");
  };

  const handleTransferSol = async () => {
    let provider = getProvider();
    let tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey("1GtGo1TpFtHjHmDAL5KtwsRL1XDfhQTVvZv9AaRDE4C"),
        lamports: 1000000,
      })
    );
    tx.recentBlockhash = (await solConnection.getLatestBlockhash()).blockhash;
    tx.feePayer = publicKey;
    const { signature } = await provider.signAndSendTransaction(tx);
    await solConnection.getSignatureStatus(signature);
  };

  const handleTransferSpl = async () => {
    let senderAta = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      new PublicKey("TomsErt7q2wY3mUzMAJ8mU6pDNbxyTHA5gS44mPSfxm"),
      publicKey
    );

    let desAta = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      new PublicKey("TomsErt7q2wY3mUzMAJ8mU6pDNbxyTHA5gS44mPSfxm"),
      new PublicKey("1GtGo1TpFtHjHmDAL5KtwsRL1XDfhQTVvZv9AaRDE4C")
    );
    console.log(senderAta.toString(), "sender");
    console.log(desAta.toString(), "des");
    let provider = getProvider();
    let tx = new Transaction().add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        senderAta,
        desAta,
        publicKey,
        [],
        1000000
      )
    );
    tx.recentBlockhash = (await solConnection.getLatestBlockhash()).blockhash;
    tx.feePayer = publicKey;
    const { signature } = await provider.signAndSendTransaction(tx);
    await solConnection.getSignatureStatus(signature);
  };

  return (
    <Box sx={{ maxWidth: "85%", margin: "auto" }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <Typography>
              <StepLabel
                optional={
                  index === 4 ? (
                    <Typography variant="caption" sx={{ color: "white" }}>
                      Last step
                    </Typography>
                  ) : null
                }
              >
                <Typography variant="caption" sx={{ color: "white" }}>
                  {step.label}
                </Typography>
              </StepLabel>
            </Typography>

            <StepContent>
              {index === 0 ? (
                <div className="container my-5 p-3 border border-1 border-info rounded-3">
                  <FormGroup sx={{ width: "85%", margin: "auto" }}>
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          paddingX: "28px",
                          color: "white",
                        }}
                      >
                        {" "}
                        <label className="form-label">Mention</label>
                      </Typography>
                      <Typography>
                        <FormControlLabel
                          className="text-white"
                          control={
                            <Switch
                              checked={isRaid}
                              onChange={(e) => {
                                setIsRaid(e.target.checked);
                              }}
                            />
                          }
                        />
                      </Typography>
                      <Typography
                        sx={{
                          // paddingX: "10px",
                          color: "white",
                        }}
                      >
                        {" "}
                        <label className="form-label">Raid</label>
                      </Typography>
                    </Typography>
                  </FormGroup>
                </div>
              ) : index === 1 ? (
                <>
                  <Typography sx={{ width: "85%", margin: "auto" }}>
                    <form disabled className="p-md-3 text-white">
                      {/* invoiceLogo */}
                      <div className="mb-3">
                        <label className="form-label">Project Name</label>
                        <input
                          type="text"
                          id="tweetUrl"
                          placeholder="Project Name"
                          className="form-control"
                          value={stateValues.tweetUrl}
                          onChange={(e) =>
                            setStateValues((prev) => ({
                              ...prev,
                              projectName: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          Project Twitter Username
                        </label>
                        <Tooltip
                          title="Enter Twitter username without '@' sign, and without spaces."
                          placement="top"
                        >
                          <input
                            type="text"
                            id="tweetUrl"
                            placeholder="Project Twitter Username"
                            className="form-control"
                            value={stateValues.projectTwitterUsername}
                            onChange={(e) =>
                              setStateValues((prev) => ({
                                ...prev,
                                projectTwitterUsername: e.target.value,
                              }))
                            }
                          />
                        </Tooltip>
                      </div>

                      <div className="mb-3">
                        <label className="form-label" htmlFor="timeToclaim">
                          Discord For Project Contact
                        </label>
                        <input
                          type="text"
                          id="timeToclaim"
                          placeholder="Discord For Project Contact"
                          className="form-control"
                          value={stateValues.discordForProjectContact}
                          onChange={(e) =>
                            setStateValues((prev) => ({
                              ...prev,
                              discordForProjectContact: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          Creator Address For mint
                        </label>
                        <input
                          type="text"
                          id="tweetUrl"
                          placeholder="Address"
                          className="form-control"
                          value={stateValues.mintCreatorAddress}
                          onChange={(e) =>
                            setStateValues((prev) => ({
                              ...prev,
                              mintCreatorAddress: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          Number of Nfts Required
                        </label>
                        <input
                          type="text"
                          id="tweetUrl"
                          placeholder="Require Number Of Nfts"
                          className="form-control"
                          value={stateValues.numberOfNft}
                          onChange={(e) =>
                            setStateValues((prev) => ({
                              ...prev,
                              numberOfNft: e.target.value,
                            }))
                          }
                        />
                      </div>

                      {/* here btns */}
                      <div className="mt-5 mb-3 col">
                        {loading && (
                          <>
                            <MiniSpinner />
                          </>
                        )}

                        <button
                          style={{ borderRadius: "19.5591px" }}
                          className="btn btn-dark border-dark text-white w-100"
                          type="button"
                          onClick={(ev) => SubmitForm(ev)}
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </Typography>
                </>
              ) : // ) : isSuccessful && index === 2 ? (
              index === 2 ? (
                <>
                  <Typography sx={{ width: "85%", margin: "auto" }}>
                    <Button onClick={handleTransferSol}>Transfer Sols</Button>
                    <Button onClick={handleTransferSpl}>Transfer SPL</Button>
                  </Typography>
                </>
              ) : index === 3 ? (
                <>
                  <Typography sx={{ width: "85%", margin: "auto" }}>
                    {/* <ReadAllInvoices /> */}
                    {/* <ReadAllInvoices /> */}
                    {ProjectID && (
                      <AddPool projectId={ProjectID} setPoolID={setPoolID} />
                    )}
                  </Typography>
                </>
              ) : isRaid && index === 4 ? (
                <>{poolID && <AddTweet poolID={poolID} />}</>
              ) : null}

              <Box sx={{ width: "80%", margin: "auto" }}>
                <div sx={{}}>
                  <Button variant="contained" onClick={handleNext}>
                    {index === steps.length - 1 ? "Finish" : "Continue"}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
};

function mapStateToProps(state) {
  return { auth: state.auth };
}
export default connect(mapStateToProps)(CreateInvoice);
