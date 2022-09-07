# Prolog Exercise Task Mutation Testing Tool

This is a Tool to generate mutants for Prolog exercise tasks and to test it with the configuration. With this tool the test cases can be modified
dynamically in runtime, in order to kill mutants and make sure that an adequate test cases is reached.

### Getting Started

1. `git clone --recursive https://github.com/fmidue/ba-ivan-khu-tanujaya.git` to pull the repository including the Server Backend.
2. `npm install` in the project directory (react-app) to install all the dependencies.
3. `npm run server-install` to install the server locally.
4. `npm run server-abgabe` to run the server(state when thesis is submitted) at port 8080
5. `npm run start` in the react app directory to start the web-application at port 3000. If it doesn't open automatically, open [http://localhost:3000](http://localhost:3000) to view it in the browser.

If step 3 and 4 are not working, run the following commands one after the other at the prolog-server-abgabe directory: 
1. stack install 
2. stack run

### App functionality

1. User has to upload `Config file` and `Solution file` to the Field accordingly.
2. Click on the `Test Current Location` button to execute send a request to the server to check if the Solution passes the Test Suites.
3. A Result Card will show the response whether it is `Success ok` or `No. (with explaination)`. Additionally, editor fields for configuration and solution file will be shown with a list of mutation operators. At this stage user can modify the editor fields and re-test the pair.
4. Make changes to the mutation options and click on `Start Mutation` to generate mutants and see the test result of each mutants in a table.
5. Click on a table entry to see the code diff as well as the mutant code with test feedback. Changes can be made to the mutant code for `Re-test
   Mutant`. To change the test cases, modify the configuration editor above the mutation options.