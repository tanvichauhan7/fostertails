import NGO from '../models/NGO.js';
import User from '../models/User.js';

// @desc    Register/Create NGO profile
// @route   POST /api/ngos
// @access  Private (NGO role only)
export const createNGO = async (req, res) => {
    try {
        const {
            organizationName,
            registrationNumber,
            description,
            website,
            email,
            phone,
            address,
            logo,
            services,
            bankDetails,
            socialMedia,
            operatingHours,
            emergencyContact
        } = req.body;

        // Validation
        if (!organizationName || !registrationNumber || !description || !email || !phone || !address?.city) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if user role is NGO
        if (req.user.role !== 'ngo') {
            return res.status(403).json({
                success: false,
                message: 'Only NGO accounts can create NGO profiles'
            });
        }

        // Check if NGO already exists for this user
        const existingNGO = await NGO.findOne({ user: req.user._id });
        if (existingNGO) {
            return res.status(400).json({
                success: false,
                message: 'NGO profile already exists for this user'
            });
        }

        // Check if organization name or registration number already exists
        const duplicateNGO = await NGO.findOne({
            $or: [
                { organizationName },
                { registrationNumber }
            ]
        });

        if (duplicateNGO) {
            return res.status(400).json({
                success: false,
                message: 'Organization name or registration number already exists'
            });
        }

        // Create NGO
        const ngo = await NGO.create({
            user: req.user._id,
            organizationName,
            registrationNumber,
            description,
            website,
            email,
            phone,
            address,
            logo,
            services,
            bankDetails,
            socialMedia,
            operatingHours,
            emergencyContact
        });

        // Update user's ngoDetails
        await User.findByIdAndUpdate(req.user._id, {
            'ngoDetails.organizationName': organizationName,
            'ngoDetails.registrationNumber': registrationNumber,
            'ngoDetails.description': description
        });

        await ngo.populate('user', 'name email phone');

        res.status(201).json({
            success: true,
            message: 'NGO profile created successfully. Verification pending.',
            ngo
        });
    } catch (error) {
        console.error('Create NGO error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating NGO profile',
            error: error.message
        });
    }
};

// @desc    Get all NGOs (with filters)
// @route   GET /api/ngos
// @access  Public
export const getAllNGOs = async (req, res) => {
    try {
        const {
            city,
            state,
            services,
            verified,
            search,
            page = 1,
            limit = 12
        } = req.query;

        // Build query
        let query = {};

        if (city) query['address.city'] = new RegExp(city, 'i');
        if (state) query['address.state'] = new RegExp(state, 'i');
        if (services) query.services = { $in: services.split(',') };
        if (verified) query.verified = verified === 'true';

        // Search by organization name or description
        if (search) {
            query.$or = [
                { organizationName: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') }
            ];
        }

        // Pagination
        const skip = (page - 1) * limit;

        // Get NGOs
        const ngos = await NGO.find(query)
            .populate('user', 'name email avatar')
            .sort({ verified: -1, 'rating.average': -1, createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count
        const total = await NGO.countDocuments(query);

        res.status(200).json({
            success: true,
            count: ngos.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            ngos
        });
    } catch (error) {
        console.error('Get all NGOs error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching NGOs',
            error: error.message
        });
    }
};

// @desc    Get single NGO by ID
// @route   GET /api/ngos/:id
// @access  Public
export const getNGOById = async (req, res) => {
    try {
        const ngo = await NGO.findById(req.params.id)
            .populate('user', 'name email phone avatar')
            .populate('reviews.user', 'name avatar');

        if (!ngo) {
            return res.status(404).json({
                success: false,
                message: 'NGO not found'
            });
        }

        res.status(200).json({
            success: true,
            ngo
        });
    } catch (error) {
        console.error('Get NGO by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching NGO',
            error: error.message
        });
    }
};

// @desc    Update NGO profile
// @route   PUT /api/ngos/:id
// @access  Private (NGO owner only)
export const updateNGO = async (req, res) => {
    try {
        const ngo = await NGO.findById(req.params.id);

        if (!ngo) {
            return res.status(404).json({
                success: false,
                message: 'NGO not found'
            });
        }

        // Check if user owns this NGO
        if (ngo.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this NGO profile'
            });
        }

        // Don't allow updating verification status through this route
        delete req.body.verified;

        // Update NGO
        const updatedNGO = await NGO.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('user', 'name email phone');

        res.status(200).json({
            success: true,
            message: 'NGO profile updated successfully',
            ngo: updatedNGO
        });
    } catch (error) {
        console.error('Update NGO error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating NGO',
            error: error.message
        });
    }
};

// @desc    Add review to NGO
// @route   POST /api/ngos/:id/review
// @access  Private
export const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a rating between 1 and 5'
            });
        }

        const ngo = await NGO.findById(req.params.id);

        if (!ngo) {
            return res.status(404).json({
                success: false,
                message: 'NGO not found'
            });
        }

        // Check if user already reviewed
        const existingReview = ngo.reviews.find(
            review => review.user.toString() === req.user._id.toString()
        );

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this NGO'
            });
        }

        // Add review
        ngo.reviews.push({
            user: req.user._id,
            rating,
            comment
        });

        // Recalculate average rating
        const totalRating = ngo.reviews.reduce((acc, review) => acc + review.rating, 0);
        ngo.rating.average = totalRating / ngo.reviews.length;
        ngo.rating.count = ngo.reviews.length;

        await ngo.save();
        await ngo.populate('reviews.user', 'name avatar');

        res.status(200).json({
            success: true,
            message: 'Review added successfully',
            ngo
        });
    } catch (error) {
        console.error('Add review error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding review',
            error: error.message
        });
    }
};

// @desc    Get verified NGOs
// @route   GET /api/ngos/verified
// @access  Public
export const getVerifiedNGOs = async (req, res) => {
    try {
        const ngos = await NGO.find({ verified: true })
            .populate('user', 'name email avatar')
            .sort({ 'rating.average': -1 })
            .limit(12);

        res.status(200).json({
            success: true,
            count: ngos.length,
            ngos
        });
    } catch (error) {
        console.error('Get verified NGOs error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Verify NGO (Admin only)
// @route   PUT /api/ngos/:id/verify
// @access  Private (Admin only)
export const verifyNGO = async (req, res) => {
    try {
        const ngo = await NGO.findById(req.params.id);

        if (!ngo) {
            return res.status(404).json({
                success: false,
                message: 'NGO not found'
            });
        }

        ngo.verified = true;
        await ngo.save();

        // Update user's ngoDetails
        await User.findByIdAndUpdate(ngo.user, {
            'ngoDetails.verified': true
        });

        res.status(200).json({
            success: true,
            message: 'NGO verified successfully',
            ngo
        });
    } catch (error) {
        console.error('Verify NGO error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};