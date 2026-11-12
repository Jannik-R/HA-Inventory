const LAST_LOCATION = "home_inventory.last_location";
/** The last booked-in location, remembered on this device (storage may be blocked: then none). */
export const lastLocation = (): number | null => {
  try {
    return Number(localStorage.getItem(LAST_LOCATION)) || null;
  } catch {
    return null;
  }
};
export const rememberLocation = (id: number) => {
  try {
    localStorage.setItem(LAST_LOCATION, String(id));
  } catch {
    // blocked storage: the location is simply not remembered
  }
};
