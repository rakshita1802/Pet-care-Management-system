import { BASE_URL } from "./config";

/* FETCH ALL */

export async function fetchVaccinations() {
  const res = await fetch(`${BASE_URL}/vaccinations/`);
  if (!res.ok) throw new Error("Failed to fetch vaccinations");
  return res.json();
}

/* FETCH DUE */

export async function fetchDueVaccinations() {
  const res = await fetch(`${BASE_URL}/vaccinations/due/`);
  if (!res.ok) throw new Error("Failed to fetch due vaccinations");
  return res.json();
}

/* FETCH BY PET */

export async function fetchVaccinationsByPet(petId) {
  const res = await fetch(`${BASE_URL}/vaccinations/?pet_id=${petId}`);
  if (!res.ok) throw new Error("Failed to fetch pet vaccinations");

  const data = await res.json();
  return Array.isArray(data) ? data : data.vaccinations || [];
}

/* CREATE */

export async function createVaccination(payload) {
  const res = await fetch(`${BASE_URL}/vaccinations/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to record vaccination");
  }

  return res.json();
}
