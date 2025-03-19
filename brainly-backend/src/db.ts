import mongoose, {model, Schema} from 'mongoose';

const userSchema = new Schema({
    username :{ type : String, unique : true, required : true},

    password : { type : String, required : true},
});
export const UserModel = model('User',userSchema);

const contentSchema = new Schema({
    title : { type : String},
    link : { type : String},
    tags:[{ type: mongoose.Types.ObjectId, ref : 'Tag'}],
    userId : { type : mongoose.Types.ObjectId, ref : 'User',required :"true"},
});
export const ContentModel = model('Content',contentSchema);

const tagSchema = new Schema({
    title: { type : String, required : true, unique : true},
});
export const TagModel = model('Tag',tagSchema);

const linkSchema = new Schema({
    hash:{ type : String, required : true},
    userId:{ type : mongoose.Types.ObjectId, ref : 'User', required : true},
});
export const LinkModel = model('Link',linkSchema);