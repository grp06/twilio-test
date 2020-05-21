const express = require('express');
const app = express();
const path = require('path');
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
require('dotenv').config();

const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = 'AC712594f590c0d874685c04858f7398f9' // Your Account SID from www.twilio.com/console
const twilioApiKeySID = 'SK9b4cc5527835003398414a1ed3e9fd1a'
const twilioApiKeySecret = 'l6LUelKF2BUtML2v4XoShZSmRppadYqI'

app.use(express.static(path.join(__dirname, 'build')));

app.get('/token', (req, res) => {
  const { identity, roomName } = req.query;
  const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
    ttl: MAX_ALLOWED_SESSION_DURATION,
  });
  token.identity = identity;
  const videoGrant = new VideoGrant({ room: roomName });
  token.addGrant(videoGrant);
  res.send(token.toJwt());
  console.log(`issued token for ${identity} in room ${roomName}`);
});

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'build/index.html')));

app.listen(8081, () => console.log('token server running on 8081'));
