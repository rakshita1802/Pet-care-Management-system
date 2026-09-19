"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const BASE_URL = "http://127.0.0.1:8000";

export default function EditOwnerPage() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  /* FETCH OWNER */
  useEffect(() => {
    (async () => {
      const res = await fetch(`${BASE_URL}/owners/${id}`);
      const data = await res.json();

      setForm({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
      });

      setLoading(false);
    })();
  }, [id]);

  /* VALIDATION */
  function validate() {
    const e = {};

    if (!form.name.trim()) e.name = "Owner name is required";
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email))
      e.email = "Enter a valid email address";
    if (!/^\d{10}$/.test(form.phone))
      e.phone = "Phone number must be 10 digits";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* SUBMIT */
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    await fetch(`${BASE_URL}/owners/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/owners");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading owner details…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-start pt-16 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-yellow-200 overflow-hidden">

        {/* HEADER */}
        <div className="bg-yellow-300 px-6 py-4">
          <h1 className="text-xl font-extrabold text-gray-900">
            Edit Owner Details
          </h1>
          <p className="text-sm text-gray-700">
            Update owner information carefully
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          <Field
            label="Owner Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            error={errors.name}
            placeholder="Full name"
          />

          <Field
            label="Email Address"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            error={errors.email}
            placeholder="example@gmail.com"
          />

          <Field
            label="Phone Number"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
            error={errors.phone}
            placeholder="10-digit mobile number"
          />

          {/* ADDRESS */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Address
            </label>
            <textarea
              rows={3}
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
              placeholder="Residential address"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg
                         font-semibold hover:bg-yellow-500 transition"
            >
              Update Owner
            </button>

            <button
              type="button"
              onClick={() => router.push("/owners")}
              className="px-6 py-2 rounded-lg border border-gray-300
                         text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

/* REUSABLE FIELD */
function Field({ label, value, onChange, error, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}
