export default function DashboardCard({ title, value, icon, danger }) {
  return (
    <div
      className={`flex items-center gap-4 p-5 rounded-xl shadow-sm border
      ${danger ? "bg-red-50 border-red-200" : "bg-white border-gray-200"}`}
    >
      {/* Icon */}
      <div
        className={`p-3 rounded-full text-white
        ${danger ? "bg-red-500" : "bg-indigo-600"}`}
      >
        {icon}
      </div>

      {/* Text */}
      <div>
        <p className="text-sm font-medium text-gray-500">
          {title}
        </p>
        <p className="text-3xl font-bold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}
