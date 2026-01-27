import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide pet name'],
        trim: true
    },
    species: {
        type: String,
        required: [true, 'Please specify species'],
        enum: ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'other'],
        lowercase: true
    },
    breed: {
        type: String,
        trim: true,
        default: 'Mixed breed'
    },
    age: {
        type: String,
        enum: ['puppy/kitten', 'young', 'adult', 'senior', 'unknown'],
        default: 'unknown'
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'unknown'],
        default: 'unknown'
    },
    size: {
        type: String,
        enum: ['small', 'medium', 'large', 'extra-large'],
        default: 'medium'
    },
    color: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        minlength: [20, 'Description should be at least 20 characters']
    },
    images: [{
        type: String // URLs to images
    }],
    location: {
        address: String,
        city: {
            type: String,
            required: [true, 'Please provide city']
        },
        state: String,
        country: {
            type: String,
            default: 'India'
        },
        pincode: String
    },
    healthStatus: {
        vaccinated: {
            type: Boolean,
            default: false
        },
        neutered: {
            type: Boolean,
            default: false
        },
        specialNeeds: {
            type: Boolean,
            default: false
        },
        medicalConditions: String
    },
    temperament: {
        type: [String],
        enum: ['friendly', 'shy', 'aggressive', 'playful', 'calm', 'energetic', 'trained']
    },
    status: {
        type: String,
        enum: ['available', 'fostered', 'adopted', 'pending', 'unavailable'],
        default: 'available'
    },
    availableFor: {
        type: [String],
        enum: ['fostering', 'adoption', 'both'],
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    urgency: {
        type: String,
        enum: ['low', 'medium', 'high', 'emergency'],
        default: 'medium'
    },
    // Foster/Adoption requests
    requests: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        requestType: {
            type: String,
            enum: ['foster', 'adoption']
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        message: String,
        contactPhone: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    currentCaretaker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    views: {
        type: Number,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Pet = mongoose.model('Pet', petSchema);
export default Pet;