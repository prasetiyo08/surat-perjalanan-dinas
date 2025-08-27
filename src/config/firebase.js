// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Konfigurasi Firebase - menggunakan config Anda
const firebaseConfig = {
  apiKey: "AIzaSyBq3IzYwo3kJKyaV-FFmDmpEyMvOk_RYtA",
  authDomain: "surat-perjalanan-dinas-6844b.firebaseapp.com",
  projectId: "surat-perjalanan-dinas-6844b",
  storageBucket: "surat-perjalanan-dinas-6844b.firebasestorage.app",
  messagingSenderId: "62050725573",
  appId: "1:620507255473:web:d88155ae80836824488890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Export default app
export default app;

// Fungsi helper untuk Firestore (opsional)
export const firestore = {
  // Tambah dokumen baru
  addDocument: async (collection, data) => {
    const { collection: getCollection, addDoc } = await import('firebase/firestore');
    const collectionRef = getCollection(db, collection);
    return addDoc(collectionRef, {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },

  // Get semua dokumen dari collection
  getDocuments: async (collectionName) => {
    const { collection, getDocs } = await import('firebase/firestore');
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Update dokumen
  updateDocument: async (collectionName, docId, data) => {
    const { doc, updateDoc } = await import('firebase/firestore');
    const docRef = doc(db, collectionName, docId);
    return updateDoc(docRef, {
      ...data,
      updatedAt: new Date()
    });
  },

  // Hapus dokumen
  deleteDocument: async (collectionName, docId) => {
    const { doc, deleteDoc } = await import('firebase/firestore');
    const docRef = doc(db, collectionName, docId);
    return deleteDoc(docRef);
  }
};