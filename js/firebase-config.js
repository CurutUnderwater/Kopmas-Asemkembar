/* ============================================
   Firebase Configuration
   ============================================
   
   CARA SETUP:
   1. Buka https://console.firebase.google.com
   2. Klik "Create a project" / "Buat project"
   3. Beri nama project (misal: "kopmas-asem-kembar")
   4. Setelah project dibuat, klik ikon Web (</>) untuk menambah app
   5. Beri nama app (misal: "kopmas-web")
   6. Copy konfigurasi yang diberikan Firebase
   7. Ganti nilai FIREBASE_CONFIG di bawah dengan konfigurasi Anda
   8. Buka menu "Realtime Database" → "Create Database"
   9. Pilih lokasi terdekat (misal: Singapore)
   10. Pilih "Start in TEST MODE" agar bisa read/write
   11. Deploy ulang ke GitHub Pages
   
   ============================================ */

const FIREBASE_CONFIG = {
  // ======================================================
  // GANTI DENGAN KONFIGURASI FIREBASE ANDA:
  // ======================================================
  apiKey: "AIzaSyCcrdxILvl0rLQIOkcfvmSNhfwdU7YDrwg",
  authDomain: "kopmas-asem-kembar.firebaseapp.com",
  databaseURL: "https://kopmas-asem-kembar-default-rtdb.asia-southeast1.firebasedatabase.app", // ← ISI INI! Firebase Console → Realtime Database → copy URL di atas
  projectId: "kopmas-asem-kembar",
  storageBucket: "kopmas-asem-kembar.firebasestorage.app",
  messagingSenderId: "335932682830",
  appId: "1:335932682830:web:28295541909686f1bcc91f"
  // ======================================================
  // Contoh yang sudah diisi:
  // apiKey: "AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz",
  // authDomain: "kopmas-asem-kembar.firebaseapp.com",
  // databaseURL: "https://kopmas-asem-kembar-default-rtdb.asia-southeast1.firebasedatabase.app",
  // projectId: "kopmas-asem-kembar",
  // storageBucket: "kopmas-asem-kembar.appspot.com",
  // messagingSenderId: "123456789",
  // appId: "1:123456789:web:abcdef123456"
  // ======================================================
};
