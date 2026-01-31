import "./PetCard.css";

const PetCard = ({ pet }) => {
  return (
    <div className="pet-card">
      <img src={pet.image} alt={pet.animalType} />

      <div className="pet-info">
        <h3>{pet.animalType}</h3>

        <p><strong>Breed:</strong> {pet.breed || "Unknown"}</p>
        <p><strong>Color:</strong> {pet.color || "Unknown"}</p>
        <p><strong>Age:</strong> {pet.age}</p>

        <p className="location">
          📍 {pet.area}, {pet.city}
        </p>

        <span className={`status ${pet.status?.toLowerCase()}`}>
          {pet.status}
        </span>

        <button className="primary-btn">
          {pet.status === "Foster" ? "Request Foster" : "Adopt"}
        </button>
      </div>
    </div>
  );
};

export default PetCard;
