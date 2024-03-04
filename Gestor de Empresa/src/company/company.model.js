import mongoose, { Schema, model } from 'mongoose'

const companySchema = Schema({
    name:{
        type: String,
        required: true
    },
    impactLevel:{
        type: Number,
        required: true
    },
    yearsExperience:{
        type: Date,
        required: true
    },
    categories: {
        type: [String],
        enum: ['Category1', 'Category2', 'Category3'],
        required: true
    }
})

export default model('company', companySchema)