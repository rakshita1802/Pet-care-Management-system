import { BASE_URL } from "./config";

// Get all appointments
export async function fetchAppointments() {
  const res = await fetch(`${BASE_URL}/appointments/`);
  if (!res.ok) throw new Error("Failed to fetch appointments");
  const data = await res.json();
  return Array.isArray(data) ? data : data.appointments || [];
}

// CREATE appointment 
export async function createAppointment(payload) {
  const res = await fetch(`${BASE_URL}/appointments/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create appointment");
  return res.json();
}

// Update appointment status
export async function updateAppointmentStatus(appointmentId, status) {
  const res = await fetch(
    `${BASE_URL}/appointments/${appointmentId}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }
  );
  return res.json();
}

// Get appointments for a specific pet
export async function fetchAppointmentsByPet(petId) {
  const res = await fetch(`${BASE_URL}/appointments/?pet_id=${petId}`);
  if (!res.ok) throw new Error("Failed to fetch pet appointments");

  const data = await res.json();
  return Array.isArray(data) ? data : data.appointments || [];
}
