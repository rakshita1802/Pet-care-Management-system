"use client";

import { useEffect, useState } from "react";
import { fetchAppointments } from "@/app/api/appointments";
import { fetchPets } from "@/app/api/pets";

/* COLOR */
const TYPE_COLORS = {
  "General Checkup": "bg-amber-100 text-amber-800",
  Vaccination: "bg-green-100 text-green-800",
  Emergency: "bg-red-100 text-red-800",
  "Dental Cleaning": "bg-purple-100 text-purple-800",
  "Follow-up": "bg-yellow-100 text-yellow-800",
};

/* STATUS LOGIC */
function getEffectiveStatus(appointment) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const apptDate = new Date(appointment.appointment_date);
  apptDate.setHours(0, 0, 0, 0);

  if (appointment.status === "Cancelled") return "Cancelled";
  if (apptDate < today && appointment.status === "Scheduled")
    return "Completed";

  return appointment.status;
}

export default function AppointmentsCalendar() {
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [petFilter, setPetFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [apptData, petData] = await Promise.all([
        fetchAppointments(),
        fetchPets(),
      ]);
      setAppointments(apptData);
      setPets(petData);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return <p className="text-gray-600">Loading appointments...</p>;
  }

  const filteredAppointments = appointments
    .filter((a) => {
      const status = getEffectiveStatus(a);
      return statusFilter === "All" || status === statusFilter;
    })
    .filter((a) => petFilter === "All" || a.pet_id === Number(petFilter))
    .sort(
      (a, b) =>
        new Date(a.appointment_date) -
        new Date(b.appointment_date)
    );

  return (
    <div className="bg-white rounded-2xl shadow border p-6 space-y-6">

      {/* FILTER */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option>All</option>
          <option>Scheduled</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>

        <select
          value={petFilter}
          onChange={(e) => setPetFilter(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="All">All Pets</option>
          {pets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <div className="text-sm text-gray-600 flex items-center">
          Showing {filteredAppointments.length} appointment(s)
        </div>
      </div>

      {/* TABLE */}
      {filteredAppointments.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No appointments match the selected filters
        </p>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 uppercase text-xs text-gray-600">
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Pet</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.map((a) => {
              const petName =
                pets.find((p) => p.id === a.pet_id)?.name || "—";

              const status = getEffectiveStatus(a);

              return (
                <tr
                  key={a.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3">
                    {new Date(a.appointment_date).toLocaleDateString()}
                  </td>

                  <td className="p-3 font-medium text-gray-900">
                    {petName}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        TYPE_COLORS[a.appointment_type] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {a.appointment_type}
                    </span>
                  </td>

                  <td className="p-3 text-gray-600">
                    {a.description}
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
