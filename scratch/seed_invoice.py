import sqlite3
import os
from datetime import datetime, timedelta

db_path = os.path.join(os.path.dirname(__file__), '..', 'backend', 'pets.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get Michael's owner ID
cursor.execute("SELECT id FROM owners WHERE email = 'michael.smith.88@gmail.com'")
owner_id = cursor.fetchone()[0]

# Check if an invoice already exists
cursor.execute("SELECT id FROM invoices WHERE owner_id = ?", (owner_id,))
existing = cursor.fetchone()

if not existing:
    # Create Invoice
    due_date = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
    cursor.execute("""
        INSERT INTO invoices (owner_id, appointment_id, total_amount, status, due_date)
        VALUES (?, NULL, 80.0, 'Pending', ?)
    """, (owner_id, due_date))
    invoice_id = cursor.lastrowid
    
    # Create Invoice Item
    cursor.execute("""
        INSERT INTO invoice_items (invoice_id, description, quantity, unit_price)
        VALUES (?, 'General Checkup & Consultation', 1, 80.0)
    """, (invoice_id,))
    
    conn.commit()
    print("Successfully added $80 invoice to the database for Michael Smith.")
else:
    print("An invoice already exists for Michael Smith.")

conn.close()
