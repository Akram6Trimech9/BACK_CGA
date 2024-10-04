require('dotenv').config();
const accountId = process.env.TWILIO_ID;
const authToken = process.env.TWILIO_TOKEN;

const client = require('twilio')(accountId, authToken);

const sendSms = async (body) => {
    const msgOptions = {
        from: process.env.PHONE_NUMBER,  
        to:process.env.TO_PHONE_NUMBER,   
        body: body                       
    };
    try {
        const message = await client.messages.create(msgOptions);
        console.log('Message sent:', message.sid);   
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
};

 module.exports = { sendSms };
