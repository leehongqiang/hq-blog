/**
 * Created by Administrator on 2016/4/15.
 */

var webs = require('../../controller/web/index')
module.exports = function (app) {
    app.get('/',webs.index);
    app.get('/reg',webs.reg);
    app.get('/test',webs.test);
}