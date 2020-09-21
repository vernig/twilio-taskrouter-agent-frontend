exports.handler = function (context, event, callback) {
  callback(
    null,
    `<Response><Dial><Conference>${event.conferenceRoomName}</Conference></Dial></Response>`
  );
};
