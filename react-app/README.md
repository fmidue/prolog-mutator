# Prolog Exercise Task Mutation Testing Tool

This is a Tool to mutate Prolog exercise tasks and run it to the task-checker and see if the Test Suites have enough coverages.

### Getting Started

1. `git clone --recursive https://github.com/fmidue/ba-ivan-khu-tanujaya.git` to pull the repository including the Server Backend.
2. `npm install` in the project directory (react-app) to install all the dependencies.
4. `stack run` in the Server Backend project directory to install all dependencies and get the server running at port 8080.
5. `npm run start` in the react app directory to start the web-application at port 3000. If it doesn't open automatically, open [http://localhost:3000](http://localhost:3000) to view it in the browser.


### App functionality (30.09.2021)

1. User has to upload `Config file` and `Solution file` to the Field accordingly.
2. Click on the `Start Mutation` button to execute send a request to the server to check if the Solution passes the Test Suites.
3. A Card will show the response whether it is `Success ok` or `No. (with explaination)`