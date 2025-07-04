const mongoose = require('mongoose');
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    userName :{
        type:String ,
        trim :true,
        required :true,
        max:32,
        unique:true,
        index:true,
    },
     name :{
        type:String ,
        required :true,
        max:32,
    },
     email :{
        type:String ,
        trim :true,
        unique:true,
        required :true,
        max:32,
    },
     profile :{
        type:String ,
        required :true,
    },
    hashed_password:{
        type:String ,
        required:true
    },
    salt : String ,
    about:{
        type:String
    },
    role:{
        type:Number,
         default: 0,
    },
    photo:{
        data:Buffer,
        contentType:String
    },
  
    resetPasswordLink: {
        type:String,
        default:""
    },
},{timestamps:true})

userSchema.virtual('password')
  .set(function(password){
    //create a temporary variable called _password
    this._password = password
    //generate salt
    this.salt = this.makeSalt()
    //encrypt 
    this.hashed_password = this.encryptPassword(password);
    
  })
  .get(function(){
    return this._password
  })

  //now add in userScema
  userSchema.methods ={
    authenticate : function(plainText){
        return this.encryptPassword(plainText) == this.hashed_password;
    } ,
    encryptPassword : function(password){
        if(!password) return ''
        try{
           return crypto.createHmac('sha1' , this.salt)
           .update(password)
           .digest('hex')
        }catch(err){
           return ''
        }
    },
    makeSalt:function(){
        return Math.round(new Date().valueOf() * Math.random())  +''
    }
  }
module.exports = mongoose.model('User' , userSchema)