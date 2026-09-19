import Link from "next/link";
import AppointmentsCalendar from "./components/AppointmentsCalendar";

export const metadata = {
  title: "Appointments | Happy Paws",
};

export default function AppointmentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 space-y-6">
      
      {/* PAGE HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            Appointments
          </h1>
          <p className="text-sm text-gray-500">
            Schedule and track pet visits
          </p>
        </div>

        <Link
          href="/appointments/new"
          className="inline-flex items-center gap-2
                     bg-yellow-400 text-gray-900
                     px-5 py-2.5 rounded-full
                     font-semibold hover:bg-yellow-500
                     transition shadow-sm"
        >
          + Schedule Appointment
        </Link>
      </div>

      <AppointmentsCalendar />
    </div>
  );
}
