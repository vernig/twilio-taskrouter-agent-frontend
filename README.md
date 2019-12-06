# Proof of concept for Agent call transfer using Twilio TaskRouter

## Flow

This proof of concept makes use of routing based on worker name. The flow is the following: 
* A call comes in and a new task is created and assigned to Agent1
* Agent1 use the [Accept] button on his web page to accept the call and create a conference with the customer
* Once the conference is established, the Agent1 can use the [Transfer to Agent2] button to transfer the call
* This operation will: 
  * Create a new task with `woker_name` attribute set to Agent2 name 
  * Remove Agent1 from the conference
* Agent2 can now click on [Accept] tojoin the conference already established between Agent1 and the customer
* Agent1 (that is no longer in the call) can now wrap-up and complete the task 

![image](https://user-images.githubusercontent.com/40210035/70335313-f96e0f00-183e-11ea-9c3e-fe18c2ef65d9.png)


![image](https://user-images.githubusercontent.com/54728384/70321829-53aba780-1820-11ea-93fa-6e5c13fb1fb4.png)

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
   * Matching task: `target_worker_name != "any"`
   * Worker expression: `task.target_worker_name == worker.worker_name`
 * The second one has
   * Matching task: `1==1`
* To ensure the incoming call are routed to Agent1, change the IVR that create a task when a calls comes in, to make sure the new task created has attributes `{"worker_name": "<name_of_agent1>"}`
 
## Start

* Rename `.env.template` to `.env`
* Fill in values for:
  * `TWILIO_ACCOUNT_SID`
  * `TWILIO_ACCOUNT_SECRET`: this is the Twilio account auth token
  * `TWILIO_TR_WORKSPACE_SID`: this is your Twilio Taskrouter Workspace id
  * `AGENT2_NAME`: (optional) The name of the Agent to transfer the call 2 if none is provided
* Install dependencies:
```
npm install
```
* Start server
```
npm start
```

![image](https://user-images.githubusercontent.com/54728384/70262423-3a591b80-178c-11ea-8ea7-6d5c7816cb96.png)

* Open (at least) two browser tabs on:
  * http://localhost:3000/worker.html?workerSid=<Agent 1 SID>
  * http://localhost:3000/worker.html?workerSid=<Agent 2 SID>
* Call the phone number from a phone 
* When the call comes in, a new  resewrvations appear on the Agent1 page
* Press the [Accept] button, and a new call to the Agent1 phone is placed 
* A new button [Transfer] will appear on the Agent1 screen
* Click the [Transfer] button, and when prompted type the name of the Agent 2 in the popup
* A new task is created and reserved to Agent2
* Agent1 gets removed from the conference (this steps can be postponed to ensure warm transfering) 
* A new reservation is added to the Agent2 page and a [Accept] button appears on Agent2 page
* Click the [Accept] button on Agent2 page
* A new call is established with Agent2 phone and he can now talk to the customer
