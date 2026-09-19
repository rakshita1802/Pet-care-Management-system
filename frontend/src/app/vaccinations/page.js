import VaccinationTracker from "./components/VaccinationTracker";

export const metadata = {
  title: "Vaccinations | Happy Paws",
};

export default function VaccinationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              💉 Vaccinations
            </h1>
            <p className="text-sm text-gray-500">
              Track and manage pet vaccination records
            </p>
          </div>
        </div>

        <VaccinationTracker />
      </div>
    </div>
  );
}
