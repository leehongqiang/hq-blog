
var Article = require('../../model/article.js');
var Product = require('../../model/product.js');
var Contact = require('../../model/contact.js');
var webs = {
    index:function (req,res) {
        var obj = {
            num: 6
        };
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
    resume: function (req,res) {
        Article.getTag(function (err,tags) {
            if (err) {
                res.flash('error', err);
            }
            return res.render('web/resume', {
                title: "个人简历",
                tags: tags,
                success: req.flash('success').toString(),
                error: req.flash('error').toString(),
                emptys: req.flash('emptys').toString()
            });
        });
    },
    contact: function (req,res) {
        var user = req.body.user,
            email = req.body.email,
            subject = req.body.subject,
            message = req.body.message;
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

    },
    checkaticle: function (req,res) {
        var id= req.params.id;
        //title = req.params.title,
        //date = req.params.date
        Article.getOne(id, function (err,article) {
            if(err){
                req.flash('error',err);
            }
            req.flash('success','查询成功');
            res.render('web/artile',{
                title:'查看文章',
                article:article,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            });
        });
    },
    getTagArticle: function (req,res) {
        var tag = req.params.tag;
        Article.getTagArticles(tag, function (err,articles) {
            if(err){
                req.flash('error',err);
            }
            req.flash('success','查询成功');
            res.render('web/tagArticles',{
                title:'查看文章',
                articles:articles,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            });
        })
    },
    archive: function (req,res) {
        Article.getArchive(function (err,articles) {
            if(err){
                req.flash("error",err);
                return  res.redirect('/blog');
            }
            res.render('web/archive',{
                title:"存档",
                articles:articles,
                success:req.flash("success").toString(),
                error:req.flash("error").toString()
            });
        });
    }

};


module.exports = webs;