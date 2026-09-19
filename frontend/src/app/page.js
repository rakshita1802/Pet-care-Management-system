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

import Link from "next/link";

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f6f4ef] flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white/60 backdrop-blur-xl rounded-[3rem] p-12 md:p-20 text-center shadow-xl border border-white/50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="relative z-10">
          <div className="text-8xl mb-8 animate-bounce">🐾</div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
            Happy Paws
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Premium pet care management for a happier, healthier furry friend. 
            Track vaccinations, manage appointments, and stay connected with our expert veterinarians.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-gray-800 hover:scale-105 transition-all shadow-lg hover:shadow-xl"
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-900 hover:scale-105 transition-all shadow-sm"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <div className="bg-white/50 backdrop-blur-lg rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Scheduling</h3>
          <p className="text-gray-600">Book and manage veterinary appointments with just a few clicks.</p>
        </div>
        <div className="bg-white/50 backdrop-blur-lg rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-4xl mb-4">💉</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Health Tracking</h3>
          <p className="text-gray-600">Never miss a shot with automated vaccination reminders and history.</p>
        </div>
        <div className="bg-white/50 backdrop-blur-lg rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-4xl mb-4">❤️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Care</h3>
          <p className="text-gray-600">Your pets deserve the best. We ensure their health is our top priority.</p>
        </div>
      </div>
    </div>
  );
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
    return <LandingPage />;
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
