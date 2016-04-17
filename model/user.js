/**
 * Created by Administrator on 2016/4/15.
 */
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/hqblog');

var userSchema = new mongoose.Schema({
    name:String,
    password:String
},{
    collection:'users'
});
var userModel = mongoose.model('user',userSchema);
function User(user){
    this.name = user.name;
    this.password = user.password;
}
User.prototype.save = function (callback) {
    var user = {
        name:this.name,
        password:this.password
    }
    var newUser = new userModel(user);
    newUser.save(function (err,user) {
        if(err){
            return callback(err);
        }
        callback(null,user)
    })
}

User.getOne = function (name,callback) {
    userModel.findOne({name:name}, function (err,user) {
        if(err){
            return callback(err);
        }
        callback(null,user);
    });
}
User.getAll = function (callback) {
    userModel.find({}, function (err,users) {
        if(err){
            return callback(err);
        }
        callback(null,users)

    })
}

User.search = function (name,callback) {
    userModel.findOne({name:name}, function (err,users) {
        if(err){
            return callback(err);
        }
        callback(null,users);
    })
}
User.update = function (name,password,callback) {
    userModel.update({name:name},
        { $set: { password:password}},
        function (err,user) {
            if(err){
                return callback(err);
            }
        callback(null,user)
    });
}

User.remove= function (name,callback) {
    userModel.remove({name:name}, function (err,user) {
        if(err){
            return callback(err);
        }
        callback(null,user);
    });
}


module.exports = User;