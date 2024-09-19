import mongoose from "mongoose";

const measurementSchema = new mongoose.Schema(
    {
        MeasurementID: {
            type: String,
            required: true,
        },

        Gender: {
            type: String,
            required: true,
        },
        
        Bust: {
            type: Number,
            required: true,
        },

        UnderBust: {
            type: Number,
            required: true,
        },

        NeckBase: {
            type: Number,
            required: true,
        },
        
        Waist: {
            type: Number,
            required: true,
        },
    
        Hip: {
            type: Number,
            required: true,
        },
    
        ShoulderWidth: {
            type: Number,
            required: true,
        },

        TopSize: {
            type: String,
            required: true,
        },

        PantSize: {
            type: String,
            required: true,
        },

    },
    {
        timestamps: true,
    }
);

export const Measurement = mongoose.model("Measurement", measurementSchema);