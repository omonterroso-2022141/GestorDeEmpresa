import { Schema, model } from 'mongoose'

const userSchema = Schema({
    name: {
        type: String,
        required: true
    },
    userAdmin: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

export default model('admin', userSchema)