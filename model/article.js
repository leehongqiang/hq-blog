/**
 * Created by Administrator on 2016/4/19.
 */
var mongoose = require('./db')

var articleSchema = new mongoose.Schema({
    author:String,
    title:String,
    date:Date,
    content:String,
    tag:String,
}, {
    collection:'articles'
});


var articleModel = mongoose.model('articles',articleSchema);
function Article(article){
    this.author = article.author;
    this.title = article.title;
    this.content = article.content;
    this.tag = article.tag;
}
module.exports = Article;

Article.prototype.save = function(callback){
    //var date = new Date();
    //var time = {
    //    date:date,
    //    year:date.getFullYear(),
    //    month:date.getFullYear()+"-"+(date.getMonth()+1),
    //    day:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate(),
    //    minute:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+
    //    ":"+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())
    //}
    var article = {
        author : this.author,
        title : this.title,
        date : Date.now(),
        content : this.content,
        tag : this.tag
    }
    var newArticles = new articleModel(article);
    newArticles.save(function (err) {
        if(err){
            return callback(err);
        }
        callback(null);
    });
}

Article.getAll = function (callback) {
    articleModel.find({}, function (err,articles) {
        if(err){
            return callback(err);
        }
        callback(null,articles);
    });
}

