// ============================================================
// VortexGaming Save Engine v1.0
// Drop this script on every game page in Google Sites
// ============================================================

const VortexSave = {

  // --- Keys used in localStorage ---
  KEYS: {
    lastPlayed:  'vortex_lastPlayed',
    history:     'vortex_history',
    savePrefix:  'vortex_save_',
  },

  // --- Save metadata when a game is launched ---
  // Call this when the player clicks "Play" or the page loads
  trackLaunch(gameId, gameName, thumbnailUrl = '') {
    const entry = {
      id:        gameId,
      name:      gameName,
      thumb:     thumbnailUrl,
      lastPlayed: Date.now(),
      playCount: (this.getHistory().find(g => g.id === gameId)?.playCount || 0) + 1,
    };

    // Save as "last played"
    localStorage.setItem(this.KEYS.lastPlayed, JSON.stringify(entry));

    // Add to history (keep last 10, newest first, no duplicates)
    let history = this.getHistory().filter(g => g.id !== gameId);
    history.unshift(entry);
    history = history.slice(0, 10);
    localStorage.setItem(this.KEYS.history, JSON.stringify(history));

    console.log(`[VortexSave] Tracked launch: ${gameName}`);
  },

  // --- Save actual game progress (for games you control) ---
  saveProgress(gameId, data) {
    const save = {
      gameId,
      savedAt: Date.now(),
      data,          // e.g. { score: 1200, level: 4, lives: 3 }
    };
    localStorage.setItem(this.KEYS.savePrefix + gameId, JSON.stringify(save));
    console.log(`[VortexSave] Progress saved for: ${gameId}`);
  },

  // --- Load game progress ---
  loadProgress(gameId) {
    const raw = localStorage.getItem(this.KEYS.savePrefix + gameId);
    return raw ? JSON.parse(raw) : null;
  },

  // --- Get last played game ---
  getLastPlayed() {
    const raw = localStorage.getItem(this.KEYS.lastPlayed);
    return raw ? JSON.parse(raw) : null;
  },

  // --- Get full play history ---
  getHistory() {
    const raw = localStorage.getItem(this.KEYS.history);
    return raw ? JSON.parse(raw) : [];
  },

  // --- Delete a save (let player reset) ---
  deleteSave(gameId) {
    localStorage.removeItem(this.KEYS.savePrefix + gameId);
  },

  // --- Format a timestamp nicely ---
  timeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60)   return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  },
};