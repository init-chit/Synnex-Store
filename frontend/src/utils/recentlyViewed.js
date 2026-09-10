// Recently Viewed Games - LocalStorage utility
const STORAGE_KEY = 'recently_viewed_games';
const MAX_ITEMS = 10;

export const addRecentlyViewed = (game) => {
  try {
    const viewed = getRecentlyViewed();
    // Remove if already exists
    const filtered = viewed.filter(g => g.game_id !== game.game_id);
    // Add to beginning
    const updated = [game, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save recently viewed', err);
  }
};

export const getRecentlyViewed = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to get recently viewed', err);
    return [];
  }
};

export const clearRecentlyViewed = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear recently viewed', err);
  }
};




