"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchOwners } from "@/app/api/owners";
import { createPet, fetchPetById, updatePet } from "@/app/api/pets";

export default function PetForm({ petId }) {
  const router = useRouter();
  const isEdit = Boolean(petId);

  const [owners, setOwners] = useState([]);
  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    age_months: "",
    weight: "",
    owner_id: "",
    health_status: "Healthy",
  });

  const [loading, setLoading] = useState(isEdit);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    async function load() {
      const ownersData = await fetchOwners();
      setOwners(ownersData);

      if (isEdit) {
        const pet = await fetchPetById(petId);
        setForm({
          name: pet.name,
          species: pet.species,
          breed: pet.breed || "",
          age_months: pet.age_months,
          weight: pet.weight || "",
          owner_id: pet.owner_id,
          health_status: pet.health_status,
        });
      }

      setLoading(false);
    }
    load();
  }, [isEdit, petId]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (isEdit) {
      await updatePet(petId, form);
    } else {
      await createPet(form);
    }

    router.push("/pets");
  }

  if (loading) {
    return <p className="p-6 text-gray-600">Loading pet details…</p>;
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex justify-center pt-16 bg-gradient-to-br from-yellow-50 via-amber-50 to-white">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-yellow-100 p-10">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            🐾 {isEdit ? "Edit Pet" : "Add New Pet"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isEdit
              ? "Update pet information"
              : "Enter pet details and assign an owner"}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Pet Name"
            required
          />

          <Select
            name="species"
            value={form.species}
            onChange={handleChange}
            required
            options={["Dog", "Cat", "Rabbit"]}
            placeholder="Select Species"
          />

          <Input
            name="breed"
            value={form.breed}
            onChange={handleChange}
            placeholder="Breed"
          />

          <Input
            name="age_months"
            type="number"
            value={form.age_months}
            onChange={handleChange}
            placeholder="Age (months)"
            required
          />

          <Input
            name="weight"
            type="number"
            value={form.weight}
            onChange={handleChange}
            placeholder="Weight (kg)"
          />

          <Select
            name="owner_id"
            value={form.owner_id}
            onChange={handleChange}
            required
            options={owners.map((o) => ({
              value: o.id,
              label: o.name,
            }))}
            placeholder="Select Owner"
          />

          <Select
            name="health_status"
            value={form.health_status}
            onChange={handleChange}
            options={["Healthy", "Vaccinated", "Under Treatment"]}
          />

          {/* ACTIONS */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="
                bg-yellow-400 text-gray-900
                px-8 py-2.5 rounded-full
                font-semibold shadow-sm
                hover:bg-yellow-500
                transition
              "
            >
              {isEdit ? "Update Pet" : "Save Pet"}
            </button>

            <Link
              href="/pets"
              className="
                px-8 py-2.5 rounded-full
                border border-gray-300
                text-gray-700
                hover:bg-gray-100
                transition
              "
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

/* REUSABLE INPUT */
function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`
        w-full rounded-xl border border-gray-300
        px-4 py-2.5 text-sm
        placeholder:text-gray-400
        focus:outline-none
        focus:ring-2 focus:ring-yellow-400
        focus:border-yellow-400
        ${className}
      `}
    />
  );
}

/* REUSABLE SELECT */
function Select({ options, placeholder, className = "", ...props }) {
  return (
    <select
      {...props}
      className={`
        w-full rounded-xl border border-gray-300
        px-4 py-2.5 text-sm
        focus:outline-none
        focus:ring-2 focus:ring-yellow-400
        focus:border-yellow-400
        ${className}
      `}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) =>
        typeof o === "string" ? (
          <option key={o} value={o}>
            {o}
          </option>
        ) : (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        )
      )}
    </select>
  );
}
