# Proof of concpet for Twilio TaskRouter agent frontend (with conference)

## Quickstart

* Rename `.env.template` to `.env`
* Fill in values for:
  * `TWILIO_ACCOUNT_SID`
  * `TWILIO_ACCOUNT_SECRET`: this is the account auth token
  * `TWILIO_TR_WORKSPACE_SID`: this is your Twilio Taskrouter workspace id
* Fill in the `WORKER_SID` constant in `public/agent1.html` and `public/agent2.html`. Agent1 is the one receiving the call andf making the transfer to Agent2
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
