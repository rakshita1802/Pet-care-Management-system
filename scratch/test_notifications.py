import urllib.request
import urllib.parse
import json

base_url = 'http://localhost:8000'

def test_notifications():
    print("Logging in as admin...")
    data = urllib.parse.urlencode({"username": "admin@petcare.com", "password": "admin123"}).encode("utf-8")
    req = urllib.request.Request(f'{base_url}/auth/login', data=data)
    try:
        res = urllib.request.urlopen(req)
        token = json.loads(res.read())['access_token']
    except Exception as e:
        print(f"Auth error: {e}")
        return

    print("Forcing some dates in DB to trigger emails...")
    import sqlite3
    from datetime import date, timedelta
    
    today = date.today()
    tomorrow = today + timedelta(days=1)
    next_week = today + timedelta(days=7)
    
    conn = sqlite3.connect('backend/pets.db')
    c = conn.cursor()
    # Force all scheduled appointments to tomorrow for testing
    c.execute("UPDATE appointments SET appointment_date = ? WHERE status = 'Scheduled'", (tomorrow.strftime('%Y-%m-%d'),))
    # Force all vaccinations next_due_date to next week for testing
    c.execute("UPDATE vaccinations SET next_due_date = ?", (next_week.strftime('%Y-%m-%d'),))
    conn.commit()
    conn.close()

    print("Triggering notifications sweep...")
    req = urllib.request.Request(
        f'{base_url}/notifications/trigger-due-reminders',
        method='POST',
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {token}'
        }
    )
    try:
        res = urllib.request.urlopen(req)
        print(f"Result: {json.loads(res.read())}")
    except Exception as e:
        print(f"Trigger error: {e}")
        if hasattr(e, 'read'):
            print(e.read().decode())

if __name__ == '__main__':
    test_notifications()
