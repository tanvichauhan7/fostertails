import "./PetCard.css"

const PetCard = ({ pet }) => {
  return (
    <div className="pet-card">
      <img src={pet.image} alt={pet.name} />

      <div className="pet-info">
        <h3>{pet.name}</h3>
        <p>{pet.breed}</p>
        <p>{pet.age}</p>
        <span>{pet.status}</span>
      </div>
    </div>
  )
}

export default PetCard
