[![Build Status](https://travis-ci.org/protopipe/pipejs.svg?branch=master)](https://travis-ci.org/protopipe/pipejs)



How to run tests on change?
-------------------------------

`npm run autotest`


How tun run the test suite with coverage?
----------------------------------------

`npm install -g istanbul`
`./node_modules/.bin/istanbul cover -x '**/spec/**' jasmine -- --forceexit`
