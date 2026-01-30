import { useState } from "react";
import petsData from "../utils/petsData";
import PetCard from "../components/PetCard";
import "./BrowsePets.css";

const BrowsePets = () => {
  const [selectedCity, setSelectedCity] = useState("");

  // Get unique cities from pet data
  const cities = [...new Set(petsData.map(pet => pet.city))];

  const filteredPets = selectedCity
    ? petsData.filter(pet => pet.city === selectedCity)
    : petsData;

  return (
    <div className="browse-container">
      <h1>Browse Pets 🐶🐱</h1>

      {/* FILTER */}
      <div className="filters">
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">All Cities</option>
          {cities.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* PET GRID */}
      <div className="pets-grid">
        {filteredPets.length > 0 ? (
          filteredPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))
        ) : (
          <p>No pets found in this city.</p>
        )}
      </div>
    </div>
  );
};

export default BrowsePets;
