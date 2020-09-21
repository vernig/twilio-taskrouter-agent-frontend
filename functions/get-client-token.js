const AccessToken = Twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

exports.handler = function (context, event, callback) {
  const identity = event.clientId;
  console.log('Generating voice client token for ', identity);

  if (!identity) {
    callback(401, '');
  }

  const accessToken = new AccessToken(
    process.env.ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET
  );
  accessToken.identity = identity;
  const grant = new VoiceGrant({
    // TODO: enable outbound calling
    // outgoingApplicationSid: config.twimlAppSid,
    incomingAllow: true,
  });
  accessToken.addGrant(grant);

  callback(
    null,
    JSON.stringify({
      identity: identity,
      token: accessToken.toJwt(),
    })
  );
};
