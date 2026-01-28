import Pet from '../models/Pet.js';
import User from '../models/User.js';

// @desc    Create a new pet listing
// @route   POST /api/pets
// @access  Private
export const createPet = async (req, res) => {
    try {
        const {
            name,
            species,
            breed,
            age,
            gender,
            size,
            color,
            description,
            images,
            location,
            healthStatus,
            temperament,
            availableFor,
            urgency
        } = req.body;

        // Validation
        if (!name || !species || !description || !location?.city || !availableFor) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: name, species, description, city, and availableFor'
            });
        }

        // Create pet
        const pet = await Pet.create({
            name,
            species,
            breed,
            age,
            gender,
            size,
            color,
            description,
            images,
            location,
            healthStatus,
            temperament,
            availableFor,
            urgency,
            postedBy: req.user._id
        });

        // Add pet to user's petsPosted array
        await User.findByIdAndUpdate(req.user._id, {
            $push: { petsPosted: pet._id }
        });

        // Populate postedBy field
        await pet.populate('postedBy', 'name email phone location');

        res.status(201).json({
            success: true,
            message: 'Pet listing created successfully',
            pet
        });
    } catch (error) {
        console.error('Create pet error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating pet listing',
            error: error.message
        });
    }
};

// @desc    Get all pets (with filters)
// @route   GET /api/pets
// @access  Public
export const getAllPets = async (req, res) => {
    try {
        const {
            species,
            city,
            state,
            age,
            gender,
            size,
            status,
            availableFor,
            urgency,
            search,
            page = 1,
            limit = 12
        } = req.query;

        // Build query
        let query = {};

        if (species) query.species = species;
        if (city) query['location.city'] = new RegExp(city, 'i');
        if (state) query['location.state'] = new RegExp(state, 'i');
        if (age) query.age = age;
        if (gender) query.gender = gender;
        if (size) query.size = size;
        if (status) query.status = status;
        if (availableFor) query.availableFor = availableFor;
        if (urgency) query.urgency = urgency;

        // Search by name or description
        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { breed: new RegExp(search, 'i') }
            ];
        }

        // Pagination
        const skip = (page - 1) * limit;

        // Get pets
        const pets = await Pet.find(query)
            .populate('postedBy', 'name email phone location avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count
        const total = await Pet.countDocuments(query);

        res.status(200).json({
            success: true,
            count: pets.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            pets
        });
    } catch (error) {
        console.error('Get all pets error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching pets',
            error: error.message
        });
    }
};

// @desc    Get single pet by ID
// @route   GET /api/pets/:id
// @access  Public
export const getPetById = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id)
            .populate('postedBy', 'name email phone location avatar role ngoDetails')
            .populate('currentCaretaker', 'name email phone')
            .populate('requests.user', 'name email phone location');

        if (!pet) {
            return res.status(404).json({
                success: false,
                message: 'Pet not found'
            });
        }

        // Increment views
        pet.views += 1;
        await pet.save();

        res.status(200).json({
            success: true,
            pet
        });
    } catch (error) {
        console.error('Get pet by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching pet',
            error: error.message
        });
    }
};

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Private (Owner or Admin)
export const updatePet = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);

        if (!pet) {
            return res.status(404).json({
                success: false,
                message: 'Pet not found'
            });
        }

        // Check if user is owner or admin
        if (pet.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this pet listing'
            });
        }

        // Update pet
        const updatedPet = await Pet.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('postedBy', 'name email phone location');

        res.status(200).json({
            success: true,
            message: 'Pet listing updated successfully',
            pet: updatedPet
        });
    } catch (error) {
        console.error('Update pet error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating pet',
            error: error.message
        });
    }
};

// @desc    Delete pet
// @route   DELETE /api/pets/:id
// @access  Private (Owner or Admin)
export const deletePet = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);

        if (!pet) {
            return res.status(404).json({
                success: false,
                message: 'Pet not found'
            });
        }

        // Check if user is owner or admin
        if (pet.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this pet listing'
            });
        }

        await Pet.findByIdAndDelete(req.params.id);

        // Remove from user's petsPosted array
        await User.findByIdAndUpdate(pet.postedBy, {
            $pull: { petsPosted: pet._id }
        });

        res.status(200).json({
            success: true,
            message: 'Pet listing deleted successfully'
        });
    } catch (error) {
        console.error('Delete pet error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting pet',
            error: error.message
        });
    }
};

// @desc    Submit foster/adoption request
// @route   POST /api/pets/:id/request
// @access  Private
export const submitRequest = async (req, res) => {
    try {
        const { requestType, message, contactPhone } = req.body;

        if (!requestType || !['foster', 'adoption'].includes(requestType)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide valid request type (foster or adoption)'
            });
        }

        const pet = await Pet.findById(req.params.id);

        if (!pet) {
            return res.status(404).json({
                success: false,
                message: 'Pet not found'
            });
        }

        // Check if pet is available
        if (pet.status !== 'available') {
            return res.status(400).json({
                success: false,
                message: `This pet is currently ${pet.status} and not accepting new requests`
            });
        }

        // Check if user already submitted a request
        const existingRequest = pet.requests.find(
            req => req.user.toString() === req.user._id.toString() && req.status === 'pending'
        );

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: 'You already have a pending request for this pet'
            });
        }

        // Add request
        pet.requests.push({
            user: req.user._id,
            requestType,
            message,
            contactPhone: contactPhone || req.user.phone,
            status: 'pending'
        });

        await pet.save();
        await pet.populate('requests.user', 'name email phone location');

        res.status(200).json({
            success: true,
            message: 'Request submitted successfully',
            pet
        });
    } catch (error) {
        console.error('Submit request error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while submitting request',
            error: error.message
        });
    }
};

// @desc    Update request status (approve/reject)
// @route   PUT /api/pets/:id/request/:requestId
// @access  Private (Pet owner only)
export const updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status || !['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide valid status (approved or rejected)'
            });
        }

        const pet = await Pet.findById(req.params.id);

        if (!pet) {
            return res.status(404).json({
                success: false,
                message: 'Pet not found'
            });
        }

        // Check if user is owner
        if (pet.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to manage requests for this pet'
            });
        }

        // Find request
        const request = pet.requests.id(req.params.requestId);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        // Update request status
        request.status = status;

        // If approved, update pet status and caretaker
        if (status === 'approved') {
            pet.status = request.requestType === 'adoption' ? 'adopted' : 'fostered';
            pet.currentCaretaker = request.user;

            // Update user's fostered/adopted arrays
            if (request.requestType === 'adoption') {
                await User.findByIdAndUpdate(request.user, {
                    $push: { petsAdopted: pet._id }
                });
            } else {
                await User.findByIdAndUpdate(request.user, {
                    $push: { petsFostered: pet._id }
                });
            }
        }

        await pet.save();
        await pet.populate('requests.user', 'name email phone');

        res.status(200).json({
            success: true,
            message: `Request ${status} successfully`,
            pet
        });
    } catch (error) {
        console.error('Update request status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating request',
            error: error.message
        });
    }
};

// @desc    Get user's posted pets
// @route   GET /api/pets/my/posted
// @access  Private
export const getMyPostedPets = async (req, res) => {
    try {
        const pets = await Pet.find({ postedBy: req.user._id })
            .populate('currentCaretaker', 'name email phone')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: pets.length,
            pets
        });
    } catch (error) {
        console.error('Get my posted pets error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get featured/urgent pets
// @route   GET /api/pets/featured
// @access  Public
export const getFeaturedPets = async (req, res) => {
    try {
        const pets = await Pet.find({
            $or: [
                { featured: true },
                { urgency: 'emergency' },
                { urgency: 'high' }
            ],
            status: 'available'
        })
            .populate('postedBy', 'name location')
            .sort({ urgency: -1, createdAt: -1 })
            .limit(6);

        res.status(200).json({
            success: true,
            count: pets.length,
            pets
        });
    } catch (error) {
        console.error('Get featured pets error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};