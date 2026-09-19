import { fetchAuth } from "./config";

// Get all owners
export async function fetchOwners() {
  const res = await fetchAuth(`/owners/`);
  if (!res.ok) return [];
  return res.json();
}

// Get specific owner by ID
export async function fetchOwnerById(id) {
  const res = await fetchAuth(`/owners/${id}`);
  if (!res.ok) return null;
  return res.json();
}

// Search owners
export async function searchOwners(query) {
  const res = await fetchAuth(`/owners/?search=${query}`);
  if (!res.ok) return [];
  return res.json();
}

// Create new owner
export async function createOwner(payload) {
  const res = await fetchAuth(`/owners/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.detail || "Failed to create owner");
  }
  return res.json();
}

// Update owner
export async function updateOwner(ownerId, payload) {
  const res = await fetchAuth(`/owners/${ownerId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.detail || "Failed to update owner");
  }
  return res.json();
}

// Delete owner
export async function deleteOwner(ownerId) {
  const res = await fetchAuth(`/owners/${ownerId}`, {
    method: "DELETE",
  });
  
  if (!res.ok) {
    throw new Error("Failed to delete owner");
  }
  return true;
}
