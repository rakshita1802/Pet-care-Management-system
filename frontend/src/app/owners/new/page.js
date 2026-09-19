"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = "http://127.0.0.1:8000";

export default function AddOwnerPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* VALIDATION */
  function validate() {
    const e = {};

    if (!form.name.trim()) e.name = "Owner name is required";
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email))
      e.email = "Enter a valid email address";
    if (!/^\d{10}$/.test(form.phone))
      e.phone = "Phone number must be exactly 10 digits";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* SUBMIT */
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      await fetch(`${BASE_URL}/owners/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      router.push("/owners");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-start pt-16 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-yellow-200 overflow-hidden">

        {/* HEADER */}
        <div className="bg-yellow-300 px-6 py-4">
          <h1 className="text-xl font-extrabold text-gray-900">
            Add New Pet Owner
          </h1>
          <p className="text-sm text-gray-700">
            Enter owner contact details carefully
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* OWNER NAME */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Owner Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="e.g. Rakesh Kumar"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              placeholder="example@gmail.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              placeholder="10-digit mobile number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
            )}
          </div>

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
              placeholder="Optional residential address"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg
                         font-semibold hover:bg-yellow-500 transition
                         disabled:opacity-60"
            >
              {loading ? "Saving..." : "Create Owner"}
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
