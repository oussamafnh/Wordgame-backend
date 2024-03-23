import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    authentication :{
        password: {
            type: String,
            required: true,
            select : false
        },
        salt : {
            type: String,
            select :false
        },
        sessionToken:{
            type: String,
            select :false
        }
    },
    avatar_url :{
        type: String,
        default: "https://res.cloudinary.com/dq7kjds8s/image/upload/v1710713373/eilzfl5d1uf3u3go07qx.png"
    }
});

const UserModel = mongoose.model('User', UserSchema);

export const getAllUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({ 'authentication.sessionToken': sessionToken });
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject());
export const updateUser = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);
export const deleteUser = (id: string) => UserModel.findByIdAndDelete(id);

export default UserModel;