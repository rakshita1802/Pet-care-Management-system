import { fetchOwners } from "@/app/api/owners";
import { fetchPets } from "@/app/api/pets";

export default async function OwnerDetails(props) {
  const { id: ownerId } = await props.params;

  const [owners, pets] = await Promise.all([
    fetchOwners(),
    fetchPets(),
  ]);

  const owner = owners.find(
    (o) => String(o.id) === String(ownerId)
  );

  if (!owner) {
    return (
      <div className="p-6 text-red-600">
        Owner not found
      </div>
    );
  }

  const ownerPets = pets.filter(
    (p) => String(p.owner_id) === String(ownerId)
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">
        {owner.name}
      </h1>

      <p className="text-gray-600">
        📞 {owner.phone} | 📧 {owner.email}
      </p>

      <div className="bg-white rounded-xl border p-4">
        <h2 className="text-xl font-semibold mb-4">
          Pets
        </h2>

        {ownerPets.length === 0 ? (
          <p className="text-gray-500">
            No pets found for this owner.
          </p>
        ) : (
          <ul className="space-y-2">
            {ownerPets.map((pet) => (
              <li
                key={pet.id}
                className="p-3 border rounded-lg"
              >
                <span className="font-medium">
                  {pet.name}
                </span>{" "}
                <span className="text-gray-500 text-sm">
                  ({pet.species})
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
