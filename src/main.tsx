import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);

// ثبت Service Worker برای PWA و Caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[SW] Service Worker registered:', registration.scope);
        
        // بررسی به‌روزرسانی‌ها
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[SW] New content available; please refresh.');
              }
            });
          }
        });
      })
      .catch((error) => {
        console.log('[SW] Service Worker registration failed:', error);
      });
  });
}

// بهینه‌سازی Core Web Vitals
// گزارش دستی Web Vitals
if ('PerformanceObserver' in window) {
  // Largest Contentful Paint (LCP)
  try {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('[Web Vitals] LCP:', lastEntry.startTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {}

  // Cumulative Layout Shift (CLS)
  try {
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          console.log('[Web Vitals] CLS:', clsValue);
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  } catch (e) {}

  // First Input Delay (FID)
  try {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const firstInput = entries[0] as any;
      console.log('[Web Vitals] FID:', firstInput.processingStart - firstInput.startTime);
    }).observe({ type: 'first-input', buffered: true });
  } catch (e) {}
}
