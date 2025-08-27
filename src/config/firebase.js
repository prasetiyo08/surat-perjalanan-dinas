// firebase.js - OPTIMIZED VERSION - Fixed Loading Issues
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { enableNetwork, disableNetwork } from "firebase/firestore";

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

// Initialize Cloud Firestore with optimized settings
export const db = getFirestore(app);

// Enable offline persistence for better performance
try {
  // This helps with caching and offline support
  if (typeof window !== 'undefined') {
    import('firebase/firestore').then(({ enableIndexedDbPersistence }) => {
      enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
          console.warn('The current browser does not support persistence.');
        }
      });
    });
  }
} catch (error) {
  console.warn('Offline persistence not available:', error);
}

// Export default app
export default app;

// OPTIMIZED Firestore helper with improved error handling and faster loading
export const firestore = {
  // Add document with proper error handling
  addDocument: async (collection, data, maxRetries = 2) => {
    const { collection: getCollection, addDoc, serverTimestamp } = await import("firebase/firestore");
    
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        const collectionRef = getCollection(db, collection);
        const docRef = await addDoc(collectionRef, {
          ...data,
          createdAt: serverTimestamp(), // Use server timestamp for consistency
          updatedAt: serverTimestamp(),
        });
        return docRef;
      } catch (error) {
        attempt++;
        console.error(`Add attempt ${attempt} failed:`, error);
        
        if (attempt >= maxRetries) {
          throw new Error(`Failed to save after ${maxRetries} attempts: ${error.message}`);
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
      }
    }
  },

  // OPTIMIZED: Get documents with better caching and faster loading
  getDocuments: async (collectionName, useCache = false) => {
    const { 
      collection, 
      getDocs, 
      getDocsFromCache,
      getDocsFromServer,
      query,
      orderBy,
      limit
    } = await import("firebase/firestore");
    
    try {
      const collectionRef = collection(db, collectionName);
      
      // Add query optimization - limit initial load and order by creation date
      const optimizedQuery = query(
        collectionRef,
        orderBy('createdAt', 'desc'),
        limit(50) // Limit to 50 most recent documents for faster loading
      );
      
      // If cache is requested and available, try cache first
      if (useCache) {
        try {
          const cachedSnapshot = await getDocsFromCache(optimizedQuery);
          if (!cachedSnapshot.empty) {
            console.log("✅ Data loaded from cache");
            return cachedSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
          }
        } catch (cacheError) {
          console.log("ℹ️ Cache miss, fetching from server");
        }
      }
      
      // Fetch from server with timeout
      console.log("🌐 Fetching from server...");
      const startTime = Date.now();
      
      const querySnapshot = await Promise.race([
        getDocs(optimizedQuery),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout after 8 seconds')), 8000)
        )
      ]);
      
      const loadTime = Date.now() - startTime;
      console.log(`✅ Server data loaded in ${loadTime}ms`);
      
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      return results;
      
    } catch (error) {
      console.error("❌ Error fetching documents:", error);
      
      // Enhanced error messages
      if (error.code === 'unavailable') {
        throw new Error('Server tidak tersedia. Periksa koneksi internet.');
      } else if (error.code === 'permission-denied') {
        throw new Error('Tidak memiliki izin akses data.');
      } else if (error.message.includes('timeout')) {
        throw new Error('Koneksi timeout. Server lambat merespon.');
      } else if (error.code === 'failed-precondition') {
        throw new Error('Konfigurasi database bermasalah.');
      } else {
        throw new Error(`Gagal memuat data: ${error.message}`);
      }
    }
  },

  // Update document with retry
  updateDocument: async (collectionName, docId, data) => {
    const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore");
    
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw new Error(`Gagal update: ${error.message}`);
    }
  },

  // Delete document with error handling
  deleteDocument: async (collectionName, docId) => {
    const { doc, deleteDoc } = await import("firebase/firestore");
    
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error) {
      if (error.code === 'permission-denied') {
        throw new Error('Tidak memiliki izin untuk menghapus data');
      } else {
        throw new Error(`Gagal menghapus: ${error.message}`);
      }
    }
  },

  // Check network connectivity
  checkConnection: async () => {
    try {
      await enableNetwork(db);
      return true;
    } catch (error) {
      console.error('Network check failed:', error);
      return false;
    }
  },

  // Force refresh connection
  refreshConnection: async () => {
    try {
      await disableNetwork(db);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await enableNetwork(db);
      console.log('✅ Network connection refreshed');
    } catch (error) {
      console.error('❌ Failed to refresh connection:', error);
      throw error;
    }
  }
};