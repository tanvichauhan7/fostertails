# 🐾 FosterTails

**A full-stack pet fostering and adoption platform connecting stray animals with loving homes and NGOs.**

![FosterTails](https://via.placeholder.com/800x400?text=FosterTails+Platform)

## 📋 Overview

FosterTails is a comprehensive platform designed to bridge the gap between stray animals and people willing to foster or adopt them. The platform also connects users with verified NGOs for rescue operations and allows supporters to make donations.

## ✨ Features

### For Users
- 🔐 **Secure Authentication** - Register and login with JWT-based authentication
- 📝 **Post Stray Animals** - Upload photos and details of stray animals found
- 🔍 **Browse & Search** - Find pets by species, location, age, and more
- 💝 **Foster or Adopt** - Submit requests to foster or adopt pets
- 💬 **Real-time Chat** - Connect with pet posters and NGOs
- 📊 **Personal Dashboard** - Track your posted pets and requests

### For NGOs
- ✅ **Verified Profiles** - Get verified as a legitimate organization
- 🏥 **Manage Rescues** - Track and manage rescue operations
- 💰 **Accept Donations** - Receive donations via Razorpay
- 📈 **Analytics Dashboard** - View donation stats and rescue metrics
- 🌟 **Rating System** - Build reputation through user reviews

### General Features
- 🗺️ **Location-based Search** - Find pets near you
- 🚨 **Emergency Alerts** - Urgent rescue notifications
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Clean and intuitive interface

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing

### Frontend (Coming Soon)
- **React.js** - UI library
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - API calls

### Payment Integration
- **Razorpay** - Payment gateway for donations

### Deployment
- **Backend:** Render / Railway
- **Database:** MongoDB Atlas
- **Frontend:** Vercel / Netlify

## 📁 Project Structure
```
fostertails/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Pet.js
│   │   ├── Donation.js
│   │   ├── NGO.js
│   │   └── index.js
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── .env
│   ├── server.js
│   └── package.json
└── frontend/ (Coming soon)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/fostertails.git
cd fostertails
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Set up environment variables**
Create a `.env` file in the backend folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

4. **Run the server**
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📊 Database Models

### User Model
- Basic user information
- Role-based access (user, NGO, admin)
- Location tracking
- Pet history (posted, fostered, adopted)

### Pet Model
- Complete pet details
- Health status
- Location with coordinates
- Foster/adoption requests
- Current status tracking

### Donation Model
- Donor and recipient information
- Razorpay integration
- Payment status tracking
- Anonymous donation support

### NGO Model
- Organization details
- Verification status
- Bank details
- Services offered
- Rating and reviews

## 🔄 Current Status

🚧 **Project is under active development**

- ✅ Backend setup complete
- ✅ Database models created
- ✅ MongoDB integration done
- 🔄 Authentication routes (In Progress)
- ⏳ Frontend (Coming soon)
- ⏳ Razorpay integration (Coming soon)

## 🎯 Roadmap

- [ ] Complete authentication system
- [ ] Build REST API for pets
- [ ] Integrate Razorpay payment
- [ ] Create React frontend
- [ ] Add real-time chat
- [ ] Implement notifications
- [ ] Deploy to production

## 👨‍💻 Author

**Your Name**
- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-profile)
- Email: your.email@example.com

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if you like this project!

---

Made with ❤️ for animals in need
