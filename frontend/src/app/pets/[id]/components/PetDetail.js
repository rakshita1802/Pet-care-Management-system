"use client";

import { useEffect, useState } from "react";
import { fetchPetById } from "@/app/api/pets";
import { fetchOwnerById } from "@/app/api/owners";
import { fetchAppointments } from "@/app/api/appointments";
import { fetchVaccinationsByPet } from "@/app/api/vaccinations";

export default function PetDetail({ petId }) {
  const [pet, setPet] = useState(null);
  const [owner, setOwner] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const petData = await fetchPetById(petId);
        setPet(petData);

        const [ownerData, appts, vaccs] = await Promise.all([
          fetchOwnerById(petData.owner_id),
          fetchAppointments(),
          fetchVaccinationsByPet(petId),
        ]);

        setOwner(ownerData);

        // Only this pet’s appointments
        const petAppointments = appts.filter(
          (a) => a.pet_id === Number(petId)
        );

        setAppointments(petAppointments);
        setVaccinations(vaccs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [petId]);

  if (loading) {
    return <p className="text-gray-500">Loading pet details…</p>;
  }

  /* DERIVED DATA */

  const lastAppointments = appointments
    .filter((a) => a.status !== "Scheduled")
    .sort(
      (a, b) =>
        new Date(b.appointment_date) - new Date(a.appointment_date)
    )
    .slice(0, 3);

  const lastVaccination = vaccinations
    .sort(
      (a, b) =>
        new Date(b.administered_date) -
        new Date(a.administered_date)
    )[0];

  const today = new Date();
  const nextDueVaccination = vaccinations.find(
    (v) =>
      v.next_due_date &&
      new Date(v.next_due_date) >= today
  );

  /* UI */

  return (
    <div className="space-y-8">
      {/* PET HEADER */}
      <div className="bg-white rounded-2xl shadow border p-6">
        <h1 className="text-3xl font-extrabold text-gray-900">
          🐾 {pet.name}
        </h1>
        <p className="text-gray-500 mt-1">
          {pet.species} • {pet.breed} • {pet.age_months} months
        </p>
      </div>

      {/* OWNER CARD */}
      <div className="bg-indigo-50 rounded-2xl border border-indigo-200 p-6">
        <h2 className="text-lg font-bold text-indigo-900 mb-2">
          Owner
        </h2>
        <p className="text-gray-800 font-medium">
          {owner.name}
        </p>
        <p className="text-gray-600">
          📞 <a href={`tel:${owner.phone}`} className="underline">
            {owner.phone}
          </a>
        </p>
      </div>

      {/* APPOINTMENT HISTORY */}
      <div className="bg-white rounded-2xl shadow border p-6">
        <h2 className="text-lg font-bold mb-4">
          Recent Appointments
        </h2>

        {lastAppointments.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No completed or cancelled appointments
          </p>
        ) : (
          <ul className="space-y-3">
            {lastAppointments.map((a) => (
              <li
                key={a.id}
                className="flex justify-between items-center border rounded-lg p-3"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {a.appointment_type}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(
                      a.appointment_date
                    ).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    a.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {a.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* VACCINATION */}
      <div className="bg-white rounded-2xl shadow border p-6">
        <h2 className="text-lg font-bold mb-4">
          Vaccination Status
        </h2>

        {lastVaccination ? (
          <div className="space-y-2">
            <p className="text-gray-800">
              <strong>Last:</strong>{" "}
              {lastVaccination.vaccine_name} (
              {lastVaccination.administered_date})
            </p>

            {nextDueVaccination ? (
              <p className="text-red-600 font-semibold">
                Next Due:{" "}
                {nextDueVaccination.vaccine_name} on{" "}
                {nextDueVaccination.next_due_date}
              </p>
            ) : (
              <p className="text-green-600 font-medium">
                No upcoming vaccinations
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">
            No vaccination records
          </p>
        )}
      </div>
    </div>
  );
}
