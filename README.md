#c@cApi

A Node.Js wrapper for https://github.com/cloudatcost/api

#Installation

#Examples
##Create the Object

```node.js
var API = require('./c@cAPI.js');

var api = new API(apikey, loginEmail);
```

##List servers

```node.js
api.listServers(function(err, res) {
    if (!err) {
        console.log(res);
    } else {
        console.log(err);
    }

});

```