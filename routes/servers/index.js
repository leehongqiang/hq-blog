/**
 * Created by Administrator on 2016/4/15.
 */

var servers = require('../../controller/servers/index');

module.exports = function (app) {
    app.get('/server',servers.checkLogin)
    app.get('/server',servers.index);
    app.get('/server/login',servers.getlogin);
    app.post('/server/login',servers.postlogin)
    app.get('/server/logout',servers.logout);
    app.post('/server/adduser',servers.adduser);
    app.get('/server/search',servers.search);
    app.post('/server/updateuser',servers.updateuser);
    app.get('/server/remove/:name',servers.remove)
}