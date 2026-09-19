import { fetchAuth } from "./config"; 

export async function fetchPets() {
  const res = await fetchAuth(`/pets`);
  if (!res.ok) throw new Error("Failed to fetch pets");
  return res.json();
}

export async function fetchPetById(id) {
  const res = await fetchAuth(`/pets/${id}`);
  if (!res.ok) throw new Error("Failed to fetch pet");
  return res.json();
}

export async function searchPets(query) {
    const res = await fetchAuth(`/pets/search/?q=${query}`);
    if (!res.ok) throw new Error("Failed to search pets");
    return res.json();
}

export async function createPet(petData) {
  const res = await fetchAuth(`/pets/`, {
    method: "POST",
    body: JSON.stringify(petData),
  });
  if (!res.ok) throw new Error("Failed to create pet");
  return res.json();
}

export async function updatePetStatus(id, health_status) {
  const res = await fetchAuth(`/pets/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ health_status }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}

export async function updatePet(id, petData) {
  const res = await fetchAuth(`/pets/${id}`, {
    method: "PUT",
    body: JSON.stringify(petData),
  });
  if (!res.ok) throw new Error("Failed to update pet");
  return res.json();
}
