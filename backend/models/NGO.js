import mongoose from 'mongoose';

const ngoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    organizationName: {
        type: String,
        required: [true, 'Please provide organization name'],
        trim: true,
        unique: true
    },
    registrationNumber: {
        type: String,
        required: [true, 'Please provide registration number'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Please provide organization description'],
        minlength: [50, 'Description should be at least 50 characters']
    },
    website: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide organization email'],
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Please provide contact number']
    },
    address: {
        street: String,
        city: {
            type: String,
            required: true
        },
        state: String,
        country: {
            type: String,
            default: 'India'
        },
        pincode: String
    },
    logo: {
        type: String,
        default: 'https://via.placeholder.com/200'
    },
    images: [{
        type: String
    }],
    verified: {
        type: Boolean,
        default: false
    },
    verificationDocuments: [{
        type: String
    }],
    bankDetails: {
        accountName: String,
        accountNumber: String,
        ifscCode: String,
        bankName: String,
        upiId: String
    },
    totalDonationsReceived: {
        type: Number,
        default: 0
    },
    totalAnimalsRescued: {
        type: Number,
        default: 0
    },
    activeRescues: {
        type: Number,
        default: 0
    },
    services: {
        type: [String],
        enum: ['rescue', 'medical', 'shelter', 'adoption', 'fostering', 'veterinary', 'training']
    },
    socialMedia: {
        facebook: String,
        instagram: String,
        twitter: String,
        linkedin: String
    },
    operatingHours: {
        monday: String,
        tuesday: String,
        wednesday: String,
        thursday: String,
        friday: String,
        saturday: String,
        sunday: String
    },
    emergencyContact: {
        name: String,
        phone: String,
        available24x7: {
            type: Boolean,
            default: false
        }
    },
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

const NGO = mongoose.model('NGO', ngoSchema);
export default NGO;