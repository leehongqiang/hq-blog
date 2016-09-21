var mongoose = require('./db');

var caseSchema = new mongoose.Schema({
    title:String,
    date:Date,
    description:String,
    imgpath:String,
    prourl:String
},{
    collection:'products'
});


var productsModel = mongoose.model('products',caseSchema);

function Products(products){
    this.title = products.title;
    this.description = products.description;
    this.imgpath = products.imgpath;
    this.prourl = products.prourl
}


module.exports = Products;

Products.prototype.save = function (callback) {
    var product = {
        title:this.title,
        date:Date.now(),
        description:this.description,
        imgpath : this.imgpath,
        prourl:this.prourl
    };

    var newProducts = new productsModel(product);
    newProducts.save(function (err) {
        if(err){
            return callback(err);
        }
        callback(null);
    });
};

Products.getAll = function (obj,callback) {
    var q = obj.searchs ||{};
    var pageNumber = obj.page.num||1;
    var resultsPerPage = obj.page.limit ||3;
    var skipFrom = (pageNumber*resultsPerPage)-resultsPerPage;
    var query = productsModel.find(q).sort('-date').skip(skipFrom).limit(resultsPerPage);
    
    query.exec(function (err, products) {
        if(err){
            callback(err,null,null);
        }else{
            productsModel.count(q, function (err,count) {
                if(err){
                    callback(err,null,null);
                }else{
                    var pageCount = Math.ceil(count/resultsPerPage);
                    callback(null,pageCount,products);
                }
            });
        }
    });
};

Products.remove = function (id,callback) {
    productsModel.remove({_id:id}, function (err) {
        if(err){
            return callback(err)
        }
        callback(null);
    })
};

Products.getProduct = function (callback) {
    productsModel.find({}, function (err,products) {
        if(err){
            callback (err);
        }
        callback(null,products);
    })
};