"use client";

import { useState, useEffect } from "react";
import { fetchOwners } from "./api/owners";
import { fetchPets } from "./api/pets";
import { fetchAppointments } from "./api/appointments";
import { fetchVaccinations } from "./api/vaccinations";
import { useAuth } from "@/context/AuthContext";

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

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  
  const [data, setData] = useState({
    owners: [],
    pets: [],
    appointments: [],
    vaccinations: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) {
      if (!authLoading) setLoading(false);
      return;
    }

    async function loadData() {
      try {
        const [o, p, a, v] = await Promise.all([
          fetchOwners(),
          fetchPets(),
          fetchAppointments(),
          fetchVaccinations(),
        ]);
        setData({ owners: o, pets: p, appointments: a, vaccinations: v });
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <div className="min-h-screen bg-[#f6f4ef] p-8 flex items-center justify-center">Loading dashboard...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f6f4ef] p-8 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Happy Paws 🐾</h1>
        <p className="text-gray-600">Please sign in to view your dashboard.</p>
      </div>
    );
  }

  const { owners, pets, appointments, vaccinations } = data;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const soon = new Date();
  soon.setDate(today.getDate() + 30);

  const dueVaccinations = vaccinations.filter((v) => {
    if (!v.next_due_date) return false;
    const d = new Date(v.next_due_date);
    d.setHours(0, 0, 0, 0);
    return d >= today && d <= soon;
  });

  const todaysAppointments = appointments.filter((a) => {
    const d = new Date(a.appointment_date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });

  const recentAppointments = appointments
    .map((a) => ({
      ...a,
      effectiveStatus: getEffectiveStatus(a),
    }))
    .filter(
      (a) =>
        a.effectiveStatus === "Completed" ||
        a.effectiveStatus === "Cancelled"
    )
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f6f4ef] p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HERO */}
        <div className="bg-gradient-to-r from-yellow-100 to-amber-200 rounded-3xl p-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Welcome back {user.role === 'customer' ? '🐾' : 'Admin 🐾'}
            </h1>
            <p className="text-gray-700 mt-2 max-w-md">
              Here’s what’s happening at Happy Paws today.
            </p>
          </div>
          <div className="hidden md:block text-6xl">🐶🐱</div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {user.role === 'staff' && (
            <StatCard
              title="Total Owners"
              value={owners.length}
              accent="bg-yellow-200"
            />
          )}
          <StatCard
            title={user.role === 'staff' ? "Total Pets" : "My Pets"}
            value={pets.length}
            accent="bg-orange-200"
          />
          <StatCard
            title="Vaccinations Due"
            value={dueVaccinations.length}
            accent="bg-red-200"
            danger
          />
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* TODAY */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Today’s Appointments
            </h2>

            {todaysAppointments.length === 0 ? (
              <p className="text-gray-500">
                No appointments today 🎉
              </p>
            ) : (
              <ul className="space-y-4">
                {todaysAppointments.map((a) => {
                  const pet = pets.find((p) => p.id === a.pet_id);
                  const status = getEffectiveStatus(a);

                  return (
                    <li
                      key={a.id}
                      className="flex justify-between items-center bg-gray-50 rounded-xl p-4"
                    >
                      <div>
                        <p className="font-semibold">
                          {pet?.name || "Unknown Pet"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {a.appointment_type}
                        </p>
                      </div>
                      <StatusPill status={status} />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* RECENT */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Recent Activity
            </h2>

            {recentAppointments.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent activity.</p>
            ) : (
              <ul className="space-y-3">
                {recentAppointments.map((a) => {
                  const pet = pets.find((p) => p.id === a.pet_id);
                  return (
                    <li
                      key={a.id}
                      className="bg-gray-50 rounded-xl p-3"
                    >
                      <div className="flex justify-between">
                        <p className="font-medium">{pet?.name}</p>
                        <StatusPill status={a.effectiveStatus} />
                      </div>
                      <p className="text-xs text-gray-500">
                        {a.appointment_type}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/*  COMPONENTS  */

function StatCard({ title, value, accent, danger }) {
  return (
    <div className={`rounded-3xl p-6 ${accent}`}>
      <p className="text-sm text-gray-700">{title}</p>
      <p
        className={`text-4xl font-extrabold mt-2 ${
          danger ? "text-red-700" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
    Scheduled: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        map[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
