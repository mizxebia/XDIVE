import uuid

users = []

def get_user_by_email(email: str):
    return next((user for user in users if user["email"] == email), None)

def add_user(name: str, email: str, password: str):
    user = {
        "id": str(uuid.uuid4()),
        "name": name,
        "email": email,
        "password": password
    }
    users.append(user)
    return user
