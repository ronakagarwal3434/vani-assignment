const fast2sms = require("fast-two-sms");

const sendSMS = async (to, message) => {
    try {
        var options = {
            authorization: process.env.FAST2SMS_API_KEY,
            message,
            numbers: [to],
        };
        const response = await fast2sms.sendMessage(options);
        console.log(response);
    } catch (err) {
        console.log(err);
    }
};

const AddMinutesToDate = (date, minutes) => {
    return new Date(date.getTime() + minutes * 60000);
};

module.exports = {
    sendSMS,
    AddMinutesToDate,
};
