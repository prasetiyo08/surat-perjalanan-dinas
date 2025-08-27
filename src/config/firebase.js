// firebase.js - UPDATED VERSION
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBq3IzYwo3kJKyaV-FFmDmpEyMvOk_RYtA",
  authDomain: "surat-perjalanan-dinas-6844b.firebaseapp.com",
  projectId: "surat-perjalanan-dinas-6844b",
  storageBucket: "surat-perjalanan-dinas-6844b.firebasestorage.app",
  messagingSenderId: "62050725573",
  appId: "1:620507255473:web:d88155ae80836824488890",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with session persistence
export const auth = getAuth(app);

// Set session persistence - user will be logged out when browser tab/window closes
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

// Enhanced Firestore helper dengan error handling yang lebih baik
export const firestore = {
  // Add dokumen dengan retry mechanism
  addDocument: async (collection, data, maxRetries = 3) => {
    const { collection: getCollection, addDoc } = await import("firebase/firestore");
    
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        const collectionRef = getCollection(db, collection);
        const docRef = await addDoc(collectionRef, {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return docRef;
      } catch (error) {
        attempt++;
        if (attempt >= maxRetries) {
          throw error;
        }
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  },

  // Get documents dengan timeout dan caching
  getDocuments: async (collectionName, useCache = true) => {
    const { collection, getDocs, getDocsFromCache } = await import("firebase/firestore");
    
    try {
      // Try to get from cache first if enabled
      if (useCache) {
        try {
          const cachedSnapshot = await getDocsFromCache(collection(db, collectionName));
          if (!cachedSnapshot.empty) {
            console.log("Data loaded from cache");
            return cachedSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
          }
        } catch (cacheError) {
          console.log("Cache miss, fetching from server");
        }
      }
      
      // Fetch from server with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const queryPromise = getDocs(collection(db, collectionName));
      const querySnapshot = await Promise.race([queryPromise, timeoutPromise]);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching documents:", error);
      throw new Error(`Gagal memuat data: ${error.message}`);
    }
  },

  // Update dokumen
  updateDocument: async (collectionName, docId, data) => {
    const { doc, updateDoc } = await import("firebase/firestore");
    const docRef = doc(db, collectionName, docId);
    return updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
  },

  // Hapus dokumen
  deleteDocument: async (collectionName, docId) => {
    const { doc, deleteDoc } = await import("firebase/firestore");
    const docRef = doc(db, collectionName, docId);
    return deleteDoc(docRef);
  },
};