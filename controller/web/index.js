
var Article = require('../../model/article.js')
var Product = require('../../model/product.js')
var Contact = require('../../model/contact.js')
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
    contact: function (req,res) {
        var user = req.body.user,
            email = req.body.email,
            subject = req.body.subject,
            message = req.body.message
        var newContact = new Contact({
            user:user,
            email:email,
            subject:subject,
            message:message
        });
        newContact.save(function (err) {
            if(err){
                req.flash('error',err);
            }
            req.flash('success','发布成功');
            res.redirect('/');
        })
    },
    blog: function (req,res) {
        Article.getArticle(function (err,articles) {
            Article.getTag(function (err,tags) {
                if(err){
                    res.flash('error',err);
                }
                return res.render('web/blog',{
                    title:"lee博客",
                    articles:articles,
                    tags:tags,
                    success:req.flash('success').toString(),
                    error:req.flash('error').toString(),
                    emptys:req.flash('emptys').toString()
                });
            });
        });

    }

}


module.exports = webs;