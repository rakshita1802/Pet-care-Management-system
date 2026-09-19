"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchVaccinations } from "@/app/api/vaccinations";

export default function VaccinationTracker() {
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVaccinations()
      .then(setVaccinations)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-600">Loading vaccinations...</p>;
  }

  const today = new Date();

  return (
    <div className="bg-white rounded-2xl shadow-lg border p-6 space-y-6">
      {/*  SECTION HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Vaccination Records
          </h2>
          <p className="text-sm text-gray-500">
            Upcoming, due, and completed vaccinations
          </p>
        </div>

        <Link
          href="/vaccinations/new"
          className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-semibold hover:bg-yellow-500 transition shadow-sm"
        >
          + Record Vaccination
        </Link>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr className="uppercase text-xs text-gray-600 tracking-wide">
              <th className="p-3 text-left">Pet ID</th>
              <th className="p-3 text-left">Vaccine</th>
              <th className="p-3 text-left">Administered</th>
              <th className="p-3 text-left">Next Due</th>
              <th className="p-3 text-left">Veterinarian</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {vaccinations.map((v) => {
              const dueDate = new Date(v.next_due_date);
              const isOverdue = dueDate < today;

              return (
                <tr
                  key={v.id}
                  className={`border-t ${
                    isOverdue ? "bg-red-50" : "hover:bg-yellow-50"
                  }`}
                >
                  <td className="p-3 font-medium text-gray-800">
                    {v.pet_id}
                  </td>

                  <td className="p-3 font-semibold text-gray-900">
                    {v.vaccine_name}
                  </td>

                  <td className="p-3 text-gray-700">
                    {v.administered_date}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isOverdue
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {v.next_due_date}
                    </span>
                  </td>

                  <td className="p-3 text-gray-700">
                    {v.veterinarian_name || "—"}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() =>
                        alert(
                          `Reminder sent for ${v.vaccine_name} (Pet ${v.pet_id})`
                        )
                      }
                      className="px-3 py-1 text-xs rounded-full border border-yellow-400 text-yellow-800 hover:bg-yellow-100 transition"
                    >
                      Send Reminder
                    </button>
                  </td>
                </tr>
              );
            })}

            {vaccinations.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="p-6 text-center text-gray-500"
                >
                  No vaccination records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
