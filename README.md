# Proof of concept for Agent call transfer using Twilio TaskRouter

## Flow

This proof of concept makes use of routing based on worker name. The flow is the following: 
* A call comes in and a new task is created and assigned to Agent1
* Agent1 use the [Accept] button on his web page to accept the call and create a conference with the customer
* Once the conference is established, the Agent1 can use the [Transfer to Agent2] button to transfer the call
* This operation will: 
  * Create a new task with `woker_name` attribute set to Agent2 name 
  * Remove Agent1 from the conference
* Agent2 can now click on [Accept] to create a new conference between him and the customer
* Agent1 (that is no longer in the call) can now wrap-up and complete the task (not implemented in this proof of concept)

## Setup 

In order for this proof of concept to work, you need to setup a workflow in Taskrouter: 
* Have two workers (Agent1 and Agent2). For each of them make sure that (at least) the following attributes are defined: 
```
{"contact_uri":"<phone_number>","worker_name":"<name>"}
```
  * where: 
    * <phone_number>: is the phone number of the Agent1 (in this demo we use real phones, but the same can be achieved with sofphone and using the Twilio Voice SDK)
    * <name>: Name of the worker.
* Note down the Workers' SIDs and their names (i.e. `worker_name`) because you need them in the following steps
* Define a new workflow (or change the existing one) adding two filters: 
 * The first one has:
   * Matching task: `worker_name != "any"`
   * Worker expression: `task.worker_name == worker.worker_name`
 * The second one has
   * Matching task: `1==1`
* To ensure the incoming call are routed to Agent1, change the IVR that create a task when a calls comes in, to make sure the new task created has attributes `{"worker_name": "<name_of_agent1>"}`
 
## Start

* Rename `.env.template` to `.env`
* Fill in values for:
  * `TWILIO_ACCOUNT_SID`
  * `TWILIO_ACCOUNT_SECRET`: this is the Twilio account auth token
  * `TWILIO_TR_WORKSPACE_SID`: this is your Twilio Taskrouter Workspace id
  * `AGENT2_WORKER_NAME`: this is the name of the Agent2 worker
* Fill in the `WORKER_SID` constant in `public/agent1.html` and `public/agent2.html`. Agent1 is the one receiving the call and making the transfer to Agent2
* Install dependencies:
```
npm install
```
* Start server
```
npm start
```

* Open two browser tabs on
  * http://localhost:3000/agent1.html
  * http://localhost:3000/agent2.html
* Call the phone number from a phone 
* When the call comes in, the [Accept] button on `agent1.html` gets enabled
* Press the button, and a new call to the Agent1 phone is placed 
* The [Transfer to Agent2] button gets enabled on `agent1.html` 
* Once the call is on-going, press [Transfer to Agent2]
* A new task is created and reserved to Agent2
* Agent1 gets removed from the conference (this steps can be postponed to ensure warm transfering) 
* The [Accept] button on `agent2.html` gets enabled 
* Click on `agent2.html` [Accept] button
* A new call is established with Agent2 phone and he can now talk to the customer
