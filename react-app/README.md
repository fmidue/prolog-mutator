# Prolog Exercise Task Mutation Testing Tool

This is a Tool to mutate Prolog exercise tasks and run it to the task-checker and see if the Test Suites have enough coverages.

### Getting Started

1. `git clone https://github.com/fmidue/ba-ivan-khu-tanujaya.git` to pull the repository.
2. `npm install` in the project directory (react-app) to install all the dependencies.
3. `git clone https://github.com/owestphal/prolog-test-server.git` to pull the Server Backend.
4. `stack run` in the server project directory to install all dependencies and get the server running at port 8080.
5. `npm run start` in the react app directory to start the web-application at port 3000. If it doesn't open automatically, open [http://localhost:3000](http://localhost:3000) to view it in the browser.


### Using the App

1. User has to upload `Config file` and `Solution file` to the Field accordingly.
2. Click on the `Start Mutation` button to execute all the possible Mutations to the Code and wait for the Result Table to appear.
3. The Result Table will show whether a Mutant of a specific Mutation Type has passed the Test Suites. This will then help the User to identify whether there is enough Test Coverages on the specific Prolog Exercise Task