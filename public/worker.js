var worker;

// function log(message, type) {
//   document.getElementById('log').innerHTML += `<p class="${
//     type ? 'log-' + type : ''
//   }">${message}</p>`;
// }

function acceptReservation(reservationSid) {
  worker.fetchReservations(function(error, reservations) {
    for (let reservation of reservations.data) {
      if (reservation.sid === reservationSid) {
        reservation.conference();
        break;
      }
    }
  });
}

function transferCall(taskSid, workspaceSid) {
  Swal.fire({
    text: 'Who do you want to trasnfer the call to?',
    input: 'text'
  })
    .then(result =>
      fetch(
        `/transfer?task_sid=${taskSid}&workspace=${workspaceSid}&workerName=${result.value}`
      )
    )
    .then(() => {
      updateReservations();
    });
}

function updateReservations() {
  worker.fetchReservations(function(error, reservations) {
    reservationGroup = document.getElementById('reservations-group');
    reservationGroup.innerHTML = '';
    reservations.data.forEach(reservation => {
      reservationGroup.innerHTML =
        `<li class="list-group-item">SID: ${reservation.sid} -  Status: ${
          reservation.reservationStatus
        } - Task Status: ${
          reservation.task.assignmentStatus
        } ${renderReservationButtons(reservation)}</li>` +
        reservationGroup.innerHTML;
    });
  });
}

function completeTask(taskSid) {
  fetch(`/complete-task?taskSid=${taskSid}`).then(() => {
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
      if (reservation.task.assignmentStatus == 'wrapping') {
        result = `<button type="button" class="btn btn-info float-right" onclick="this.disabled = true; completeTask('${reservation.task.sid}')">Complete task</button>`;
      } else if (reservation.task.assignmentStatus == 'completed') {
        result = '';
      } else if (reservation.task.assignmentStatus == 'assigned') {
        result = `<button type="button" class="btn btn-info float-right" onclick="this.disabled = true; transferCall('${reservation.task.sid}', '${reservation.task.workspaceSid}')">Transfer Call</button>`;
      }
      break;
    case 'canceled':
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

function registerWorker(workerSid) {
  fetch('/get-token?workerSid=' + workerSid)
    .then(response => response.text())
    .then(response => {
      const WORKER_TOKEN = response;
      worker = new Twilio.TaskRouter.Worker(WORKER_TOKEN);

      worker.on('ready', function(workerInfo) {
        renderWorker(workerInfo);
      });

      worker.on('reservation.created', function(reservation) {
        updateReservations();
      });

      worker.on('reservation.accepted', function(reservation) {
        updateReservations();
      });

      worker.on('reservation.canceled', function(reservation) {
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
