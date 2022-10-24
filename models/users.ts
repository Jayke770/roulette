import mongoose from "mongoose"
interface User {
    info: {
        id: string,
        first_name?: string,
        last_name?: string,
        username: string,
        image?: string
    },
    balance: number,
    socketID: string,
    notification: {
        id: string,
        title: string,
        body: string,
        rouletteID: string,
        created: string
    }[],
    created: string,
}
const User = new mongoose.Schema<User>({
    info: {
        id: { type: String },
        first_name: { type: String },
        last_name: { type: String },
        username: { type: String },
        image: { type: String }
    },
    balance: { type: Number },
    socketID: { type: String },
    notification: [{
        id: { type: String },
        title: { type: String },
        body: { type: String },
        rouletteID: { type: String },
        created: { type: String },
    }],
    created: { type: String },
})
if (mongoose.models['user'] != null) {
    mongoose.deleteModel('user')
}
export default mongoose.model<User>('user', User)