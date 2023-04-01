var user = JSON.parse(localStorage.getItem("user"));
var token = localStorage.getItem("token");
var defaultStation = JSON.parse(localStorage.getItem("defaultStation"));

export function getLocalStorageData() {
  user = JSON.parse(localStorage.getItem("user"));
  token = localStorage.getItem("token");
  defaultStation = JSON.parse(localStorage.getItem("defaultStation"));
}

export { user, token, defaultStation };
