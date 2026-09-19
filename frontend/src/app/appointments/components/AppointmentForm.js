"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createAppointment } from "@/app/api/appointments";
import { fetchPets } from "@/app/api/pets";

export default function AppointmentForm({ defaultPetId }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const petIdFromUrl = searchParams.get("petId");

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    pet_id: defaultPetId || petIdFromUrl || "",
    appointment_date: "",
    appointment_type: "",
    description: "",
    status: "Scheduled",
  });

  /* LOAD PETS */
  useEffect(() => {
    fetchPets().then(setPets).catch(console.error);
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });  
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await createAppointment(form);
      router.push("/appointments");
    } catch (err) {
      console.error(err);
      alert("Failed to schedule appointment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white rounded-2xl shadow-lg border p-8 space-y-6"
      >
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            📅 Schedule Appointment
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Book a visit for a pet
          </p>
        </div>

        {/* PET SELECT */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Pet
          </label>
          <select
            name="pet_id"
            value={form.pet_id}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">Choose a pet</option>
            {pets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.species})
              </option>
            ))}
          </select>
        </div>

        {/* DATE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Appointment Date
          </label>
          <input
            type="date"
            name="appointment_date"
            value={form.appointment_date}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* TYPE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Appointment Type
          </label>
          <select
            name="appointment_type"
            value={form.appointment_type}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">Select type</option>
            <option>General Checkup</option>
            <option>Vaccination</option>
            <option>Dental Cleaning</option>
            <option>Follow-up</option>
            <option>Emergency</option>
          </select>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Reason for visit, symptoms, notes…"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="
              bg-yellow-400 text-gray-900 px-6 py-2 rounded-full
              font-semibold hover:bg-yellow-500 transition
              disabled:opacity-60
            "
          >
            {loading ? "Saving..." : "Schedule Appointment"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
