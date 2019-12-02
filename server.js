'use strict';

/**
 * Load Twilio configuration from .env config file
 */
require('dotenv').load();

const http = require('http');
const express = require('express');
const cors = require('cors');
const ngrok = require('ngrok');

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_ACCOUNT_SECRET) {
  console.log(
    'Twilio credentials missing. Create a file named .env based on .env.template and add your Twilio Project credentials'
  );
  return;
}
// Twilio initialization
const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_ACCOUNT_SECRET
);

// Create Express webapp.
var app = express();

// Static pages goes in ./public folder
app.use(express.static('public'));

// Enable CORS (especially useful if you have to publish REST APIs)
app.use(cors());

var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/create-conference', function(request, response) {
  client.taskrouter
    .workspaces(process.env.TWILIO_TR_WORKSPACE_SID)
    .tasks(request.query.TaskSid)
    .reservations(request.query.ReservationSid)
    .update({
      instruction: 'conference'
      //  from: '+18001231234',
      //  statusCallback: 'https://www.example.com/ConferenceEvents',
      //  conferenceStatusCallbackEvent: ['start', 'end', 'join', 'leave', 'mute', 'hold']
    })
    .then(reservation => {
      console.log('Conference done');
      console.log(reservation.workerName);
      response.send();
    })
    .catch(error => {
      console.log(error);
      response.send();
    });
});

app.get('/transfer', function(request, response) {
  client.taskrouter.workspaces(request.query.workspace)
     .tasks(request.query.task_sid)
     .fetch()
     .then(task => {
        console.log('old task fetched')
        var taskAttributes = JSON.parse(task.attributes);
        taskAttributes.worker_name = "John Doe"
        client.taskrouter
          .workspaces(request.query.workspace)
          .tasks
          .create({taskChannel: 'voice', attributes: JSON.stringify(taskAttributes)})
          .then(newTask => {
            console.log('New task created')
            // Remove worker from the first conference 
            console.log(`Removing worker ${taskAttributes.conference.participants.worker} from conference ${taskAttributes.conference.sid}`)
            return client.conferences(taskAttributes.conference.sid)
            .participants(taskAttributes.conference.participants.worker)
            .remove()
          })
          .then(() => {
             console.log('Worker removed from conference') 
             response.send('');
          })
     })
     .catch(error => {
         console.log(error)
         response.send('')
     })

})

/**
 * Get TaskRouter token for worker
 */
app.get('/get-token', function(request, response) {
  const taskrouter = require('twilio').jwt.taskrouter;
  const util = taskrouter.util;

  const TaskRouterCapability = taskrouter.TaskRouterCapability;
  const Policy = TaskRouterCapability.Policy;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_ACCOUNT_SECRET;
  const workspaceSid = process.env.TWILIO_TR_WORKSPACE_SID;
  const workerSid = request.query.workerSid;

  const TASKROUTER_BASE_URL = 'https://taskrouter.twilio.com';
  const version = 'v1';

  const capability = new TaskRouterCapability({
    accountSid: accountSid,
    authToken: authToken,
    workspaceSid: workspaceSid,
    channelId: workerSid
  });

  console.log('Received token request for ' + workerSid)

  // Helper function to create Policy
  function buildWorkspacePolicy(options) {
    options = options || {};
    var resources = options.resources || [];
    var urlComponents = [
      TASKROUTER_BASE_URL,
      version,
      'Workspaces',
      workspaceSid
    ];

    return new Policy({
      url: urlComponents.concat(resources).join('/'),
      method: options.method || 'GET',
      allow: true
    });
  }

  // Event Bridge Policies
  var eventBridgePolicies = util.defaultEventBridgePolicies(
    accountSid,
    workerSid
  );

  // Worker Policies
  var workerPolicies = util.defaultWorkerPolicies(
    version,
    workspaceSid,
    workerSid
  );

  var workspacePolicies = [
    // Workspace fetch Policy
    buildWorkspacePolicy(),
    // Workspace subresources fetch Policy
    buildWorkspacePolicy({ resources: ['**'] }),
    // Workspace Activities Update Policy
    buildWorkspacePolicy({ resources: ['Activities'], method: 'POST' }),
    // Workspace Activities Worker Reserations Policy
    buildWorkspacePolicy({
      resources: ['Workers', workerSid, 'Reservations', '**'],
      method: 'POST'
    })
  ];

  eventBridgePolicies
    .concat(workerPolicies)
    .concat(workspacePolicies)
    .forEach(function(policy) {
      capability.addPolicy(policy);
    });

  response.send(capability.toJwt());
});

// Create http server and run it.
var server = http.createServer(app);
var port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log('Express server running on *:' + port);
  // Enable ngrok
  ngrok
    .connect({
      addr: port,
      subdomain: process.env.NGROK_SUBDOMAIN
    })
    .then(url => {
      console.log(`ngrok forwarding: ${url} -> http://localhost:${port}`);
    })
    .catch(e => {
      console.log('ngrok error: ', e);
    });
});
