/**
 * Created by Administrator on 2016/4/15.
 */
var User = require('../../model/user.js');
var Article = require('../../model/article.js')

var servers = {
    //首页
    index:function (req,res) {
        var searchs = {};
        var page={limit:10,num:1};
        if(req.query.p){
            page['num'] = req.query.p<1?1:req.query.p;
        }

        var model = {
            search:searchs,
            columns:'name alias director publish images.coverSmall create_date type deploy',
            page:page
        }
        User.getAll(model, function (err,pageCount,users) {
            page['pageCount'] = pageCount;
            page['size'] = users.length;
            page['numberOf']=pageCount>5?5:pageCount;

            return res.render('servers/users',{
                title:'用户列表',
                users:users,
                page:page,
                success:req.flash('success').toString(),
                error:req.flash('error').toString(),
                emptys:req.flash('emptys').toString()
            });
        });
        //User.getAll(function (err,users) {
        //    res.render('servers/users',{
        //        title:'用户列表',
        //        users:users,
        //        success:req.flash('success').toString(),
        //        error:req.flash('error').toString(),
        //        emptys:req.flash('emptys').toString()
        //    });
        //});
    },
    //登入登出
    getlogin: function (req,res) {
        res.render('servers/login',{
            title:'登录',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString(),
            emptys:req.flash('emptys').toString()
        });
    },
    postlogin: function (req,res) {
        User.getOne(req.body.username, function (err,user) {
            if(req.body.username == '' || req.body.password ==''){
                req.flash('emptys','账号和密码不能为空');
                return res.redirect('/server/login');
            }
            if(!user){
                req.flash('error','用户不存在');
                return res.redirect('/server/login');
            }
            //检查密码是否一致
            if(user.password!= req.body.password){
                req.flash('error','密码错误')
                return res.redirect('/server/login')
            }
            //
            req.session.user = user;
            req.flash('success','登录成功');
            res.redirect('/server');
        });
    },
    logout: function (req,res) {
        req.session.user = null;
        res.redirect('/server/login');
    },
    //用户管理
    adduser: function (req,res) {
        var name = req.body.username,
            password = req.body.password

        var newUser = new  User({
            name:name,
            password:password
        });
        //检查用户是否存在
        if (newUser.name !=''){
            User.getOne(newUser.name, function (err,user) {
                if(err){
                    req.flash('error',err);
                    return res.redirect('/server')
                }
                if(user){
                    req.flash('error','用户已存在');
                    return res.redirect('/server');
                }

                //不存在
                newUser.save(function (err, user) {
                    if(err){
                        req.flash('error',err);
                        return res.redirect('/server');
                    }
                    req.flash('success','添加成功')
                    res.redirect('/server');
                })
            });
        }else{
            req.flash('error','用户名为空')
            res.redirect('/server');
        }

    },
    search: function (req,res) {
        var name = req.query.searchname;
        var query = {};
        if(name){
            query['name'] = new RegExp(name);
        }
        User.search(query, function (err,user) {
            if(err){
                req.flash('error',err);
                return res.redirect('/server');
            }
            if(!user){
                req.flash('error','用户不存在');
                return res.redirect('/server');
            }
            res.render('servers/search', {
                title: '搜索结果',
                users: user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString(),
            });
        });
    },
    updateuser:function (req,res) {
        var name = req.body.username,
            password = req.body.password;

        User.update(name,password, function (err,user) {
            if(err){
                req.flash('error',err)
            }
            req.flash('success','用户：'+name+'密码修改成功！最新密码为：'+password);
            res.redirect('/server');
        })
    },
    remove: function (req,res) {
        var name = req.params.name;
        User.remove(name, function (err) {
            if(err){
                req.flash('error',err)
            }
            req.flash('success','删除成功');
            res.redirect('/server');
        })
    },
    //文章管理
    article: function (req,res) {
        var search={};
        var page={limit:10,num:1};
        if(req.query.p){
            page['num'] = req.query.p<1?1:req.query.p;
        }
        var model = {
            searchs:search,
            columns:'name alias director publish images.coverSmall create_date type deploy',
            page:page
        }
        Article.getAll(model, function (err,pageCount,articles) {
            page['pageCount'] = pageCount;
            page['size'] = articles.length;
            page['numberOf']=pageCount>5?5:pageCount;
            return res.render('servers/articles',{
                title:'文章列表',
                articles:articles,
                page:page,
                success:req.flash('success').toString(),
                error:req.flash('error').toString(),
            });
        });
        //Article.getAll(function (err,articles) {
        //    res.render('servers/articles',{
        //        title:"文章",
        //        articles:articles,
        //        success:req.flash('success').toString(),
        //        error:req.flash('error').toString(),
        //    });
        //});
    },
    articlesearch: function (req,res) {
        var title = req.query.searchname;
        var query = {};
        if(title){
            query['title'] = new RegExp(title);
        }
        Article.search(query, function (err,articles) {
            if(err){
                req.flash('error',err);
            }
            req.flash('success','OK');
            res.render('servers/seaarticles',{
                title:'查找文章',
                articles:articles,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            });
        })
    },
    addarticle: function (req,res) {
        res.render('servers/addarticles',{
            title:'发表文章',
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        });
    },
    addarticles: function (req,res) {
        var author = req.session.user.name,
            title = req.body.title,
            tag = req.body.tag,
            content = req.body.content
        var newArticle = new Article({
            author:author,
            title:title,
            tag:tag,
            content:content
        });
        newArticle.save(function (err) {
            if(err){
                req.flash('error',err);
            }
            req.flash('success','发布成功');
            res.redirect('/article')
        })

    },
    checkaticle: function (req,res) {
        var id= req.params.id
            //title = req.params.title,
            //date = req.params.date
        Article.getOne(id, function (err,article) {
            if(err){
                req.flash('error',err);
            }
            req.flash('success','查询成功');
            res.render('servers/checkaddarticles',{
                title:'查看文章',
                article:article,
                success:req.flash('success').toString(),
                error:req.flash('error').toString(),
            });
        });
    },
    posteditaticle: function (req,res) {
        var id = req.params.id,
            title = req.body.title,
            content = req.body.content;
        Article.edit(id,title,content, function (err) {
            if(err){
                req.flash('error',err);
            }
            req.flash('success','修改成功');
            res.redirect('/article');
        })
    },
    geteditaticle: function (req,res) {
        var id = req.params.id
        Article.getOne(id, function (err,article) {
            if(err){
                req.flash('error',err);
            }
            req.flash('success','查询成功');
            res.render('servers/editarticles',{
                title:'查看文章',
                article:article,
                success:req.flash('success').toString(),
                error:req.flash('error').toString(),
            });
        });
    },
    removeaticle: function (req,res) {
        var id= req.params.id;
        Article.remove(id, function (err) {
            if(err){
                req.flash('error',err);
            }
            req.flash('success','删除成功');
            res.redirect('/article');
        });
    },
    //权限控制
    checkLogin: function (req,res,next) {
        if(!req.session.user){
            req.flash('error','未登录！');
            res.redirect('/server/login');
        }
        next();
    },
    checkNotLogin: function (req,res,next) {
        if(req.session.user){
            req.flash('error','已登录！');
            res.redirect('back');
        }
        next();
    }
}


module.exports = servers;