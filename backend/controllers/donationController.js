import Donation from '../models/Donation.js';
import NGO from '../models/NGO.js';

// @desc    Create donation (initiate payment)
// @route   POST /api/donations
// @access  Private
export const createDonation = async (req, res) => {
    try {
        const {
            recipient,
            amount,
            donationType,
            purpose,
            message,
            anonymous
        } = req.body;

        // Validation
        if (!recipient || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Please provide recipient and amount'
            });
        }

        if (amount < 1) {
            return res.status(400).json({
                success: false,
                message: 'Minimum donation amount is ₹1'
            });
        }

        // Check if recipient exists and is an NGO
        const ngo = await NGO.findOne({ user: recipient });
        if (!ngo) {
            return res.status(404).json({
                success: false,
                message: 'NGO not found'
            });
        }

        // Create donation record
        const donation = await Donation.create({
            donor: req.user._id,
            donorName: anonymous ? 'Anonymous' : req.user.name,
            donorEmail: req.user.email,
            recipient,
            amount,
            donationType: donationType || 'one-time',
            purpose: purpose || 'general',
            message,
            anonymous: anonymous || false,
            paymentStatus: 'pending'
        });

        // TODO: Integrate Razorpay here
        // For now, we'll create a mock order ID
        donation.razorpayOrderId = `order_${Date.now()}`;
        await donation.save();

        await donation.populate('recipient', 'name email ngoDetails');

        res.status(201).json({
            success: true,
            message: 'Donation initiated successfully',
            donation,
            // In real implementation, return Razorpay order details here
            razorpayOrder: {
                id: donation.razorpayOrderId,
                amount: amount * 100, // Razorpay uses paise
                currency: 'INR'
            }
        });
    } catch (error) {
        console.error('Create donation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating donation',
            error: error.message
        });
    }
};

// @desc    Verify payment and update donation status
// @route   POST /api/donations/verify
// @access  Private
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        } = req.body;

        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            return res.status(400).json({
                success: false,
                message: 'Missing payment verification details'
            });
        }

        // Find donation
        const donation = await Donation.findOne({ razorpayOrderId });

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found'
            });
        }

        // TODO: Verify signature with Razorpay
        // For now, we'll mark it as completed
        donation.paymentStatus = 'completed';
        donation.razorpayPaymentId = razorpayPaymentId;
        donation.razorpaySignature = razorpaySignature;
        await donation.save();

        // Update NGO stats
        await NGO.findOneAndUpdate(
            { user: donation.recipient },
            {
                $inc: { totalDonationsReceived: donation.amount }
            }
        );

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            donation
        });
    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during payment verification',
            error: error.message
        });
    }
};

// @desc    Get all donations (with filters)
// @route   GET /api/donations
// @access  Private (Admin only)
export const getAllDonations = async (req, res) => {
    try {
        const {
            status,
            donationType,
            purpose,
            page = 1,
            limit = 20
        } = req.query;

        // Build query
        let query = {};

        if (status) query.paymentStatus = status;
        if (donationType) query.donationType = donationType;
        if (purpose) query.purpose = purpose;

        // Pagination
        const skip = (page - 1) * limit;

        const donations = await Donation.find(query)
            .populate('donor', 'name email')
            .populate('recipient', 'name email ngoDetails')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Donation.countDocuments(query);

        res.status(200).json({
            success: true,
            count: donations.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            donations
        });
    } catch (error) {
        console.error('Get all donations error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get my donations (as donor)
// @route   GET /api/donations/my/donated
// @access  Private
export const getMyDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ donor: req.user._id })
            .populate('recipient', 'name ngoDetails.organizationName')
            .sort({ createdAt: -1 });

        // Calculate total donated
        const totalDonated = donations
            .filter(d => d.paymentStatus === 'completed')
            .reduce((acc, d) => acc + d.amount, 0);

        res.status(200).json({
            success: true,
            count: donations.length,
            totalDonated,
            donations
        });
    } catch (error) {
        console.error('Get my donations error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get donations received by NGO
// @route   GET /api/donations/ngo/received
// @access  Private (NGO only)
export const getNGODonations = async (req, res) => {
    try {
        const donations = await Donation.find({ 
            recipient: req.user._id,
            paymentStatus: 'completed'
        })
            .populate('donor', 'name email')
            .sort({ createdAt: -1 });

        // Calculate total received
        const totalReceived = donations.reduce((acc, d) => acc + d.amount, 0);

        // Group by month
        const monthlyStats = {};
        donations.forEach(donation => {
            const month = new Date(donation.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!monthlyStats[month]) {
                monthlyStats[month] = 0;
            }
            monthlyStats[month] += donation.amount;
        });

        res.status(200).json({
            success: true,
            count: donations.length,
            totalReceived,
            monthlyStats,
            donations
        });
    } catch (error) {
        console.error('Get NGO donations error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get donation by ID
// @route   GET /api/donations/:id
// @access  Private
export const getDonationById = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id)
            .populate('donor', 'name email phone')
            .populate('recipient', 'name email ngoDetails');

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found'
            });
        }

        // Check if user is donor, recipient, or admin
        if (
            donation.donor.toString() !== req.user._id.toString() &&
            donation.recipient.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to view this donation'
            });
        }

        res.status(200).json({
            success: true,
            donation
        });
    } catch (error) {
        console.error('Get donation by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};