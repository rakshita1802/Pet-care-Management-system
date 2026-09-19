"use client";

import { useState } from "react";

export default function AppointmentFilters({ onFilter }) {
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [petId, setPetId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ date, status, petId });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All Status</option>
        <option value="Scheduled">Scheduled</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      <input
        type="number"
        placeholder="Pet ID"
        value={petId}
        onChange={(e) => setPetId(e.target.value)}
      />

      <button type="submit">Filter</button>
    </form>
  );
}
