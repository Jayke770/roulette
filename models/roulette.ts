import mongoose from 'mongoose'
interface RouletteTypes {
    id: string,
    autoStart: boolean,
    name: string,
    prize: string,
    StartDate: string,
    maxParticipants: number,
    isDone: boolean,
    participants: {
        id: string,
        userid: string,
        created: string
    }[],
    created: string
}
const roulette = new mongoose.Schema<RouletteTypes>({
    id: {
        type: String
    },
    autoStart: {
        type: Boolean
    },
    name: {
        type: String
    },
    prize: {
        type: String
    },
    StartDate: {
        type: String
    },
    maxParticipants: {
        type: Number
    },
    participants: [{
        id: String,
        userid: String,
        created: String
    }],
    isDone: {
        type: Boolean
    },
    created: {
        type: String
    }
})
if (mongoose.models['roulette'] != null) {
    mongoose.deleteModel('roulette')
}
export default mongoose.model<RouletteTypes>('roulette', roulette)