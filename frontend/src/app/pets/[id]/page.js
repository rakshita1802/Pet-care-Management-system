import PetDetail from "./components/PetDetail";

export default async function PetDetailPage({ params }) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <div className="w-full max-w-5xl">
        <PetDetail petId={id} />
      </div>
    </div>
  );
}
