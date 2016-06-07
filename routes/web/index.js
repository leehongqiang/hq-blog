/**
 * Created by Administrator on 2016/4/15.
 */

var webs = require('../../controller/web/index');
module.exports = function (app) {
    app.get('/',webs.index);
    app.post('/contact',webs.contact);
    app.get('/blog',webs.blog);
    app.get('/resume',webs.resume);
    app.get('/checkaticle/:id',webs.checkaticle);
    app.get('/tag/:tag',webs.getTagArticle);
    app.get('/archive',webs.archive);

}