const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);

// Using this all the query performed in this schema are very fast
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })

// Pre middleware runs every time before save
connectionRequestSchema.pre("save", function (next) {
    const connectionRequest =  this;
    // Check if the fromUserId is same as toUserId
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Can not sant connectionrequest to yourself!")
    }
    next();
})

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequests",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
