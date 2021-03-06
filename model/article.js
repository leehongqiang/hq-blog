var mongoose = require('./db');

var articleSchema = new mongoose.Schema({
    author:String,
    title:String,
    date:{
        date:String,
        year:String,
        month:String,
        day:String,
        minute:String
    },
    content:String,
    tag:String
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
    var date = new Date();
    var time = {
        date:date,
        year:date.getFullYear(),
        month:date.getFullYear()+"-"+(date.getMonth()+1),
        day:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate(),
        minute:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+
        ":"+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())
    };
    var article = {
        author : this.author,
        title : this.title,
        date : {
            date:time.date,
            year:time.year,
            month:time.month,
            day:time.day,
            minute:time.minute
        },
        content : this.content,
        tag : this.tag
    };
    var newArticles = new articleModel(article);
    newArticles.save(function (err) {
        if(err){
            return callback(err);
        }
        callback(null);
    });
};
Article.getOne = function (id,callback) {
    var articleOne = {
        _id:id
        //author:author,
        //title:title,
        //date:date
    };
    articleModel.findById(articleOne, function (err,article) {
        if(err){
            return callback(err);
        }
        callback(null,article);
    })
};
Article.edit = function (id,title,content,callback) {
    articleModel.update({_id:id},{
        $set:{title:title,content:content}
    }, function (err,article) {
        if(err){
            return callback(err);
        }
        callback(null,article);
    });
};
Article.remove = function (id,callback) {
    articleModel.remove({_id:id}, function (err) {
        if(err){
            return callback (err);
        }
        callback(null);
    })
};
Article.search = function (query,callback) {
    articleModel.find(query, function (err,articles) {
        if(err){
            return callback(err);
        }
        callback(null,articles);
    });
};
Article.getAll = function (obj,callback) {
    var q =obj.searchs||{};
    //var col = obj.columns;
    var pageNumber = obj.page.num||1;
    var resultsPerPage = obj.page.limit ||3;
    var skipFrom = (pageNumber*resultsPerPage)-resultsPerPage;
    var query = articleModel.find(q).sort('-date').skip(skipFrom).limit(resultsPerPage);

    query.exec(function (err,articles) {
        if(err){
            callback (err,null,null);
        }else{
            articleModel.count(q, function (err,count) {
                if(err){
                    callback(err,null,null);
                }else{
                    var pageCount = Math.ceil(count/resultsPerPage);
                    callback(null,pageCount,articles);
                }
            });
        }
    });
    //articleModel.find({}, function (err,articles) {
    //    if(err){
    //        return callback(err);
    //    }
    //    callback(null,articles);
    //});
};

Article.getMany = function (obj,callback) {
    articleModel.find({}, function (err,articles) {
        if(err){
            callback(err);
        }
        callback(null,articles)
    }).limit(obj.num).sort({'date':'-1'});
};

Article.getArticle = function (callback) {
    articleModel.find({}, function (err,articles) {
        if(err){
            return callback(err);
        }
        callback(null,articles);
    });
};
Article.getTag = function (callback) {
    articleModel.distinct('tag', function (err,tags) {
        if(err){
            return callback(err);
        }
        callback(null,tags);
    })
};

Article.getTagArticles = function (tag,callback) {
    articleModel.find({tag:tag}, function (err,articles) {
        if(err){
            return callback(err);
        }
        callback(null,articles);
    });
};

Article.getArchive = function (callback) {
    articleModel.find({},{
        'title':1,
        'author':1,
        'date':1
    }, function (err,articles) {
        if(err){
            return callback(err);
        }
        callback(null,articles);
    })
};