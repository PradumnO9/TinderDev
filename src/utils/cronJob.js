const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequestsModel = require("../models/connectionRequest");
const sendEmail = require("./sendEmail");

// second minute hour dayOfMonth month dayOfWeek => meaning of * * * * * *

// Send emails to all people who got connection requests the previous day
// This job will run 8 AM in the morning everday
cron.schedule("0 8 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequestsOfYesterday = await ConnectionRequestsModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const listOfEmails = [
      ...new Set(pendingRequestsOfYesterday.map((req) => req.toUserId.emailId)),
    ];

    console.log(listOfEmails);

    for (const email of listOfEmails) {
      // Send Emails
      try {
        await sendEmail.run(
          "New pending connection requests for " + email,
          "There are pending connection requests, Please login to tinderdev.live and accept or reject."
        );
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.error(err);
  }
});
