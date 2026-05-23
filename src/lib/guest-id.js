export const getGuestId = () => {
  const KEY = "catetin-guest-id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    // crypto.randomUUID() works in all modern browsers
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
};
