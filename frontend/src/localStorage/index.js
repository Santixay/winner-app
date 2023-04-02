export const user = () => JSON.parse(localStorage.getItem("user"));
export const token = () => localStorage.getItem("token");
export const defaultStation = () => JSON.parse(localStorage.getItem("defaultStation"));

// export { user, token, defaultStation };
