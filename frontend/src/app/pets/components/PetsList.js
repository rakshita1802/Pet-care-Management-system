"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchPets } from "@/app/api/pets";
import { fetchOwners } from "@/app/api/owners";

const HEALTH_COLORS = {
  Healthy: "bg-green-100 text-green-700",
  Vaccinated: "bg-blue-100 text-blue-700",
  "Under Treatment": "bg-red-100 text-red-700",
};

export default function PetsList() {
  const router = useRouter();

  const [pets, setPets] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState("All");
  const [health, setHealth] = useState("All");
  const [maxAge, setMaxAge] = useState(100);
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    async function loadData() {
      const [petsData, ownersData] = await Promise.all([
        fetchPets(),
        fetchOwners(),
      ]);
      setPets(petsData);
      setOwners(ownersData);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return <p className="p-6 text-gray-600">Loading pets...</p>;
  }

  const filteredPets = pets
    .filter((pet) =>
      `${pet.name} ${pet.breed}`.toLowerCase().includes(search.toLowerCase())
    )
    .filter((pet) => species === "All" || pet.species === species)
    .filter((pet) => health === "All" || pet.health_status === health)
    .filter((pet) => pet.age_months <= maxAge)
    .sort((a, b) => {
      if (sortBy === "age") return a.age_months - b.age_months;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">🐾 Pets</h1>
          <p className="text-sm text-gray-500">
            Manage pets, health, and ownership
          </p>
        </div>

        <Link
          href="/pets/new"
          className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-semibold hover:bg-yellow-500 transition shadow-sm"
        >
          + Add Pet
        </Link>
      </div>

      {/* FILTERS */}
      <div className="bg-gray-50 border rounded-xl p-4 mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="Search name or breed..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full"
        />

        <select
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option>All</option>
          <option>Dog</option>
          <option>Cat</option>
          <option>Rabbit</option>
        </select>

        <select
          value={health}
          onChange={(e) => setHealth(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option>All</option>
          <option>Healthy</option>
          <option>Vaccinated</option>
          <option>Under Treatment</option>
        </select>

        <div>
          <label className="text-xs text-gray-500">
            Max Age: {maxAge} months
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={maxAge}
            onChange={(e) => setMaxAge(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="name">Sort by Name</option>
          <option value="age">Sort by Age</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto max-h-[520px] rounded-xl border">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-gray-100 z-10">
            <tr className="text-sm uppercase tracking-wide text-gray-700">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Species</th>
              <th className="p-3 text-left">Breed</th>
              <th className="p-3 text-left">Age</th>
              <th className="p-3 text-left">Owner</th>
              <th className="p-3 text-left">Health</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPets.map((pet) => {
              const ownerName =
                owners.find((o) => o.id === pet.owner_id)?.name || "—";

              return (
                <tr
                  key={pet.id}
                  onClick={() => router.push(`/pets/${pet.id}`)}
                  className="border-t cursor-pointer hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-semibold text-gray-900">
                    {pet.name}
                  </td>
                  <td className="p-3 text-gray-800">{pet.species}</td>
                  <td className="p-3 text-gray-800">{pet.breed}</td>
                  <td className="p-3 text-gray-900">{pet.age_months}</td>
                  <td className="p-3 text-gray-800 font-medium">
                    {ownerName}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${HEALTH_COLORS[pet.health_status]}`}
                    >
                      {pet.health_status}
                    </span>
                  </td>

                  {/* EDIT BUTTON */}
                  <td
                    className="p-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        router.push(`/pets/edit/${pet.id}`)
                      }
                      className="px-3 py-1 text-sm rounded-full border border-yellow-400 text-yellow-800 hover:bg-yellow-100 transition font-medium"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredPets.length === 0 && (
              <tr>
                <td colSpan="7">
                  <div className="flex flex-col items-center py-14 text-gray-500">
                    <span className="text-5xl mb-3">🐶</span>
                    <p className="font-medium">No pets found</p>
                    <p className="text-sm">
                      Try adjusting filters or add a new pet
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
