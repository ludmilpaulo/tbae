"use client";

import { useEffect } from "react";

export default function CacheClearer() {
  useEffect(() => {
    // Clear browser cache and storage on app load/refresh
    const clearCacheAndStorage = () => {
      try {
        // Clear localStorage
        localStorage.clear();
        
        // Clear sessionStorage
        sessionStorage.clear();
        
        // Clear IndexedDB (if any)
        if ('indexedDB' in window) {
          indexedDB.databases?.().then(databases => {
            databases.forEach(db => {
              if (db.name) {
                indexedDB.deleteDatabase(db.name);
              }
            });
          }).catch(console.error);
        }
        
        // Clear service worker cache
        if ('serviceWorker' in navigator && 'caches' in window) {
          caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
              caches.delete(cacheName);
            });
          }).catch(console.error);
        }
        
        // Clear RTK Query cache by dispatching reset action
        if (typeof window !== 'undefined') {
          // Force reload to clear all caches
          window.location.reload();
        }
        
        console.log('Cache and storage cleared successfully');
      } catch (error) {
        console.error('Error clearing cache:', error);
      }
    };

    // Only clear cache on first load or if explicitly requested
    const shouldClearCache = sessionStorage.getItem('cacheCleared') !== 'true';
    
    if (shouldClearCache) {
      sessionStorage.setItem('cacheCleared', 'true');
      clearCacheAndStorage();
    }
  }, []);

  return null; // This component doesn't render anything
}
