/**
 * Created by Administrator on 2016/4/15.
 */

var servers = require('../../controller/servers/index');

module.exports = function (app) {
    //��ҳ
    app.get('/server',servers.checkLogin)
    app.get('/server',servers.index);
    //����ǳ�
    app.get('/server/login',servers.getlogin);
    app.post('/server/login',servers.postlogin)
    app.get('/server/logout',servers.logout);
    //�û�����
    app.post('/server/adduser',servers.adduser);
    app.get('/server/search',servers.search);
    app.post('/server/updateuser',servers.updateuser);
    app.get('/server/remove/:name',servers.remove);
    //���¹���
    app.get('/article',servers.article);
    app.get('/addarticle',servers.addarticle)
    app.post('/addarticles',servers.addarticles)
    app.get('/checkaticle',servers.checkaticle)
    app.get('/editaticle',servers.editaticle)
    app.get('/removeaticle',servers.removeaticle)
}