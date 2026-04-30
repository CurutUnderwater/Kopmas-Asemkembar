/* ============================================
   KOPMAS ASEM KEMBAR — Firebase Sync Layer
   Syncs localStorage data across devices
   via Firebase Realtime Database.
   ============================================ */

const FirebaseSync = {
  db: null,
  isInitialized: false,
  _syncing: false,  // prevents infinite loops

  // Only sync shared data — cart & login stay local per-device
  syncKeys: [
    'kopmas_products',
    'kopmas_orders',
    'kopmas_agenda',
    'kopmas_finance',
    'kopmas_admin',
    'kopmas_settings'
  ],

  /**
   * Initialize Firebase and start syncing.
   * Called automatically if FIREBASE_CONFIG is defined.
   */
  init(config) {
    try {
      if (!config || !config.databaseURL) {
        console.log('[FirebaseSync] No config — running in offline/localStorage mode.');
        return;
      }

      // Prevent double-init
      if (firebase.apps && firebase.apps.length > 0) {
        console.log('[FirebaseSync] Already initialized.');
        this.db = firebase.database();
        this.isInitialized = true;
        this._loadAndListen();
        return;
      }

      firebase.initializeApp(config);
      this.db = firebase.database();
      this.isInitialized = true;
      console.log('[FirebaseSync] ✅ Connected to Firebase.');

      this._loadAndListen();
    } catch (err) {
      console.error('[FirebaseSync] Init error:', err);
    }
  },

  /**
   * On first load: if Firebase has data → pull into localStorage.
   * If Firebase is empty → push seed data up.
   * Then start real-time listeners.
   */
  async _loadAndListen() {
    try {
      const snapshot = await this.db.ref('kopmas').get();

      if (snapshot.exists()) {
        // Firebase has data → pull into localStorage
        const fbData = snapshot.val();
        this._syncing = true;
        for (const key of this.syncKeys) {
          if (fbData[key] !== undefined && fbData[key] !== null) {
            localStorage.setItem(key, JSON.stringify(fbData[key]));
          }
        }
        this._syncing = false;
        console.log('[FirebaseSync] ✅ Pulled data from Firebase.');
        // Re-render current page with fresh data
        if (typeof router === 'function') router();
      } else {
        // Firebase is empty → push local seed data
        await this._pushAll();
        console.log('[FirebaseSync] ✅ Pushed seed data to Firebase.');
      }

      // Start real-time listeners
      this._setupListeners();
    } catch (err) {
      console.error('[FirebaseSync] Load error:', err);
    }
  },

  /**
   * Push all syncable data to Firebase.
   */
  async _pushAll() {
    const payload = {};
    for (const key of this.syncKeys) {
      const raw = localStorage.getItem(key);
      if (raw) {
        try { payload[key] = JSON.parse(raw); }
        catch { /* skip malformed */ }
      }
    }
    if (Object.keys(payload).length > 0) {
      await this.db.ref('kopmas').set(payload);
    }
  },

  /**
   * Listen for real-time changes from Firebase.
   * When another device writes, this fires and updates localStorage + UI.
   */
  _setupListeners() {
    for (const key of this.syncKeys) {
      this.db.ref('kopmas/' + key).on('value', (snapshot) => {
        if (this._syncing) return;

        const data = snapshot.val();
        if (data === null) return;

        // Compare with current localStorage to avoid unnecessary re-renders
        const current = localStorage.getItem(key);
        const incoming = JSON.stringify(data);
        if (current === incoming) return;

        this._syncing = true;
        localStorage.setItem(key, incoming);
        this._syncing = false;

        console.log('[FirebaseSync] 🔄 Updated from another device:', key);

        // Re-render page
        if (typeof router === 'function') router();
        // Update cart badge (products may have changed)
        window.dispatchEvent(new Event('cart-updated'));
      });
    }
  },

  /**
   * Write a key to Firebase (called from DataStore._set).
   */
  write(key, data) {
    if (!this.isInitialized || this._syncing) return;
    if (!this.syncKeys.includes(key)) return;

    this.db.ref('kopmas/' + key).set(data).catch(err => {
      console.error('[FirebaseSync] Write error:', key, err);
    });
  }
};
