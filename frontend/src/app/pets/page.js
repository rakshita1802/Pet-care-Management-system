import PetsList from "./components/PetsList";

export const metadata = {
  title: "Pets | Happy Paws",
};

export default function PetsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <PetsList />
      </div>
    </div>
  );
}
