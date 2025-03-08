const { SendEmailCommand } = require("@aws-sdk/client-ses");

const { sesClient } = require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress, subject, emailBody) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<div><h1>${emailBody}</h1><p>This is a system generated email, Please don't reply.</p></div>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "This is the text format email",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

const run = async (subject, emailBody) => {
  const sendEmailCommand = createSendEmailCommand(
    "pradumn2999@gmail.com",
    "support@tinderdev.live",
    subject,
    emailBody
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

module.exports = { run };
