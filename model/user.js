
var mongoose = require('./db');

var userSchema = new mongoose.Schema({
    name:String,
    password:String,
    create_time:{type:Date,defult:Date.now}
},{
    collection:'users'
});
var userModel = mongoose.model('user',userSchema);
function User(user){
    this.name = user.name;
    this.password = user.password;
    this.create_time = user.create_time;
}
User.prototype.save = function (callback) {
    var user = {
        name:this.name,
        password:this.password,
        create_time:Date.now()
    };
    var newUser = new userModel(user);
    newUser.save(function (err,user) {
        if(err){
            return callback(err);
        }
        callback(null,user)
    })
};

User.getOne = function (name,callback) {
    userModel.findOne({name:name}, function (err,user) {
        if(err){
            return callback(err);
        }
        callback(null,user);
    });
};
User.getAll = function (obj,callback) {
    var q =obj.search || {};
    //var col = obj.columns;
    var pageNumber = obj.page.num||1;
    var resultsPerPage = obj.page.limit ||3;
    var skipFrom = (pageNumber*resultsPerPage)-resultsPerPage;
    var query = userModel.find(q).sort('-create_time').skip(skipFrom).limit(resultsPerPage);
    
    query.exec(function (err,users) {
        if(err){
            callback (err,null,null);
        }else{
            userModel.count(q, function (err,count) {
                if(err){
                    callback(err,null,null);
                }else{
                    var pageCount = Math.ceil(count/resultsPerPage);
                    callback(null,pageCount,users);
                }
            })
        }
    });
    
    //userModel.find({}, function (err,users) {
    //    if(err){
    //        return callback(err);
    //    }
    //    callback(null,users)
    //
    //})
};

User.search = function (query,callback) {
    userModel.findOne(query, function (err,users) {
        if(err){
            return callback(err);
        }
        callback(null,users);
    })
};
User.update = function (name,password,callback) {
    userModel.update({name:name},
        { $set: { password:password}},
        function (err,user) {
            if(err){
                return callback(err);
            }
        callback(null,user)
    });
};

User.remove= function (name,callback) {
    userModel.remove({name:name}, function (err,user) {
        if(err){
            return callback(err);
        }
        callback(null,user);
    });
};


module.exports = User;