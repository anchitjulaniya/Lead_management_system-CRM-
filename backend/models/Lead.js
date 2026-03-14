const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
    },

    source: {
      type: String,
      enum: ["website", "referral", "cold"],
    },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "won", "lost"],
      default: "new",
    },
    notes: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

leadSchema.index({ createdBy: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ createdAt: -1 });

leadSchema.index({
  status: 1,
  source: 1,
  createdAt: -1,
});

module.exports = mongoose.model("Lead", leadSchema);
