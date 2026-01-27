import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    phone: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'ngo', 'admin'],
        default: 'user'
    },
    avatar: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    location: {
        city: String,
        state: String,
        country: String,
        pincode: String
    },
    // For NGO users only
    ngoDetails: {
        organizationName: String,
        registrationNumber: String,
        verified: {
            type: Boolean,
            default: false
        },
        description: String,
        website: String,
        address: String
    },
    // Arrays to track user's pets
    petsPosted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
    }],
    petsFostered: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
    }],
    petsAdopted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

// Hash password before saving to database
userSchema.pre('save', async function(next) {
    // Only hash if password is new or modified
    if (!this.isModified('password')) {
        return next();
    }
    
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to check if entered password matches hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;