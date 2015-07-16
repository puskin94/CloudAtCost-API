var request = require('request');


function API (apiKey, loginEmail) {
    var self = this;

    if (!apiKey) {
        throw new Error('API Key not valid');
    }
    this.apiKey = apiKey;

    if (!loginEmail) {
        throw new Error('Login Email not valid');
    }
    this.loginEmail = loginEmail;

    this.apiVersion = 'v1';
    this.baseHost = 'https://panel.cloudatcost.com/api/' + this.apiVersion + '/';
    this.login = '?key=' + this.apiKey + '&login=' + this.loginEmail;

}

API.prototype.execCommand = function(params, callback) {

    host = this.baseHost +
            ((params.cloudpro) ? 'cloudpro/' : '') +
            params.op + '.php' + this.login;

    console.log(host)
    request({ url: host,
        method: params.method || 'GET',
        form: {

            key: ((params.method == 'POST') ? this.apiKey : ''),
            login: ((params.method == 'POST') ? this.loginEmail : ''),
            sid: ((params.sid) ? params.sid : ''),
            action: ((params.action) ? params.action : ''),
            mode: ((params.mode) ? params.mode : ''),
            name: ((params.name) ? params.name : ''),
            hostname: ((params.hostname) ? params.hostname : ''),
            cpu: ((params.cpu) ? params.cpu : ''),
            ram: ((params.ram) ? params.ram : ''),
            os: ((params.os) ? params.os : ''),
            storage: ((params.storage) ? params.storage : '')


    }}, function(error, response, body) {
        console.log(body)
        if (!error && response.statusCode == 200) {
            callback(null, JSON.parse(body));
        } else {
            callback(error, null);
        }

    });
}

API.prototype.listServers = function(callback) {
    this.execCommand({op: 'listservers'}, function (err, res) {
        callback(err, res);
    });
}

API.prototype.listTemplates = function (callback) {
    this.execCommand({op: 'listtemplates'}, function (err, res) {
        callback(err, res);
    });
}

API.prototype.listTasks = function (callback) {
    this.execCommand({op: 'listtasks'}, function (err, res) {
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

    this.execCommand({method: 'POST', op: 'powerop', sid: sid, action: powerOperation}, function (err, res) {
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

    this.execCommand({method: 'POST', op: 'runmode', sid: sid, mode: mode}, function (err, res) {
        callback(err, res);
    });
}

API.prototype.renameServer = function (sid, name, callback) {

    if (!sid) {
        throw new Error('Server ID is required');
    } else if (!name) {
        throw new Error('Name is required')
    }

    this.execCommand({method: 'POST', op: 'renameserver', sid: sid, name: name}, function (err, res) {
        callback(err, res);
    });
}

API.prototype.modifyReverseDNS = function (sid, host, callback) {

    if (!sid) {
        throw new Error('Server ID is required');
    } else if (!host) {
        throw new Error('Hostname is required')
    }

    this.execCommand({method: 'POST', op: 'rdns', sid: sid, hostname: host}, function (err, res) {
        callback(err, res);
    });
}

API.prototype.console = function (sid, callback) {
    if (!sid) {
        throw new Error('Server ID is required');
    }
    this.execCommand({method: 'POST', op: 'console', sid: sid}, function (err, res) {
        callback(err, res);
    });
}

API.prototype.deleteServer = function (sid, callback) {
    if (!sid) {
        throw new Error('Server ID is required');
    }
    this.execCommand({method: 'POST', op: 'delete', sid: sid, cloudpro: true}, function (err, res) {
        callback(err, res);
    });
}


API.prototype.createServer = function (cpu, ram, storage, os, callback) {

    var CPULIMIT = 8;
    var OSLIMIT = 75;

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
    } else if (ram != 512 && (ram % 1024) != 0) {
        throw new Error('Ram amount must be a 1024 multiple');
    } else if (os < 1 || os > OSLIMIT) {
        throw new Error('OS\' number must be between 1 and ' + OSLIMIT);
    }


    this.execCommand({method: 'POST',
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
    this.execCommand({op: 'resources', cloudpro: true}, function (err, res) {
        callback(err, res);
    });
}





module.exports = API;
