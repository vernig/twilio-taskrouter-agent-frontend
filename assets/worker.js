var workerClient;
var worker;
var workerActivities = {};

// function log(message, type) {
//   document.getElementById('log').innerHTML += `<p class="${
//     type ? 'log-' + type : ''
//   }">${message}</p>`;
// }
function fetchActivities() {
  workerClient.activities.fetch(function (error, activityList) {
    for (let activity of activityList.data) {
      if (activity.friendlyName === 'Offline') {
        workerActivities.offline = activity.sid;
      } else if (activity.friendlyName === 'Available')
        workerActivities.available = activity.sid;
    }
  });
}

function toggleWorkerAvailability() {
  let newStatus = {
    ActivitySid: worker.available
      ? workerActivities.offline
      : workerActivities.available,
  };
  workerClient.update(newStatus, (error, workerInfo) => {
    worker = workerInfo;
    renderWorker(workerInfo);
  });
}

function acceptReservation(reservationSid) {
  workerClient.fetchReservations(function (error, reservations) {
    for (let reservation of reservations.data) {
      if (reservation.sid === reservationSid) {
        if (reservation.task.attributes.conference) {
          // There is already a conference, so it's likely a transfer
          console.log(
            'Joining conference ' +
              reservation.task.attributes.conference.room_name
          );
          reservation.call(
            null,
            `${window.location.protocol}://${window.location.hostname}/join-conference?conferenceRoomName=` +
              reservation.task.attributes.conference.room_name,
            null,
            true
          );
        } else {
          reservation.conference();
        }
        break;
      }
    }
  });
}

function transferCall(taskSid, workspaceSid) {
  Swal.fire({
    text: 'Who do you want to transfer the call to?',
    input: 'text',
  })
    .then((result) =>
      fetch(
        `/task-transfer?task_sid=${taskSid}&workspace=${workspaceSid}&workerName=${result.value}`
      )
    )
    .then(() => {
      updateReservations();
    });
}

function updateReservations() {
  workerClient.fetchReservations(function (error, reservations) {
    reservationGroup = document.getElementById('reservations-group');
    reservationGroup.innerHTML = '';
    reservations.data.forEach((reservation) => {
      if (reservation.reservationStatus !== 'timeout') {
        reservationGroup.innerHTML =
          `<li class="list-group-item">Reservation SID: ${
            reservation.sid
          }<br/>Reservation Status: ${
            reservation.reservationStatus
          }<br/>Task Status: ${
            reservation.task.assignmentStatus
          } ${renderReservationButtons(reservation)}</li>` +
          reservationGroup.innerHTML;
      }
    });
  });
}

function completeTask(taskSid) {
  fetch(`/task-complete?taskSid=${taskSid}`).then(() => {
    updateReservations();
  });
}

function renderReservationButtons(reservation) {
  let result = '';
  switch (reservation.reservationStatus) {
    case 'pending':
      result = `<button type="button" class="btn btn-primary float-right" onclick="this.disabled = true; this.textContent = 'Accepting...'; acceptReservation('${reservation.sid}')">Accept</button>`;
      break;
    case 'accepted':
      break;
    case 'canceled':
      break;
  }
  switch (reservation.task.assignmentStatus) {
    case 'assigned':
      result += `<button type="button" class="btn btn-info float-right ml-2" onclick="this.disabled = true; transferCall('${reservation.task.sid}', '${reservation.task.workspaceSid}')">Transfer Call</button>`;
    case 'wrapping':
      result += `<button type="button" class="btn btn-info float-right" onclick="this.disabled = true; completeTask('${reservation.task.sid}')">Complete task</button>`;
      break;
    case 'completed':
      result = '';
      break;
  }
  return result;
}

function renderWorker(workerInfo) {
  document.getElementById('worker-name').textContent = workerInfo.friendlyName;
  document.getElementById('worker-activity').textContent =
    workerInfo.activityName;
  document.getElementById('worker-available').textContent = workerInfo.available
    ? 'Available'
    : 'Not Available';

  updateReservations();
}

function enableButton(buttonId, className) {
  const button = document.getElementById(buttonId)
  button.classList.add(className)
  button.classList.remove('btn-outline-secondary')
  button.disabled = false;
}

function disableButton(buttonId, className) {
  const button = document.getElementById(buttonId)
  button.disabled = true;
  button.classList.add('btn-outline-secondary')
  button.classList.remove(className)
}

function registerTwilioDevice(clientId) {
  fetch(`/get-client-token?clientId=${clientId}`)
    .then((response) => response.json())
    .then((response) => {
      // Setup Twilio.Device
      device = new Twilio.Device(response.token, {
        codecPreferences: ['opus', 'pcmu'],
        enableRingingState: true,
        sounds: {"incoming": "/ring.mp3"}
      });

      device.on('ready', function (device) {
        console.log('Twilio.Device Ready!');
        document.getElementById('call-controls').style.display = 'block';
        document.getElementById('button-hangup').onclick = function () {
          console.log('Hanging up...');
          if (device) {
            device.disconnectAll();
          }
        };
      });

      device.on('error', function (error) {
        console.log('Twilio.Device Error: ' + error.message);
      });

      device.on('connect', function (conn) {
        console.log('Successfully established call!');
        disableButton('button-answer', 'btn-outline-success')
        enableButton('button-hangup', 'btn-outline-danger')
      });

      device.on('disconnect', function (conn) {
        console.log('Call ended.');
        disableButton('button-answer', 'btn-outline-success')
        disableButton('button-hangup', 'btn-outline-danger')
      });

      device.on('incoming', function (conn) {
        console.log('Incoming connection from ' + conn.parameters.From);
        enableButton('button-answer', 'btn-outline-success')
        document.getElementById('button-answer').onclick = () => {
          conn.accept();
        };
      });
    });
}

function registerWorker(workerSid) {
  fetch('/get-tr-token?workerSid=' + workerSid)
    .then((response) => response.text())
    .then((response) => {
      const WORKER_TOKEN = response;
      workerClient = new Twilio.TaskRouter.Worker(WORKER_TOKEN);

      workerClient.on('ready', function (workerInfo) {
        fetchActivities();
        worker = workerInfo;
        if (
          workerInfo.attributes.contact_uri &&
          workerInfo.attributes.contact_uri.startsWith('client:')
        ) {
          registerTwilioDevice(workerInfo.attributes.contact_uri.slice(7));
        } else {
          console.warn('Twilio Audio device not enabled. The worker "contact_uri" is either missing or not in the form "client:xxxx"')
        }
        renderWorker(workerInfo);
      });

      workerClient.on('reservation.created', function (reservation) {
        updateReservations();
      });

      workerClient.on('reservation.accepted', function (reservation) {
        updateReservations();
      });

      workerClient.on('reservation.canceled', function (reservation) {
        updateReservations();
      });
    });
}

if (!WORKER_SID) {
  window.alert(
    'Provide worker sid in the url: e.g. http://yourserver.com/worker.html?workerSid=WKXXXX'
  );
  // log('WORKER_SID variable missing!', 'error');
} else {
  registerWorker(WORKER_SID);
}
