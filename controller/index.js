const { Meetings } = require("../models");

const getAllMeetings = async (req, res) => {
  const { startDate, endDate, perPageCount = 10, page = 1 } = req.query;
  const query = {};
  const pipeline = [];

  if (startDate) {
    query.startDateTime = { $gte: startDate };
  }

  if (startDate && endDate) {
    query.startDateTime = { ...query.startDateTime, $lte: endDate };
  }

  pipeline.push(
    {
      $match: query,
    },
    {
      $skip: (Number(page) - 1) * Number(perPageCount),
    },
    {
      $limit: Number(perPageCount),
    }
  );

  const total = await Meetings.countDocuments();

  const meetings = await Meetings.aggregate(pipeline).exec();

  res.status(200).json({
    data: meetings,
    pagination: {
      page,
      perPageCount,
      total,
    },
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
