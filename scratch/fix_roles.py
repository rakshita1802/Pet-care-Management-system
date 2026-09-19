import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), '..', 'backend', 'pets.db')
conn = sqlite3.connect(db_path)
conn.execute("UPDATE users SET role = 'CUSTOMER' WHERE role = 'customer'")
conn.execute("UPDATE users SET role = 'STAFF' WHERE role = 'staff'")
conn.commit()
conn.close()
print("Roles fixed.")
