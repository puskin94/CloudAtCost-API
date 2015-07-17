#c@cApi

A Node.Js wrapper for [CloudAtCost API](https://github.com/cloudatcost/api) 

#Installation
`npm install cacapi`

#Examples
Every function returns with a callback two parameters: `error` and `result`.


```js
var Cacapi = require('cacapi');

var api = new Cacapi(apikey, loginEmail);
```

###List servers

```js
api.listServers(function(err, res) {
    (!err) ? console.log(res) : console.log(err);
});

```

###List templates

```js
api.listTemplates(function(err, res) {
    console.log(res["status"]);
    // if the result has been processed correctly
    // should print "ok"
});

```

###List tasks

```js
api.listTasks(function(err, res) {
    console.log(res["data"][0].action);
    // res is an Object
});

```

###Power operations

```js
api.powerOp(sid, 'poweron', function(err, res) {
    // first argument is the ServerId
    // the second one must be 'poweron' || 'poweroff' || 'reset'
});
```

###Run mode

```js
api.runMode(sid, 'safe', function(err, res) {
    // first argument is the ServerId
    // the second one must be 'normal' || 'safe'
});
```

###Rename server

```js
api.renameServer(sid, 'My VPS', function(err, res) {
    // first argument is the ServerId
    // the second one is the new Name
});
```

###Modify reverse DNS

```js
api.modifyReverseDNS(sid, 'localhost.domain.com', function(err, res) {
    // first argument is the ServerId
    // the second one is the new HostName
});
```

###Console

```js
api.console(sid, function(err, res) {
    // the only argument is the ServerId
});
```
#CloudPro Actions

###Build server

```js
api.createServer(1, 512, 11, 27, function(err, res) {
    // Arguments:
    // number of CPU's
    // RAM in MB
    // storage in GB
    // OS number ( see List templates )
});
```

###Delete server

```js
api.deleteServer(sid, function(err, res) {
    // the only argument is the ServerId
});
```

###Resources

```js
api.resources(function(err, res) {
    console.log(res["data"].total)
    // { cpu_total: '1', ram_total: '512', storage_total: '11' }
    // I have a very small VPS ;)
});

```


#License
This software is under [MPL 2.0 License](http://opensource.org/licenses/MPL-2.0) 