"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchPetById, updatePet } from "@/app/api/pets";
import { fetchOwners } from "@/app/api/owners";

export default function EditPetPage() {
  const router = useRouter();
  const { id: petId } = useParams(); // ✅ FIX

  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    age_months: "",
    weight: "",
    owner_id: "",
    health_status: "Healthy",
  });

  /* LOAD PET + OWNERS */
  useEffect(() => {
    async function loadData() {
      try {
        const [pet, ownersData] = await Promise.all([
          fetchPetById(petId),
          fetchOwners(),
        ]);

        setOwners(ownersData);
        setForm({
          name: pet.name || "",
          species: pet.species || "",
          breed: pet.breed || "",
          age_months: pet.age_months || "",
          weight: pet.weight || "",
          owner_id: pet.owner_id || "",
          health_status: pet.health_status || "Healthy",
        });
      } catch (err) {
        console.error("Failed to load pet", err);
      } finally {
        setLoading(false);
      }
    }

    if (petId) loadData();
  }, [petId]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await updatePet(petId, form);
      router.push("/pets");
    } catch {
      alert("Failed to update pet");
    }
  }

  if (loading) {
    return <p className="p-6 text-gray-600">Loading pet details...</p>;
  }

  return (
    <div className="min-h-screen bg-yellow-50 flex justify-center py-12 px-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="bg-yellow-400 px-6 py-5">
          <h1 className="text-2xl font-extrabold text-gray-900">
            ✏️ Edit Pet
          </h1>
          <p className="text-sm text-gray-800">
            Update pet information and ownership
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <Field label="Pet Name">
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="input"
              required
            />
          </Field>

          <Field label="Species">
            <select
              value={form.species}
              onChange={(e) => update("species", e.target.value)}
              className="input"
              required
            >
              <option value="">Select species</option>
              <option>Dog</option>
              <option>Cat</option>
              <option>Rabbit</option>
            </select>
          </Field>

          <Field label="Breed">
            <input
              value={form.breed}
              onChange={(e) => update("breed", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Age (months)">
            <input
              type="number"
              value={form.age_months}
              onChange={(e) => update("age_months", e.target.value)}
              className="input"
              required
            />
          </Field>

          <Field label="Weight (kg)">
            <input
              type="number"
              step="0.1"
              value={form.weight}
              onChange={(e) => update("weight", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Owner">
            <select
              value={form.owner_id}
              onChange={(e) => update("owner_id", Number(e.target.value))}
              className="input"
              required
            >
              <option value="">Select owner</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Health Status">
            <select
              value={form.health_status}
              onChange={(e) => update("health_status", e.target.value)}
              className="input"
            >
              <option>Healthy</option>
              <option>Vaccinated</option>
              <option>Under Treatment</option>
            </select>
          </Field>

          <div className="flex gap-4 pt-4">
            <button className="bg-yellow-400 px-6 py-2 rounded-full font-semibold hover:bg-yellow-500">
              Update Pet
            </button>
            <button
              type="button"
              onClick={() => router.push("/pets")}
              className="px-6 py-2 rounded-full border"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
        }
        .input:focus {
          outline: none;
          border-color: #facc15;
          box-shadow: 0 0 0 2px rgba(250, 204, 21, 0.3);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
