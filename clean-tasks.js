require('dotenv').config();
const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_ACCOUNT_SECRET
);

client.taskrouter
  .workspaces(process.env.TWILIO_TR_WORKSPACE_SID)
  .tasks.list({})
  .then(tasks => {
      tasks.forEach(task => {
        client.taskrouter
        .workspaces(process.env.TWILIO_TR_WORKSPACE_SID)
        .tasks(task.sid)
        .remove()
        .then(result => {
            console.log(`Removing task ${task.sid}: ${result ? 'succesful' : 'failed!'}`)
        })
      })
  });
