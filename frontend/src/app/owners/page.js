import Link from "next/link";
import OwnersList from "./components/OwnersList";

export const metadata = {
  title: "Owners | Happy Paws",
};

export default function OwnersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f4ef] via-[#faf9f6] to-[#fdfcf9] py-10 px-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER CARD */}
        <div className="bg-white rounded-3xl shadow-lg border border-yellow-100 p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

          {/* TITLE */}
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
              <span className="text-3xl">🧑‍🤝‍🧑</span>
              Pet Owners
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage pet parents and view their furry families
            </p>
          </div>

          {/* ADD OWNER */}
          <Link
            href="/owners/new"
            className="
              inline-flex items-center gap-2
              px-5 py-2.5 rounded-full
              bg-yellow-300 text-gray-900
              font-semibold text-sm
              hover:bg-yellow-400
              transition-all shadow-sm
            "
          >
            <span className="text-lg">➕</span>
            Add Owner
          </Link>
        </div>

        {/* OWNERS LIST */}
        <OwnersList />

      </div>
    </div>
  );
}
