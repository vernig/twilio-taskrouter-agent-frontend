/** Return taskrouter token
 *
 * @param string workerSid
 */

exports.handler = function (context, event, callback) {
  const taskrouter = Twilio.jwt.taskrouter;
  const util = taskrouter.util;

  const TaskRouterCapability = taskrouter.TaskRouterCapability;
  const Policy = TaskRouterCapability.Policy;

  const accountSid = process.env.ACCOUNT_SID;
  const authToken = process.env.AUTH_TOKEN;
  const workspaceSid = process.env.TWILIO_TR_WORKSPACE_SID;
  const workerSid = event.workerSid;

  const TASKROUTER_BASE_URL = 'https://taskrouter.twilio.com';
  const version = 'v1';

  if (!workerSid) {
    callback(401);
  }

  const capability = new TaskRouterCapability({
    accountSid: accountSid,
    authToken: authToken,
    workspaceSid: workspaceSid,
    channelId: workerSid,
  });

  console.log('Received token request for ' + workerSid);

  // Helper function to create Policy
  function buildWorkspacePolicy(options) {
    options = options || {};
    var resources = options.resources || [];
    var urlComponents = [
      TASKROUTER_BASE_URL,
      version,
      'Workspaces',
      workspaceSid,
    ];

    return new Policy({
      url: urlComponents.concat(resources).join('/'),
      method: options.method || 'GET',
      allow: true,
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
      method: 'POST',
    }),
    // Workspace Activities Task Reservations Policy - e.g. Create a conference
    buildWorkspacePolicy({
      resources: ['Tasks', '**'],
      method: 'POST',
    }),
    // Workspace Workers - Upsate status of workers
    buildWorkspacePolicy({
      resources: ['Workers', '*'],
      method: 'POST',
    }),
  ];

  eventBridgePolicies
    .concat(workerPolicies)
    .concat(workspacePolicies)
    .forEach(function (policy) {
      capability.addPolicy(policy);
    });

  callback(null, capability.toJwt().toString());
};
