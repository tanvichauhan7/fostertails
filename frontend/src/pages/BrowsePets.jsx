import { useState } from "react";
import petsData from "../utils/petsData";
import PetCard from "../components/PetCard";
import "./BrowsePets.css";

const BrowsePets = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // Unique cities & animal types
  const cities = [...new Set(petsData.map((pet) => pet.city))];
  const animalTypes = [...new Set(petsData.map((pet) => pet.animalType))];

  // Filtering logic
  const filteredPets = petsData.filter((pet) => {
    return (
      (selectedCity === "" || pet.city === selectedCity) &&
      (selectedType === "" || pet.animalType === selectedType)
    );
  });

  return (
    <div className="browse-container">
      <h1>Browse Pets 🐶🐱</h1>
      <p className="subtitle">
        Adopt or foster a rescued animal near you
      </p>

      {/* FILTERS */}
      <div className="filters">
        {/* City Filter */}
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

        {/* Animal Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">All Animals</option>
          {animalTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
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
          <p className="empty-state">
            No pets found matching your filters 🐾
          </p>
        )}
      </div>
    </div>
  );
};

export default BrowsePets;
