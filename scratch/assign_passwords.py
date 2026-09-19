import sqlite3
import bcrypt
import os

db_path = os.path.join(os.path.dirname(__file__), '..', 'backend', 'pets.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get all owners
cursor.execute("SELECT id, email FROM owners")
owners = cursor.fetchall()

# Generate hash
password = b"password123"
salt = bcrypt.gensalt()
hashed_pw = bcrypt.hashpw(password, salt).decode('utf-8')

count = 0
for owner_id, email in owners:
    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    if not cursor.fetchone():
        cursor.execute(
            "INSERT INTO users (email, hashed_password, role, owner_id) VALUES (?, ?, ?, ?)",
            (email, hashed_pw, "customer", owner_id)
        )
        count += 1
        print(f"Assigned password 'password123' to {email}")

conn.commit()
print(f"Successfully created {count} user accounts.")
conn.close()
