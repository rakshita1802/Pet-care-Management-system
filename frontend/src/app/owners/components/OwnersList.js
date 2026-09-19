"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchOwners, deleteOwner } from "@/app/api/owners";

export default function OwnersList() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  /* LOAD OWNERS */
  useEffect(() => {
    async function load() {
      const data = await fetchOwners();
      setOwners(data || []);
      setLoading(false);
    }
    load();
  }, []);

  /* DELETE HANDLER */
  async function handleDelete(ownerId, ownerName) {
    const ok = confirm(
      `Delete owner "${ownerName}"?\n\nAll associated pets will be permanently deleted.`
    );
    if (!ok) return;

    try {
      await deleteOwner(ownerId);
      setOwners((prev) => prev.filter((o) => o.id !== ownerId));
    } catch (err) {
      alert("Failed to delete owner");
      console.error(err);
    }
  }

  /* LOADING */
  if (loading) {
    return <p className="p-6 text-gray-600">Loading owners...</p>;
  }

  /* EMPTY STATE */
  if (owners.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-md border border-yellow-100 p-12 text-center">
        <div className="text-6xl mb-4">🐶</div>
        <h3 className="text-lg font-semibold text-gray-800">
          No pet owners yet
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Add your first owner to start managing pets
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-yellow-100 overflow-hidden">
      <div className="overflow-x-auto max-h-[520px]">
        <table className="w-full border-collapse">

          {/* HEADER */}
          <thead className="sticky top-0 z-10 bg-[#fff8e6]">
            <tr className="text-xs uppercase tracking-wider text-gray-600">
              <th className="p-4 text-left">Owner</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {owners.map((owner) => (
              <tr
                key={owner.id}
                className="border-t hover:bg-yellow-50 transition-colors"
              >
                {/* NAME */}
                <td className="p-4 font-semibold text-gray-900">
                  <Link
                    href={`/owners/${owner.id}`}
                    className="hover:text-indigo-600 hover:underline transition"
                  >
                    {owner.name}
                  </Link>
                </td>

                {/* PHONE */}
                <td className="p-4 text-gray-800">{owner.phone}</td>

                {/* EMAIL */}
                <td className="p-4 text-gray-800">{owner.email}</td>

                {/* ACTIONS */}
                <td className="p-4 text-right space-x-2">
                  <Link
                    href={`/owners/${owner.id}`}
                    className="inline-flex px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200"
                  >
                    View Pets
                  </Link>

                  <Link
                    href={`/owners/edit/${owner.id}`}
                    className="inline-flex px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-200"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(owner.id, owner.name)}
                    className="inline-flex px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
