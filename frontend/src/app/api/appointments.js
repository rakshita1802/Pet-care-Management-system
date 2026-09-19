import { fetchAuth } from "./config";

// Get all appointments
export async function fetchAppointments() {
  const res = await fetchAuth(`/appointments/`);
  if (!res.ok) throw new Error("Failed to fetch appointments");
  const data = await res.json();
  return Array.isArray(data) ? data : data.appointments || [];
}

// CREATE appointment 
export async function createAppointment(payload) {
  const res = await fetchAuth(`/appointments/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create appointment");
  return res.json();
}

// Update appointment status
export async function updateAppointmentStatus(appointmentId, status) {
  const res = await fetchAuth(
    `/appointments/${appointmentId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );
  return res.json();
}

// Get appointments for a specific pet
export async function fetchAppointmentsByPet(petId) {
  const res = await fetchAuth(`/appointments/?pet_id=${petId}`);
  if (!res.ok) throw new Error("Failed to fetch pet appointments");

  const data = await res.json();
  return Array.isArray(data) ? data : data.appointments || [];
}
