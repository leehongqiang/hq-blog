
var Article = require('../../model/article.js')
var Product = require('../../model/product.js')
var webs = {
    index:function (req,res) {
        var obj = {
            num: 6
        }
        Article.getMany(obj, function (err, articles) {
            Product.getProduct(function (err,products) {
                return res.render('web/index', {
                    title:'主页',
                    articles:articles,
                    products:products,
                    success:req.flash('success').toString(),
                    error:req.flash('error').toString(),
                    emptys:req.flash('emptys').toString()
            });

            });
        });

    },
    reg: function (req,res) {
        res.render('web/register');
    },
    test: function (req,res) {
        res.render('demo/test');
    }
}


module.exports = webs;