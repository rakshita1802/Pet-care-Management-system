import { BASE_URL } from "./config";

/* GET ALL OWNERS */
export async function fetchOwners() {
  const res = await fetch(`${BASE_URL}/owners/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch owners");
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

/* GET OWNER BY ID */
export async function fetchOwnerById(id) {
  const res = await fetch(`${BASE_URL}/owners/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Owner not found");
  }

  return await res.json();
}

/* CREATE OWNER */
export async function createOwner(ownerData) {
  const res = await fetch(`${BASE_URL}/owners/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ownerData),
  });

  if (!res.ok) {
    throw new Error("Failed to create owner");
  }

  return await res.json();
}

/* UPDATE OWNER */
export async function updateOwner(ownerId, ownerData) {
  const res = await fetch(`${BASE_URL}/owners/${ownerId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ownerData),
  });

  if (!res.ok) {
    throw new Error("Failed to update owner");
  }

  return await res.json();
}

/* DELETE OWNER */
export async function deleteOwner(ownerId) {
  const res = await fetch(`${BASE_URL}/owners/${ownerId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete owner");
  }
}
