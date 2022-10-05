const mongoose = require("mongoose");
const User = require("./userModel");
const schema = mongoose.Schema;

const rewardSchema = schema({
  users: [
    {
      tweetId: {
        type: String,
      },
      userId: {
        type: String,
      },
      tweetStatus: {
        type: String,
      },
      isPaid: {
        type: Boolean,
        default: false,
      },
      reawrdAmount: {
        type: String,
      },
      projectName: {
        type: String,
        required: true,
      },
      mintAddress: {
        type: String,
      },
      isRaid: {
        type: Boolean,
      },
      invoiceCreaterPublicKey: {
        type: String,
        required: true,
      },
      userPublicKey: {
        type: String,
        required: true,
      },
    },
  ],
});

const Invoice = mongoose.model("Reward", rewardSchema, "rewardCollection");

module.exports = Invoice;
