exports.handler = function (context, event, callback) {
  const client = context.getTwilioClient();
  client.taskrouter
    .workspaces(request.query.workspace)
    .tasks(request.query.task_sid)
    .fetch()
    .then((task) => {
      console.log('old task fetched');
      var taskAttributes = JSON.parse(task.attributes);
      taskAttributes.target_worker_name =
        request.query.workerName || process.env.AGENT2_NAME;
      taskAttributes.conference.room_name = request.query.task_sid;
      client.taskrouter
        .workspaces(request.query.workspace)
        .tasks.create({
          taskChannel: 'voice',
          attributes: JSON.stringify(taskAttributes),
        })
        .then((newTask) => {
          console.log(
            'New task created for worker ' + taskAttributes.target_worker_name
          );
          // Remove worker from the first conference
          console.log(
            `Removing worker ${taskAttributes.conference.participants.worker} from conference ${taskAttributes.conference.sid}`
          );
          return client
            .conferences(taskAttributes.conference.sid)
            .participants(taskAttributes.conference.participants.worker)
            .remove();
        })
        .then(() => {
          console.log('Worker removed from conference');
          response.send('');
        });
    })
    .catch((error) => {
      console.log(error);
      response.send('');
    });
};
