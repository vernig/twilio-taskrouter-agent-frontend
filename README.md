# Proof of concept for Twilio TaskRouter agent frontend (with conference)

## Flow

This proof of concept makes use of routing based on worker name. The flow is the following: 
* A call comes in and a new task is created and assigned to Agent1
* Agent1 use the [Approve] button on his web page to accept the call and create a conference with the caller
* Once the conference is established, the Agent1 can use the [Transfer to Agent2] button to transfer the call
* This operation will: 
  * Create a new task with `woker_name` attribute set to Agent2 name 
  * Remove Agent1 from the conference
* Agent2 can now click on [Approve] to create a new conference between him and the caller (i.e. Customer)
* Agent1 can now wrap-up the call and complete the task (not implemented in this proof of concept)

## Setup 

In order the proof of concept to work, you need to setup a workflow in Taskrouter: 
* Have two workers (Agent1 and Agent2). For each of them make sure the following attribute are defined: 
```
{"contact_uri":"<phone_number>","worker_name":"<name>"}
```
  * where: 
    * <phone_number>: is the phone number of the agent1 (in this demo we use real phones, but the same can be achieved with sofphone and using the twilio voice SDK)
    * <name>: Name of the worker.
* Note down the Workers' SIDs and their names (i.e. `worker_name`) because you need them in the following steps
* Define a new workflow or change the existing one adding two filers: 
 * The first one has:
   * Matching task: `worker_name != "any"`
   * Worker expression: `task.worker_name == worker.worker_name`

## Quickstart

* Rename `.env.template` to `.env`
* Fill in values for:
  * `TWILIO_ACCOUNT_SID`
  * `TWILIO_ACCOUNT_SECRET`: this is the account auth token
  * `TWILIO_TR_WORKSPACE_SID`: this is your Twilio Taskrouter workspace id
  * `AGENT2_WORKER_NAME`: this is the name of the Agent 2 worker
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
