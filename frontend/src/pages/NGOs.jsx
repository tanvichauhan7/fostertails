import "./NGOs.css";

const dummyNGOs = [
  {
    id: 1,
    name: "Paws & Claws Foundation",
    phone: "+91 98765 43210",
    email: "contact@pawsclaws.org",
    address: "Indiranagar, Bangalore, Karnataka",
    description: "Rescuing and rehabilitating abandoned dogs and cats."
  },
  {
    id: 2,
    name: "Stray Care India",
    phone: "+91 91234 56789",
    email: "help@straycare.in",
    address: "Andheri West, Mumbai, Maharashtra",
    description: "Providing medical care and shelter to injured strays."
  },
  {
    id: 3,
    name: "Hope for Paws",
    phone: "+91 99887 66554",
    email: "support@hopeforpaws.org",
    address: "Salt Lake, Kolkata, West Bengal",
    description: "Dedicated to stray animal rescue and adoption."
  }
];

const NGOs = () => {
  return (
    <div className="ngos-page">
      <h1>🐾 Partner NGOs</h1>
      <p>Connect with verified shelters and rescue organizations.</p>

      <div className="ngo-grid">
        {dummyNGOs.map((ngo) => (
          <div key={ngo.id} className="ngo-card">
            <h3>{ngo.name}</h3>

            <p className="desc">{ngo.description}</p>

            <div className="details">
              <p><strong>📍 Address:</strong> {ngo.address}</p>
              <p><strong>📞 Phone:</strong> {ngo.phone}</p>
              <p><strong>✉️ Email:</strong> {ngo.email}</p>
            </div>

            <button
              className="donate-btn"
              onClick={() => alert("Donation integration coming soon ❤️")}
            >
              Donate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NGOs;
