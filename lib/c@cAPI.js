var request = require('request');


// Main class. It contains the data required for a correct use of the API.
function API (apiKey, loginEmail) {
    var self = this;

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
API.prototype.makeRequest = function(params, callback) {

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

API.prototype.listServers = function(callback) {
    this.makeRequest({op: 'listservers'}, function (err, res) {
        callback(err, res);
    });
}

API.prototype.listTemplates = function (callback) {
    this.makeRequest({op: 'listtemplates'}, function (err, res) {
        callback(err, res);
    });
}

API.prototype.listTasks = function (callback) {
    this.makeRequest({op: 'listtasks'}, function (err, res) {
        callback(err, res);
    });
}

API.prototype.powerOp = function (sid, powerOperation, callback) {
    op = ['poweron', 'poweroff', 'reset'];

    if (!sid) {
        throw new Error('Server ID is required');
    } else if (!powerOperation) {
        throw new Error('Power Operation is required');
    } else if (op.indexOf(powerOperation) == -1) {
        throw new Error('Action not Permitted');
    }

    this.makeRequest({method: 'POST',
                        op: 'powerop',
                        sid: sid,
                        action: powerOperation}, function (err, res) {
        callback(err, res);
    });
}


API.prototype.runMode = function (sid, mode, callback) {

    mod = ['safe', 'normal'];
    if (!sid) {
        throw new Error('Server ID is required');
    } else if (!mode) {
        throw new Error('Run mode is required')
    } else if (mod.indexOf(mode) == -1) {
        throw new Error('Run mode must be \'safe\' or \'normal\'');
    }

    this.makeRequest({method: 'POST', op: 'runmode', sid: sid, mode: mode}, function (err, res) {
        callback(err, res);
    });
}

API.prototype.renameServer = function (sid, name, callback) {

    if (!sid) {
        throw new Error('Server ID is required');
    } else if (!name) {
        throw new Error('Name is required')
    }

    this.makeRequest({method: 'POST', op: 'renameserver', sid: sid, name: name}, function (err, res) {
        callback(err, res);
    });
}

API.prototype.modifyReverseDNS = function (sid, host, callback) {

    if (!sid) {
        throw new Error('Server ID is required');
    } else if (!host) {
        throw new Error('Hostname is required')
    }

    this.makeRequest({method: 'POST', op: 'rdns', sid: sid, hostname: host}, function (err, res) {
        callback(err, res);
    });
}

API.prototype.console = function (sid, callback) {
    if (!sid) {
        throw new Error('Server ID is required');
    }
    this.makeRequest({method: 'POST', op: 'console', sid: sid}, function (err, res) {
        callback(err, res);
    });
}

API.prototype.deleteServer = function (sid, callback) {
    if (!sid) {
        throw new Error('Server ID is required');
    }
    this.makeRequest({method: 'POST', op: 'delete', sid: sid, cloudpro: true}, function (err, res) {
        callback(err, res);
    });
}


API.prototype.createServer = function (cpu, ram, storage, os, callback) {

    var CPULIMIT = 16;
    var OSLIMIT = 75;
    var RAMLIMIT = 32768;
    var STORAGELIMIT = 1000;

    if (!cpu) {
        throw new Error('CPU amount is required');
    } else if (!ram) {
        throw new Error('RAM amount is required');
    } else if (!storage) {
        throw new Error('CPU amount is required');
    } else if (!os) {
        throw new Error('OS number is required');
    } else if (cpu < 1 || cpu > CPULIMIT) {
        throw new Error('Number of CPU\'s must be between 1 and ' + CPULIMIT);
    } else if ((ram != 512 && (ram % 1024) != 0) || (ram < 0 || ram > RAMLIMIT)) {
        throw new Error('Ram amount must be between 512 and ' + RAMLIMIT + '. Must be a multiple of 1024 if >= 1024');
    } else if (os < 1 || os > OSLIMIT) {
        throw new Error('OS\' number must be an #id from /v1/listtemplates.php');
    } else if (storage < 1 || storage > STORAGELIMIT) {
        throw new Error('Storage amount must be between 1 and ' + STORAGELIMIT);
    }


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

API.prototype.resources = function (callback) {
    this.makeRequest({op: 'resources', cloudpro: true}, function (err, res) {
        callback(err, res);
    });
}


module.exports = API;
