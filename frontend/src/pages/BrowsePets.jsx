import petsData from "../utils/petsData"
import PetCard from "../components/PetCard"
import "./BrowsePets.css"

const BrowsePets = () => {
  return (
    <div className="browse-container">
      <h1>Browse Pets 🐾</h1>

      <div className="pets-grid">
        {petsData.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  )
}

export default BrowsePets
