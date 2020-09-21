exports.handler = function (context, event, callback) {
  const client = context.getTwilioClient();
  client.taskrouter
    .workspaces(process.env.TWILIO_TR_WORKSPACE_SID)
    .tasks(event.taskSid)
    .update({
      assignmentStatus: 'completed',
      reason: 'worker requested',
    })
    .then(() => {
      console.log('Task completed');
      callback(null, '');
    })
    .catch((err) => {
      console.log(`task-complete:`, err);
      callback(500, null);
    });
};
