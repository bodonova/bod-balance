# bod-balance

An implementation of a dummy account balance application

## REST API

It has two methods:

* /balance
  * method GET
  * parameter _account_num_ (required)
* /lodgement
  * method POST (with JSON body)
  * parameter _account_num_ (required)
  * parameter _amount_ (required)
    * How much to lodge to the account. Negative number imlies a withdrawal


## Running

First install dependencies

```
npm install
```

Then start the application

```
npm start
```
