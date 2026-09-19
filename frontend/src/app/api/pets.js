const BASE_URL = "http://localhost:8000"; 

export async function fetchPets() {
  const res = await fetch(`${BASE_URL}/pets`);
  if (!res.ok) throw new Error("Failed to fetch pets");
  return res.json();
}

export async function fetchPetById(id) {
  const res = await fetch(`${BASE_URL}/pets/${id}`);
  if (!res.ok) return null;
  return res.json();
}



/* CREATE PET */
export async function createPet(payload) {
  const res = await fetch(`${BASE_URL}/pets/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

/* UPDATE PET */
export async function updatePet(id, payload) {
  const res = await fetch(`${BASE_URL}/pets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
