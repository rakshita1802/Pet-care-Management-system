import { fetchAuth } from "./config";

// Record Vaccination
export async function createVaccination(payload) {
  const res = await fetchAuth(`/vaccinations/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to record vaccination");
  return res.json();
}

// Get Due Vaccinations
export async function fetchDueVaccinations() {
  const res = await fetchAuth(`/vaccinations/due/`);
  if (!res.ok) throw new Error("Failed to fetch due vaccinations");
  return res.json();
}

// Get all vaccinations for a specific pet
export async function fetchVaccinationsByPet(petId) {
  const res = await fetchAuth(`/vaccinations/?pet_id=${petId}`);
  if (!res.ok) throw new Error("Failed to fetch pet vaccinations");
  return res.json();
}

// Get All Vaccinations
export async function fetchVaccinations() {
  const res = await fetchAuth(`/vaccinations/`);
  if (!res.ok) throw new Error("Failed to fetch all vaccinations");
  return res.json();
}
