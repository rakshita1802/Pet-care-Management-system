export default function RecentActivity({ appointments, pets }) {
  if (!appointments.length) {
    return (
      <p className="text-sm text-gray-500">
        No recent activity found.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {appointments.map((a) => {
        const petName =
          pets.find((p) => p.id === a.pet_id)?.name || "Unknown";

        return (
          <div
            key={a.id}
            className="flex justify-between items-center
                       bg-gray-50 rounded-lg px-4 py-3"
          >
            <div>
              <p className="font-semibold text-gray-900">
                {a.appointment_type} · {petName}
              </p>
              <p className="text-xs text-gray-500">
                Appointment ·{" "}
                {new Date(a.appointment_date).toLocaleDateString()}
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold
                ${
                  a.effectiveStatus === "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
            >
              {a.effectiveStatus}
            </span>
          </div>
        );
      })}
    </div>
  );
}
