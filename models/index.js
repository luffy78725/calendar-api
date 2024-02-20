const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is a required field"],
    maxLength: 100,
    trim: true,
  },
  description: {
    type: String,
    maxLength: 200,
    trim: true,
  },
  remindBefore: {
    type: Number,
  },
  scheduled: {
    type: Boolean,
    default: false,
  },
  reoccurences: {
    days: {
      type: [
        {
          type: String,
          enum: {
            values: ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"],
            message: `{VALUE} is not a supported value`,
          },
        },
      ],
    },
    startDate: Date,
    endDateTime: Date,
  },
});

const MeetingSchema = new mongoose.Schema({
  ...EventSchema.obj,
  startDateTime: {
    type: Date,
    default: new Date(),
    required: [true, "Start Date is a required field"],
  },
  endDateTime: {
    type: Date,
    default: new Date(),
    required: [true, "End Date is a required field"],
  },
  participants: {
    type: [
      {
        type: String,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      },
    ],
    validate: {
      validator: (value) => Array.isArray(value) && value.length > 0,
      message: "At-least one participant is required",
    },
  },
});

const ReminderSchema = new mongoose.Schema({
  ...EventSchema.obj,
  startDateTime: {
    type: Date,
    default: new Date(),
    required: [true, "Start Date is a required field"],
  },
});

const Reminders = new mongoose.model("Reminders", ReminderSchema);
const Meetings = new mongoose.model("Meetings", MeetingSchema);

module.exports = {
  Reminders,
  Meetings,
};
