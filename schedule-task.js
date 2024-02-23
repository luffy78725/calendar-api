const schedule = require("node-schedule");
const WebSocket = require("ws");
const { Meetings } = require("./models");
const INTERVAL = 5 * 60 * 1000;
let WebSocketServer = null;

const dayOfWeek = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thur: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
};

function sendMeetingReminder(meeting) {
  const message = `Meeting reminder for ${meeting.title}: Your meeting is in ${meeting.remindBefore} minutes!`;
  WebSocketServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      console.log("inside foreach");
      client.send(message);
    }
  });
  console.log(message);
}

async function scheduleReminderForMeetings() {
  const meetings = await Meetings.find({
    scheduled: { $ne: true },
    startDateTime: {
      $gt: new Date(),
    },
  }).lean();

  console.log("meetings to be schedule", meetings);

  meetings.forEach((meeting) => {
    if (!meeting.remindBefore) return;

    const reminderTime = new Date(
      new Date(meeting.startDateTime).getTime() -
        meeting.remindBefore * 60 * 1000
    );

    console.log("reminder Time", meeting._id, reminderTime);
    // Mark the meeting as scheduled to avoid scheduling it again
    Meetings.updateOne({ _id: meeting._id }, { $set: { scheduled: true } });

    if (meeting.reoccurences.days.length) {
      console.log("scheduling meetings for reoccurences");
      meeting.reoccurences.days.forEach((day) => {
        schedule.scheduleJob(
          {
            hour: reminderTime.getHours(),
            minute: reminderTime.getMinutes(),
            dayOfWeek: dayOfWeek[day],
          },
          sendMeetingReminder.bind(null, meeting)
        );
      });
    }

    console.log("scheduling standalone meetind");
    schedule.scheduleJob(reminderTime, sendMeetingReminder.bind(null, meeting));
  });
}

async function meetingScheduler(wss) {
  WebSocketServer = wss;
  console.log("scheduling meetings...");
  setInterval(scheduleReminderForMeetings, INTERVAL);

  console.log("Initial job scheduled at:", new Date());
}

module.exports = meetingScheduler;
