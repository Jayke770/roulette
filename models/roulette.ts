import mongoose from 'mongoose'
interface RouletteTypes {
    id: string,
    autoStart: boolean,
    name: string,
    prize: string,
    startRoulette: boolean,
    StartDate: string,
    maxParticipants: number,
    isDone: boolean,
    winner: number,
    participants: {
        id: string,
        userid: string,
        option: string,
        created: string,
        style: {
            backgroundColor: string
        }
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
    startRoulette: {
        type: Boolean
    },
    StartDate: {
        type: String
    },
    maxParticipants: {
        type: Number
    },
    winner: {
        type: Number
    },
    participants: [{
        id: String,
        userid: String,
        created: String,
        option: String,
        style: {
            backgroundColor: String
        }
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