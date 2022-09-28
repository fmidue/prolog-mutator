# Prolog Exercise Task Mutation Testing Tool

This is a tool to generate mutants for Prolog exercise task sample solutions and to check them against a test suite configuration.
With the tool, the test cases can be modified dynamically, in order to kill mutants and make sure that an adequate test suite is reached.

Usage of the tool is described in an [article](https://wlp2022.dfki.de/data/papers/004.pdf) at [WLP 2022](https://wlp2022.dfki.de/).

### Prerequisites

Install Node.js 18, npm, and [stack](https://docs.haskellstack.org/en/stable/).

### Getting Started

1. `git clone --recursive https://github.com/fmidue/prolog-mutator.git` to pull the repository including the server backend.
2. `cd prolog-mutator/react-app`
3. `npm install` in the project directory (`react-app`, also for the following commands) to install all the JavaScript dependencies.
4. `npm run server-install` to install the server locally, along with its Haskell dependencies.
5. `npm run server` to run the server at port 8080.
6. `npm run start` (again in `react-app`) to start the web application at port 3000. If it doesn't open automatically, open [http://localhost:3000](http://localhost:3000) to view it in the browser.

If steps 4 and 5 are not working, run the following commands in the `prolog-test-server` directory instead:
1. `stack build`
2. `stack run`

### App functionality

1. Upload `Config file` and `Solution file` to the respective fields.
2. Click on the `Test Current Location` button to send a request to the server to check if the solution passes the test suite.
3. A result card will show the response: `Success ok` or `No. (with explaination)`. Additionally, editor fields for configuration and solution file will be shown, and a list of mutation operators. At this stage, you can modify the editor fields and re-test the pair.
4. Make changes to the mutation options and click on `Start Mutation` to generate mutants, and see the test result of each mutant in a table.
5. Click on a table entry to see the code diff as well as the mutant code with test feedback. Changes can be made to the mutant code for `Re-test Mutant`. To change the test cases, modify the configuration editor above the mutation options.
