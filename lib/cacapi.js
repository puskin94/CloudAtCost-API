var request = require('request');


// Main class. It contains the data required for a correct use of the API.
function Cacapi(apiKey, loginEmail) {

    if (!apiKey) {
        throw new Error('API Key is required');
    }
    this.apiKey = apiKey;

    if (!loginEmail) {
        throw new Error('Login Email is required');
    }
    this.loginEmail = loginEmail;

    this.apiVersion = 'v1';
    this.baseHost = 'https://panel.cloudatcost.com/api/' + this.apiVersion + '/';
    this.login = '?key=' + this.apiKey + '&login=' + this.loginEmail;

}

/* This prototype makes requests to the c@c site, getting useful
params from other prototypes and parsing datas in JSON from the c@c website*/
Cacapi.prototype.makeRequest = function(params, callback) {

    host = this.baseHost +
            ((params.cloudpro) ? 'cloudpro/' : '') +
            params.op + '.php' + this.login;

    form = {}

    // building datas that will be passed using the POST method
    for (var key in params) {
        form[key] = params[key];
    }

    form.key = ((params.method == 'POST') ? this.apiKey : '');
    form.login = ((params.method == 'POST') ? this.loginEmail : '');


    request({ url: host,
        method: params.method || 'GET',
        form: form
    }, function(error, response, body) {
        /* result is parsed using JSON.parse. If the request has been made correctly,
        the result is passed to the user, otherwise is returned the
        `result["error_description"]`*/
        result = JSON.parse(body);
        if (!error && response.statusCode == 200) {
            callback(null, result);
        } else {
            if (result['status'] == 'error') {
                callback(result["error_description"], null);
            } else {
                callback(error, null);
            }
        }

    });
}

Cacapi.prototype.listServers = function(callback) {

    this.makeRequest({op: 'listservers'}, function (err, res) {
        callback(err, res);
    });
}

Cacapi.prototype.listTemplates = function (callback) {

    this.makeRequest({op: 'listtemplates'}, function (err, res) {
        callback(err, res);
    });
}

Cacapi.prototype.listTasks = function (callback) {

    this.makeRequest({op: 'listtasks'}, function (err, res) {
        callback(err, res);
    });
}

Cacapi.prototype.powerOp = function (sid, powerOperation, callback) {

    this.makeRequest({method: 'POST',
                        op: 'powerop',
                        sid: sid,
                        action: powerOperation}, function (err, res) {
        callback(err, res);
    });
}


Cacapi.prototype.runMode = function (sid, mode, callback) {

    this.makeRequest({method: 'POST',
                        op: 'runmode',
                        sid: sid,
                        mode: mode}, function (err, res) {
        callback(err, res);
    });
}

Cacapi.prototype.renameServer = function (sid, name, callback) {

    this.makeRequest({method: 'POST',
                        op: 'renameserver',
                        sid: sid,
                        name: name}, function (err, res) {
        callback(err, res);
    });
}

Cacapi.prototype.modifyReverseDNS = function (sid, host, callback) {

    this.makeRequest({method: 'POST',
                        op: 'rdns',
                        sid: sid,
                        hostname: host}, function (err, res) {
        callback(err, res);
    });
}

Cacapi.prototype.console = function (sid, callback) {

    this.makeRequest({method: 'POST',
                        op: 'console',
                        sid: sid}, function (err, res) {
        callback(err, res);
    });
}

Cacapi.prototype.deleteServer = function (sid, callback) {

    this.makeRequest({method: 'POST',
                        op: 'delete',
                        sid: sid,
                        cloudpro: true}, function (err, res) {
        callback(err, res);
    });
}


Cacapi.prototype.createServer = function (cpu, ram, storage, os, callback) {

    this.makeRequest({method: 'POST',
                    op: 'build',
                    cpu: cpu,
                    ram:ram,
                    storage:storage,
                    os: os,
                    cloudpro: true}, function (err, res) {
        callback(err, res);
    });
}

Cacapi.prototype.resources = function (callback) {
    this.makeRequest({op: 'resources', cloudpro: true}, function (err, res) {
        callback(err, res);
    });
}


module.exports = Cacapi;
