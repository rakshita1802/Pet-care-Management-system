"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createVaccination } from "@/app/api/vaccinations";
import { fetchPets } from "@/app/api/pets";

export default function VaccinationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetPetId = searchParams.get("petId");

  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({
    pet_id: presetPetId ? Number(presetPetId) : "",
    vaccine_name: "",
    administered_date: "",
    next_due_date: "",
    veterinarian_name: "",
    notes: "",
  });

  const [saving, setSaving] = useState(false);

  const inputBase = `
    w-full rounded-lg border border-gray-300
    px-4 py-2 text-sm text-gray-900
    placeholder:text-gray-400
    focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400
  `;

  /* Load pets ONLY if petId is not present */
  useEffect(() => {
    if (!presetPetId) {
      fetchPets().then(setPets).catch(console.error);
    }
  }, [presetPetId]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      await createVaccination(form);
      router.push(presetPetId ? `/pets/${presetPetId}` : "/vaccinations");
    } catch {
      alert("Failed to record vaccination");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-lg border p-6 space-y-5 max-w-xl"
    >
      <h2 className="text-xl font-extrabold text-gray-900">
        💉 Record Vaccination
      </h2>
      <p className="text-sm text-gray-500">
        Enter vaccination details for the pet
      </p>

      {/* PET SELECT */}
      {!presetPetId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pet
          </label>
          <select
            required
            value={form.pet_id}
            onChange={(e) => update("pet_id", Number(e.target.value))}
            className={inputBase}
          >
            <option value="" disabled>
              Select Pet
            </option>
            {pets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.species})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* VACCINE NAME */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vaccine Name
        </label>
        <input
          required
          type="text"
          placeholder="Rabies, Distemper, etc."
          value={form.vaccine_name}
          onChange={(e) => update("vaccine_name", e.target.value)}
          className={inputBase}
        />
      </div>

      {/* ADMINISTERED DATE */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date Administered
        </label>
        <input
          required
          type="date"
          value={form.administered_date}
          onChange={(e) => update("administered_date", e.target.value)}
          className={inputBase}
        />
      </div>

      {/* NEXT DUE DATE */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Next Due Date
        </label>
        <input
          required
          type="date"
          value={form.next_due_date}
          onChange={(e) => update("next_due_date", e.target.value)}
          className={inputBase}
        />
      </div>

      {/* VETERINARIAN NAME */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Veterinarian Name
        </label>
        <input
          required
          type="text"
          placeholder="Dr. Sharma"
          value={form.veterinarian_name}
          onChange={(e) => update("veterinarian_name", e.target.value)}
          className={inputBase}
        />
      </div>

      {/* NOTES */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes (optional)
        </label>
        <textarea
          rows={3}
          placeholder="Side effects, reminders, observations…"
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          className={`${inputBase} resize-none`}
        />
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 pt-2">
        <button
          disabled={saving}
          className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-5 py-2 rounded-full font-semibold hover:bg-yellow-500 transition shadow-sm disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Vaccination"}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2 rounded-full border text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
