/**
 * Created by Administrator on 2016/4/15.
 */
var User = require('../../model/user.js');


var servers = {
    index:function (req,res) {
        User.getAll(function (err,users) {
            res.render('servers/users',{
                title:'用户列表',
                users:users,
                success:req.flash('success').toString(),
                error:req.flash('error').toString(),
                emptys:req.flash('emptys').toString()
            });
        });

    },
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
        User.search(name, function (err,user) {
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
    logout: function (req,res) {
        req.session.user = null;
        res.redirect('/server/login');
    },
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