import firebase_admin
from firebase_admin import credentials,firestore

def initialize_firestore():
    if not firebase_admin._apps:
        cred = credentials.Certificate(r"C:\Users\Shreyas\Desktop\OrbitOS\firebase_key.json")
        firebase_admin.initialize_app(cred)
    db = firestore.client()
    return db

