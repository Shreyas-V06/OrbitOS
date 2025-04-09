import firebase_admin#type: ignore
from firebase_admin import credentials,firestore #type: ignore

_db = None

def initialize_firebase():
    global _db
    if _db is None:
        cred = credentials.Certificate(r"C:\Users\Shreyas\Desktop\OrbitOS\firebase_key.json")
        firebase_admin.initialize_app(cred)
        _db = firestore.client()
    return _db

