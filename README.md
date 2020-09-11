# Agent interface for Twilio TaskRouter 

This repo is a very basic user interface to perform some operations on TaskRouter using [TaskRouterJS](https://www.twilio.com/docs/taskrouter/js-sdk). 

What is implemented so far is: 
* Toggle worker status (available / unavailable)
* Interact with tasks / reservations (accept, complete)
* Transfer a voice call to another agent (see more below)

### Set-up incoming call handler (Studio Flow)

* Create a new Studio Flow
* Add an enqueue widget and connect it to "incoming call"
* In the propery of the widget set: 
  * `Queue or Task Router Task`: `TaskRouter Task`
  * `Task Router Workspace`: your workspace 
  * `Task Router Workflow`: your workflow 
  * `Task Attributes (JSON)`: `{"target_worker_name": "<name of the main agent>"}`
* Save and Publish the Flow 
* Go to the [Phone Numbers section of the console](https://www.twilio.com/console/phone-numbers/incoming) 
* Click on the number 
* In the "A Call Comes in" set "Studio Flow" and select the studio flow you just created

## Start server

* Rename `.env.template` to `.env`
* Fill in values for:
  * `TWILIO_ACCOUNT_SID`
  * `TWILIO_ACCOUNT_SECRET`: this is the Twilio account auth token
  * `TWILIO_TR_WORKSPACE_SID`: this is your Twilio Taskrouter Workspace id
  * `TWILIO_API_KEY` and `TWILIO_API_SECRET`: this is the API key/secret used to enable voice client. create a new API key/secret [here](https://www.twilio.com/console/phone-numbers/project/api-keys)
  * `AGENT2_NAME`: (optional for the transfer use case) The name of the Agent to transfer the call 2 if none is provided
* Install dependencies:
```
npm install
```
* Start server
```
npm start
```

# Simple Voice Call 

## Additional setup 
 
Make sure you have a worker with `contact_uri` in the attributes:  

```
{
  ...
  "contact_uri": "client:xxxx"
}
```

Grab the worker sid of the  worker and then open the following url on your browser: http://localhost:3000/worker.html?workerSid=<WKXXXXX>. If everything is set-up correctly you should be seeing the "Voice Client controls" (both buttons greyed out). 

## Test 

* Make a call to the number you configured above. A new reservation is created for your agent. 
* Click on "Accept"
* Your browser will start to ring 
* Click on "Answer Call" to accept the call 
* Now you will be connected with the other peers in a conference

![voice-client-demo](https://user-images.githubusercontent.com/54728384/92963102-d6c1f400-f469-11ea-9a40-61c10d4b8dd0.gif)

# Proof of concept for Agent call transfer using Twilio TaskRouter

## Additional Setup 

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

![image](https://user-images.githubusercontent.com/40210035/70337380-dcd3d600-1842-11ea-9465-c31d84108751.png)


![image](https://user-images.githubusercontent.com/54728384/70321829-53aba780-1820-11ea-93fa-6e5c13fb1fb4.png)

## Test 

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
