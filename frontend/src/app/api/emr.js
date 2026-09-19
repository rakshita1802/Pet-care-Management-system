import { fetchAuth } from "./config";

export async function fetchMedicalRecords(petId) {
  const res = await fetchAuth(`/emr/pet/${petId}`);
  if (!res.ok) throw new Error("Failed to fetch medical records");
  return res.json();
}

export async function createMedicalRecord(recordData) {
  const res = await fetchAuth(`/emr/`, {
    method: "POST",
    body: JSON.stringify(recordData),
  });
  if (!res.ok) throw new Error("Failed to create medical record");
  return res.json();
}

export async function uploadAttachment(recordId, file) {
  const formData = new FormData();
  formData.append("file", file);

  // We can't use fetchAuth directly if we need to let the browser set Content-Type with boundary
  // Let's implement a custom fetch for FormData
  const token = localStorage.getItem("token");
  
  // Base URL from config
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  
  const res = await fetch(`${API_URL}/emr/${recordId}/upload`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData,
  });
  
  if (!res.ok) throw new Error("Failed to upload attachment");
  return res.json();
}
