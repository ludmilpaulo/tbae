"use client";

import { useEffect } from "react";

export default function CacheClearer() {
  useEffect(() => {
    // Check if we've already cleared cache in this session
    const cacheClearedFlag = localStorage.getItem('tbae_cache_cleared');
    
    if (!cacheClearedFlag) {
      try {
        console.log('Clearing browser caches and storage...');
        
        // Clear localStorage (but keep our flag)
        const keysToKeep = ['tbae_cache_cleared'];
        const allKeys = Object.keys(localStorage);
        allKeys.forEach(key => {
          if (!keysToKeep.includes(key)) {
            localStorage.removeItem(key);
          }
        });
        
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
        
        // Set flag to prevent future clearing
        localStorage.setItem('tbae_cache_cleared', 'true');
        
        console.log('Cache and storage cleared successfully');
      } catch (error) {
        console.error('Error clearing cache:', error);
      }
    }
  }, []);

  return null; // This component doesn't render anything
}
