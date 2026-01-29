import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    donorName: {
        type: String,
        trim: true
    },
    donorEmail: {
        type: String,
        trim: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Please provide donation amount'],
        min: [1, 'Minimum donation amount is ₹1']
    },
    currency: {
        type: String,
        default: 'INR'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['razorpay', 'upi', 'card', 'netbanking', 'wallet'],
        default: 'razorpay'
    },
    razorpayOrderId: {
        type: String,
        unique: true,
        sparse: true
    },
    razorpayPaymentId: String,
    razorpaySignature: String,
    donationType: {
        type: String,
        enum: ['one-time', 'monthly', 'annual'],
        default: 'one-time'
    },
    purpose: {
        type: String,
        enum: ['general', 'medical', 'food', 'shelter', 'rescue'],
        default: 'general'
    },
    message: {
        type: String,
        trim: true,
        maxlength: [500, 'Message cannot exceed 500 characters']
    },
    anonymous: {
        type: Boolean,
        default: false
    },
    receiptUrl: String,
    taxBenefit: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Donation = mongoose.model('Donation', donationSchema);
export default Donation;


