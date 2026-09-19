import VaccinationForm from "../components/VaccinationForm";

export default function NewVaccinationPage() {
  return (
    <div className="min-h-screen flex justify-center py-10 px-4 bg-gray-50">
      <div className="w-full max-w-xl">
        <VaccinationForm />
      </div>
    </div>
  );
}
