// firebase.js - UPDATED VERSION with New Configuration
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  query,
  orderBy,
  limit
} from "firebase/firestore";

// UPDATED: New Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAx56fJn6T--88-9Jf0SM08Fe-1NNIRWko",
  authDomain: "surat-perjalanan-dinas-6e7aa.firebaseapp.com",
  projectId: "surat-perjalanan-dinas-6e7aa",
  storageBucket: "surat-perjalanan-dinas-6e7aa.firebasestorage.app",
  messagingSenderId: "4233757078",
  appId: "1:4233757078:web:83c8fdd391b3d7ad589fb7",
  measurementId: "G-PF4K0YCPKF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Set session persistence
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("Auth persistence set to session only");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Export default app
export default app;

// Firestore helper functions (unchanged)
export const firestore = {
  // Add document with better error handling
  addDocument: async (collectionName, data, maxRetries = 2) => {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        console.log(`Adding document to ${collectionName}, attempt ${attempt + 1}`);
        
        const collectionRef = collection(db, collectionName);
        const docRef = await addDoc(collectionRef, {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        
        console.log("Document added successfully with ID:", docRef.id);
        return docRef;
        
      } catch (error) {
        attempt++;
        console.error(`Add attempt ${attempt} failed:`, error);
        
        // Log specific error details
        if (error.code) {
          console.error("Error code:", error.code);
          console.error("Error message:", error.message);
        }
        
        if (attempt >= maxRetries) {
          // Return more specific error messages
          if (error.code === 'permission-denied') {
            throw new Error(`Akses ditolak. Pastikan user sudah login dan memiliki permission yang tepat.`);
          } else if (error.code === 'unavailable') {
            throw new Error(`Server Firestore tidak tersedia. Coba lagi dalam beberapa saat.`);
          } else if (error.code === 'network-request-failed') {
            throw new Error(`Gagal terhubung ke server. Periksa koneksi internet.`);
          } else {
            throw new Error(`Failed to save after ${maxRetries} attempts: ${error.message}`);
          }
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
      }
    }
  },

  // Get documents with better error handling
  getDocuments: async (collectionName, useCache = false) => {
    try {
      console.log(`Fetching documents from ${collectionName}`);
      
      const collectionRef = collection(db, collectionName);
      const optimizedQuery = query(
        collectionRef,
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      
      const querySnapshot = await getDocs(optimizedQuery);
      
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      console.log(`Successfully fetched ${results.length} documents`);
      return results;
      
    } catch (error) {
      console.error("Error fetching documents:", error);
      
      if (error.code === 'permission-denied') {
        throw new Error('Tidak memiliki izin akses data. Pastikan sudah login.');
      } else if (error.code === 'unavailable') {
        throw new Error('Server tidak tersedia. Periksa koneksi internet.');
      } else {
        throw new Error(`Gagal memuat data: ${error.message}`);
      }
    }
  },

  // Update document
  updateDocument: async (collectionName, docId, data) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      console.log("Document updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      throw new Error(`Gagal update: ${error.message}`);
    }
  },

  // Delete document
  deleteDocument: async (collectionName, docId) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      console.log("Document deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      if (error.code === 'permission-denied') {
        throw new Error('Tidak memiliki izin untuk menghapus data');
      } else {
        throw new Error(`Gagal menghapus: ${error.message}`);
      }
    }
  },

  // Test connection to Firestore
  testConnection: async () => {
    try {
      const testCollection = collection(db, 'test');
      const testQuery = query(testCollection, limit(1));
      await getDocs(testQuery);
      console.log("Firestore connection test successful");
      return true;
    } catch (error) {
      console.error("Firestore connection test failed:", error);
      return false;
    }
  }
};