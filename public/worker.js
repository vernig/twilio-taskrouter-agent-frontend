// const WORKER_TOKEN =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBQ2U5YWQxMGRmMjliNjQxNjFhNDk5NzI0YmU5NjZlODI1IiwiZXhwIjoxNTc1MDQ2MTE3LCJ2ZXJzaW9uIjoidjEiLCJhY2NvdW50X3NpZCI6IkFDZTlhZDEwZGYyOWI2NDE2MWE0OTk3MjRiZTk2NmU4MjUiLCJjaGFubmVsIjoiV0s1MTI4YzEzNDEyMWZhZThhNzg3Mjc4MmYyOTM3NjJiNyIsIndvcmtzcGFjZV9zaWQiOiJXUzAzOTk5ZTZiNzIxMWEyMmNiMjkxMWNmNTQwMWZmYzQwIiwicG9saWNpZXMiOlt7InVybCI6Imh0dHBzOi8vZXZlbnQtYnJpZGdlLnR3aWxpby5jb20vdjEvd3NjaGFubmVscy9BQ2U5YWQxMGRmMjliNjQxNjFhNDk5NzI0YmU5NjZlODI1L1dLNTEyOGMxMzQxMjFmYWU4YTc4NzI3ODJmMjkzNzYyYjciLCJtZXRob2QiOiJHRVQiLCJxdWVyeV9maWx0ZXIiOnt9LCJwb3N0X2ZpbHRlciI6e30sImFsbG93Ijp0cnVlfSx7InVybCI6Imh0dHBzOi8vZXZlbnQtYnJpZGdlLnR3aWxpby5jb20vdjEvd3NjaGFubmVscy9BQ2U5YWQxMGRmMjliNjQxNjFhNDk5NzI0YmU5NjZlODI1L1dLNTEyOGMxMzQxMjFmYWU4YTc4NzI3ODJmMjkzNzYyYjciLCJtZXRob2QiOiJQT1NUIiwicXVlcnlfZmlsdGVyIjp7fSwicG9zdF9maWx0ZXIiOnt9LCJhbGxvdyI6dHJ1ZX0seyJ1cmwiOiJodHRwczovL3Rhc2tyb3V0ZXIudHdpbGlvLmNvbS92MS9Xb3Jrc3BhY2VzL1dTMDM5OTllNmI3MjExYTIyY2IyOTExY2Y1NDAxZmZjNDAvQWN0aXZpdGllcyIsIm1ldGhvZCI6IkdFVCIsInF1ZXJ5X2ZpbHRlciI6e30sInBvc3RfZmlsdGVyIjp7fSwiYWxsb3ciOnRydWV9LHsidXJsIjoiaHR0cHM6Ly90YXNrcm91dGVyLnR3aWxpby5jb20vdjEvV29ya3NwYWNlcy9XUzAzOTk5ZTZiNzIxMWEyMmNiMjkxMWNmNTQwMWZmYzQwL1Rhc2tzLyoqIiwibWV0aG9kIjoiR0VUIiwicXVlcnlfZmlsdGVyIjp7fSwicG9zdF9maWx0ZXIiOnt9LCJhbGxvdyI6dHJ1ZX0seyJ1cmwiOiJodHRwczovL3Rhc2tyb3V0ZXIudHdpbGlvLmNvbS92MS9Xb3Jrc3BhY2VzL1dTMDM5OTllNmI3MjExYTIyY2IyOTExY2Y1NDAxZmZjNDAvV29ya2Vycy9XSzUxMjhjMTM0MTIxZmFlOGE3ODcyNzgyZjI5Mzc2MmI3L1Jlc2VydmF0aW9ucy8qKiIsIm1ldGhvZCI6IkdFVCIsInF1ZXJ5X2ZpbHRlciI6e30sInBvc3RfZmlsdGVyIjp7fSwiYWxsb3ciOnRydWV9LHsidXJsIjoiaHR0cHM6Ly90YXNrcm91dGVyLnR3aWxpby5jb20vdjEvV29ya3NwYWNlcy9XUzAzOTk5ZTZiNzIxMWEyMmNiMjkxMWNmNTQwMWZmYzQwL1dvcmtlcnMvV0s1MTI4YzEzNDEyMWZhZThhNzg3Mjc4MmYyOTM3NjJiNyIsIm1ldGhvZCI6IkdFVCIsInF1ZXJ5X2ZpbHRlciI6e30sInBvc3RfZmlsdGVyIjp7fSwiYWxsb3ciOnRydWV9LHsidXJsIjoiaHR0cHM6Ly90YXNrcm91dGVyLnR3aWxpby5jb20vdjEvV29ya3NwYWNlcy9XUzAzOTk5ZTZiNzIxMWEyMmNiMjkxMWNmNTQwMWZmYzQwIiwibWV0aG9kIjoiR0VUIiwicXVlcnlfZmlsdGVyIjp7fSwicG9zdF9maWx0ZXIiOnt9LCJhbGxvdyI6dHJ1ZX0seyJ1cmwiOiJodHRwczovL3Rhc2tyb3V0ZXIudHdpbGlvLmNvbS92MS9Xb3Jrc3BhY2VzL1dTMDM5OTllNmI3MjExYTIyY2IyOTExY2Y1NDAxZmZjNDAvKioiLCJtZXRob2QiOiJHRVQiLCJxdWVyeV9maWx0ZXIiOnt9LCJwb3N0X2ZpbHRlciI6e30sImFsbG93Ijp0cnVlfSx7InVybCI6Imh0dHBzOi8vdGFza3JvdXRlci50d2lsaW8uY29tL3YxL1dvcmtzcGFjZXMvV1MwMzk5OWU2YjcyMTFhMjJjYjI5MTFjZjU0MDFmZmM0MC9BY3Rpdml0aWVzIiwibWV0aG9kIjoiUE9TVCIsInF1ZXJ5X2ZpbHRlciI6e30sInBvc3RfZmlsdGVyIjp7fSwiYWxsb3ciOnRydWV9LHsidXJsIjoiaHR0cHM6Ly90YXNrcm91dGVyLnR3aWxpby5jb20vdjEvV29ya3NwYWNlcy9XUzAzOTk5ZTZiNzIxMWEyMmNiMjkxMWNmNTQwMWZmYzQwL1dvcmtlcnMvV0s1MTI4YzEzNDEyMWZhZThhNzg3Mjc4MmYyOTM3NjJiNy9SZXNlcnZhdGlvbnMvKioiLCJtZXRob2QiOiJQT1NUIiwicXVlcnlfZmlsdGVyIjp7fSwicG9zdF9maWx0ZXIiOnt9LCJhbGxvdyI6dHJ1ZX1dLCJ3b3JrZXJfc2lkIjoiV0s1MTI4YzEzNDEyMWZhZThhNzg3Mjc4MmYyOTM3NjJiNyIsImlhdCI6MTU3NTA0MjUxN30.DElewuZ3-dYie7phjhJOw3X30aZx59v7tYSlJJbeV3o';

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
