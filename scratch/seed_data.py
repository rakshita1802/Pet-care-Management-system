import urllib.request
import urllib.parse
import json
import random
from datetime import datetime, timedelta

base_url = 'http://localhost:8000'

owners_data = [
    {"name": "Michael Smith", "email": "michael.smith.88@gmail.com", "phone": "5551234567", "address": "456 Oak Avenue, Springfield"},
    {"name": "Sarah Johnson", "email": "s.johnson_pets@yahoo.com", "phone": "5559876543", "address": "789 Pine Road, Riverside"},
    {"name": "David Williams", "email": "davidwilliams_ny@hotmail.com", "phone": "5554567890", "address": "321 Elm Street, Lakeshore"},
    {"name": "Emily Brown", "email": "emily.brown.vet@gmail.com", "phone": "5552345678", "address": "654 Maple Court, Hill Valley"},
    {"name": "James Jones", "email": "jjones77@outlook.com", "phone": "5558765432", "address": "987 Cedar Lane, Brookside"},
    {"name": "Jessica Garcia", "email": "jessica.g.pets@gmail.com", "phone": "5553456789", "address": "147 Birch Way, Westwood"},
    {"name": "Robert Miller", "email": "robert.miller123@yahoo.com", "phone": "5557654321", "address": "258 Ash Boulevard, Eastville"},
    {"name": "Jennifer Davis", "email": "jen.davis.85@gmail.com", "phone": "5554561234", "address": "369 Walnut Drive, Northfield"},
    {"name": "William Rodriguez", "email": "w.rodriguez.work@hotmail.com", "phone": "5556549870", "address": "741 Chestnut Circle, Southpark"},
    {"name": "Linda Martinez", "email": "linda.martinez.catlover@gmail.com", "phone": "5557891234", "address": "852 Poplar Street, Westend"},
    {"name": "Thomas Hernandez", "email": "thernandez_99@yahoo.com", "phone": "5553216549", "address": "963 Spruce Court, Newtown"},
    {"name": "Susan Lopez", "email": "susan.lopez.dogs@gmail.com", "phone": "5559517530", "address": "159 Fir Lane, Oldtown"},
    {"name": "Charles Gonzalez", "email": "c.gonzalez.pets@outlook.com", "phone": "5557531590", "address": "753 Redwood Road, Downtown"},
    {"name": "Karen Wilson", "email": "karen.wilson.74@gmail.com", "phone": "5551593570", "address": "357 Dogwood Ave, Uptown"},
    {"name": "Christopher Anderson", "email": "canderson_animals@yahoo.com", "phone": "5558529630", "address": "951 Sycamore Blvd, Midtown"}
]

pets_data = [
    {"name": "Max", "species": "Dog", "breed": "Labrador Retriever", "age_months": 24, "weight": 29.5, "health_status": "Healthy"},
    {"name": "Bella", "species": "Cat", "breed": "Persian", "age_months": 36, "weight": 4.2, "health_status": "Overweight"},
    {"name": "Charlie", "species": "Dog", "breed": "Beagle", "age_months": 12, "weight": 11.0, "health_status": "Healthy"},
    {"name": "Lucy", "species": "Cat", "breed": "Siamese", "age_months": 48, "weight": 3.8, "health_status": "Healthy"},
    {"name": "Cooper", "species": "Dog", "breed": "Golden Retriever", "age_months": 60, "weight": 32.1, "health_status": "Arthritis"},
    {"name": "Luna", "species": "Cat", "breed": "Maine Coon", "age_months": 18, "weight": 6.5, "health_status": "Healthy"},
    {"name": "Milo", "species": "Dog", "breed": "Poodle", "age_months": 8, "weight": 5.4, "health_status": "Healthy"},
    {"name": "Chloe", "species": "Cat", "breed": "Ragdoll", "age_months": 72, "weight": 5.1, "health_status": "Dental Issues"},
    {"name": "Rocky", "species": "Dog", "breed": "German Shepherd", "age_months": 42, "weight": 35.2, "health_status": "Healthy"},
    {"name": "Sophie", "species": "Cat", "breed": "Sphynx", "age_months": 28, "weight": 3.2, "health_status": "Skin Condition"},
    {"name": "Bear", "species": "Dog", "breed": "Rottweiler", "age_months": 54, "weight": 45.0, "health_status": "Healthy"},
    {"name": "Lily", "species": "Cat", "breed": "British Shorthair", "age_months": 14, "weight": 4.5, "health_status": "Healthy"},
    {"name": "Duke", "species": "Dog", "breed": "Boxer", "age_months": 30, "weight": 28.7, "health_status": "Healthy"},
    {"name": "Nala", "species": "Cat", "breed": "Abyssinian", "age_months": 6, "weight": 2.1, "health_status": "Healthy"},
    {"name": "Tucker", "species": "Dog", "breed": "Dachshund", "age_months": 84, "weight": 7.5, "health_status": "Back Issues"}
]

appointments_data = [
    {"appointment_type": "Checkup", "description": "Annual general checkup", "status": "Completed"},
    {"appointment_type": "Vaccination", "description": "Rabies booster shot", "status": "Scheduled"},
    {"appointment_type": "Dental", "description": "Teeth cleaning and scaling", "status": "Scheduled"},
    {"appointment_type": "Surgery", "description": "Spay/Neuter operation", "status": "Completed"},
    {"appointment_type": "Consultation", "description": "Dietary consultation for weight management", "status": "Cancelled"},
    {"appointment_type": "Checkup", "description": "Follow-up after skin treatment", "status": "Scheduled"},
    {"appointment_type": "Grooming", "description": "Full grooming session", "status": "Completed"},
    {"appointment_type": "Vaccination", "description": "Feline leukemia vaccine", "status": "Scheduled"},
    {"appointment_type": "Checkup", "description": "Senior pet health screening", "status": "Scheduled"},
    {"appointment_type": "Emergency", "description": "Limping on right hind leg", "status": "Completed"},
    {"appointment_type": "Dental", "description": "Tooth extraction", "status": "Completed"},
    {"appointment_type": "Consultation", "description": "Behavioral consultation", "status": "Scheduled"},
    {"appointment_type": "Checkup", "description": "Puppy/Kitten first checkup", "status": "Completed"},
    {"appointment_type": "Vaccination", "description": "Parvovirus shot", "status": "Scheduled"},
    {"appointment_type": "Checkup", "description": "Routine physical examination", "status": "Scheduled"}
]

vaccinations_data = [
    {"vaccine_name": "Rabies", "veterinarian_name": "Dr. Smith", "notes": "No adverse reactions"},
    {"vaccine_name": "FVRCP", "veterinarian_name": "Dr. Johnson", "notes": "Booster needed in 1 year"},
    {"vaccine_name": "DHPP", "veterinarian_name": "Dr. Davis", "notes": "Standard annual booster"},
    {"vaccine_name": "FeLV", "veterinarian_name": "Dr. Wilson", "notes": "First dose of series"},
    {"vaccine_name": "Bordetella", "veterinarian_name": "Dr. Martinez", "notes": "Intranasal administration"},
    {"vaccine_name": "Lyme Disease", "veterinarian_name": "Dr. Anderson", "notes": "Recommended due to area"},
    {"vaccine_name": "Rabies", "veterinarian_name": "Dr. Smith", "notes": "3-year vaccine"},
    {"vaccine_name": "FVRCP", "veterinarian_name": "Dr. Johnson", "notes": "Completed series"},
    {"vaccine_name": "Leptospirosis", "veterinarian_name": "Dr. Davis", "notes": "Owner requested"},
    {"vaccine_name": "Canine Influenza", "veterinarian_name": "Dr. Wilson", "notes": "First dose"},
    {"vaccine_name": "Rabies", "veterinarian_name": "Dr. Martinez", "notes": "1-year vaccine"},
    {"vaccine_name": "FIV", "veterinarian_name": "Dr. Anderson", "notes": "Tested negative prior to vaccine"},
    {"vaccine_name": "DHPP", "veterinarian_name": "Dr. Smith", "notes": "Puppy booster"},
    {"vaccine_name": "FeLV", "veterinarian_name": "Dr. Johnson", "notes": "Annual booster"},
    {"vaccine_name": "Bordetella", "veterinarian_name": "Dr. Davis", "notes": "Required for boarding"}
]

def authenticate():
    data = urllib.parse.urlencode({"username": "admin@petcare.com", "password": "admin123"}).encode("utf-8")
    req = urllib.request.Request(
        f'{base_url}/auth/login',
        data=data,
    )
    try:
        res = urllib.request.urlopen(req)
        return json.loads(res.read())['access_token']
    except Exception as e:
        print(f"Auth error: {e}")
        return None

token = authenticate()

def make_request(endpoint, data):
    req = urllib.request.Request(
        f'{base_url}/{endpoint}',
        data=json.dumps(data).encode('utf-8'),
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {token}'
        }
    )
    try:
        res = urllib.request.urlopen(req)
        return json.loads(res.read())
    except Exception as e:
        print(f"Error on {endpoint}: {e}")
        if hasattr(e, 'read'):
            print(e.read().decode())
        return None

print("Seeding database...")
for i in range(15):
    # 1. Create Owner
    owner_data = owners_data[i]
    owner = make_request('owners/', owner_data)
    if not owner:
        continue
    
    owner_id = owner['id']
    
    # 2. Create Pet
    pet_data = pets_data[i]
    pet_data['owner_id'] = owner_id
    pet = make_request('pets/', pet_data)
    if not pet:
        continue
        
    pet_id = pet['id']
    
    # 3. Create Appointment
    appt_data = appointments_data[i]
    appt_data['pet_id'] = pet_id
    # Random date between 1 and 30 days IN THE FUTURE
    appt_date = datetime.now() + timedelta(days=random.randint(1, 30))
    appt_data['appointment_date'] = appt_date.strftime('%Y-%m-%d')
    make_request('appointments/', appt_data)
    
    # 4. Create Vaccination
    vacc_data = vaccinations_data[i]
    vacc_data['pet_id'] = pet_id
    # Administered date in the past
    admin_date = datetime.now() - timedelta(days=random.randint(10, 300))
    vacc_data['administered_date'] = admin_date.strftime('%Y-%m-%d')
    # Next due date 1 year after
    due_date = admin_date + timedelta(days=365)
    vacc_data['next_due_date'] = due_date.strftime('%Y-%m-%d')
    make_request('vaccinations/', vacc_data)
    
    print(f"[{i+1}/15] Seeded {owner_data['name']} -> {pet_data['name']}")

print("Seeding complete!")
