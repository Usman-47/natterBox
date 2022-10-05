import React, { useState } from "react";
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

const CreateInvoice = ({ auth }) => {
  const initialState = {
    projectName: "",
    projectTwitterUsername: "",
    discordForProjectContact: "",
    mintCreatorAddress: "",
    numberOfNft: "",
  };
  const [stateValues, setStateValues] = useState(initialState);
  const [isRaid, setIsRaid] = useState(false);

  const [{ token, loading }] = useStatesFunc();
  const [dispatch] = useDispatchFunc();
  const navigate = useNavigate();
  const [, , checkUserAccess] = useUserFunc();
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
      dispatch({ type: "loadingStop" });

      if (data.type === "success") {
        toast.success(data.msg);
        navigate("/app/invoice/readAll");
      } else {
        toast.error(data.msg);
        dispatch({ type: "loadingStop" });
      }
    } else {
      toast.error("Something went wrong");
      dispatch({ type: "loadingStop" });
    }
  };
  return (
    <>
      <div
        className="container my-5 p-3"
        style={{ background: "#2C2C2E", borderRadius: '19.5591px' }}
      >
        <FormGroup>
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
            label="Raid"
          />
        </FormGroup>
        <form className="p-md-3 text-white">
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
            <label className="form-label">Project Twitter Username</label>
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
            <label className="form-label">Creator Address For mint</label>
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
            <label className="form-label">Number of Nfts Required</label>
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
            style={{borderRadius: '19.5591px'}}
              className="btn btn-dark border-dark text-white w-100"
              type="button"
              onClick={(ev) => SubmitForm(ev)}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(mapStateToProps)(CreateInvoice);
