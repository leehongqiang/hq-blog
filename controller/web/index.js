


var webs = {
    index:function (req,res) {
        res.render('web/index',{title:'web'});
    },
    reg: function (req,res) {
        res.render('web/register');
    },
    test: function (req,res) {
        res.render('demo/test');
    }
}


module.exports = webs;