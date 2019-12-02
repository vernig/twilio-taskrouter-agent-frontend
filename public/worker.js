fetch('/get-token')
  .then(response => response.text())
  .then(response => {
    const WORKER_TOKEN = response;
    var worker = new Twilio.TaskRouter.Worker(WORKER_TOKEN);

    worker.on('ready', function(worker) {
      console.log(worker.sid); // 'WKxxx'
      console.log(worker.friendlyName); // 'Worker 1'
      console.log(worker.activityName); // 'Reserved'
      console.log(worker.available); // false
    });

    worker.on('reservation.created', function(reservation) {
      console.log(reservation.task.attributes); // {foo: 'bar', baz: 'bang' }
      console.log(reservation.task.priority); // 1
      console.log(reservation.task.age); // 300
      console.log(reservation.task.sid); // WTxxx
      console.log(reservation.sid); // WRxxx
      const button = document.getElementById('button-accept');
      button.disabled = false;
      button.onclick = () => {
        fetch(
          `/create-conference?TaskSid=${reservation.taskSid}&ReservationSid=${reservation.sid}`
        );
      };
    });
  });
