const { Reminders, Meetings } = require("../models");

const getAllMeetings = async (req, res) => {
  const meetings = await Meetings.find({});

  res.status(200).json({
    data: meetings,
    message: "Data fetched successfully",
  });
};

const createMeeting = async (req, res) => {
  const meeting = new Meetings({
    ...req.body,
  });

  console.log("Meetings", req.body);
  await meeting.save();

  res.status(201).json({
    data: meeting,
    message: "Meetings created successfully",
  });
};

const deleteMeeting = async (req, res) => {
  const { id } = req.params;

  const meeting = await Meetings.findOneAndDelete({ _id: id });

  if (!meeting) {
    res.status(404).json({
      message: `Cann't remove meeting. Meeting with id ${id} doesn't exist`,
    });
  }

  res.status(200).json({
    message: "Meetings removed from calendar",
  });
};

const updateMeeting = async (req, res) => {
  const { id } = req.params;

  const updatedMeeting = await Meetings.findOneAndUpdate(
    { _id: id },
    { $set: req.body },
    { new: true }
  );

  if (!updatedMeeting) {
    res.status(404).json({
      message: `Cann't update meeting. Meeting with id ${id} doesn't exist`,
    });
  }

  res.status(200).json({
    data: updatedMeeting,
    message: "Meetings removed from calendar",
  });
};

module.exports = {
  getAllMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
};
