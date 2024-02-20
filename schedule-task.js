const schedule = require("node-schedule");
const { Meetings } = require("./models");
const INTERVAL = 2 * 60 * 1000;

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
  console.log(
    `Meeting reminder for ${meeting.title}: Your meeting is in ${meeting.remindBefore} minutes!`
  );
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

async function meetingScheduler() {
  console.log("scheduling meetings...");
  setTimeout(scheduleReminderForMeetings, 0);

  console.log("Initial job scheduled at:", new Date());
}

module.exports = meetingScheduler;
