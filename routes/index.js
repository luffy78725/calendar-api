const express = require("express");
const router = express.Router();

const {
  getAllMeetings,
  updateMeeting,
  deleteMeeting,
  createMeeting,
} = require("../controller");

router.route("/meetings").get(getAllMeetings).post(createMeeting);

router.route("/meetings/:id").patch(updateMeeting).delete(deleteMeeting);

module.exports = router;
