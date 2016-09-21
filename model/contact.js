var mongoose = require('./db');

var contactSchema = new mongoose.Schema({
    user:String,
    date:Date,
    email:String,
    subject:String,
    message:String
},{
    collection:'contacts'
});


var contactsModel = mongoose.model('contacts',contactSchema);

function Contact(contacts){
    this.user = contacts.user;
    this.email = contacts.email;
    this.subject = contacts.subject;
    this.message = contacts.message
}


module.exports = Contact;

Contact.prototype.save = function (callback) {
    var contact = {
        user:this.user,
        date:Date.now(),
        email:this.email,
        subject : this.subject,
        message:this.message
    };

    var newContacts = new contactsModel(contact);
    newContacts.save(function (err) {
        if(err){
            return callback(err);
        }
        callback(null);
    });
};

Contact.getAll = function (obj,callback) {
    var q = obj.searchs ||{};
    var pageNumber = obj.page.num||1;
    var resultsPerPage = obj.page.limit ||3;
    var skipFrom = (pageNumber*resultsPerPage)-resultsPerPage;
    var query = contactsModel.find(q).sort('-date').skip(skipFrom).limit(resultsPerPage);

    query.exec(function (err, contacts) {
        if(err){
            callback(err,null,null);
        }else{
            contactsModel.count(q, function (err,count) {
                if(err){
                    callback(err,null,null);
                }else{
                    var pageCount = Math.ceil(count/resultsPerPage);
                    callback(null,pageCount,contacts);
                }
            });
        }
    });
};

Contact.remove = function (id,callback) {
    contactsModel.remove({_id:id}, function (err) {
        if(err){
            return callback(err)
        }
        callback(null);
    })
};

Contact.getProduct = function (callback) {
    contactsModel.find({}, function (err,contacts) {
        if(err){
            callback (err);
        }
        callback(null,contacts);
    })
};