const storage = {
  getUser: () => JSON.parse(localStorage.getItem("user")),
  getToken: () => localStorage.getItem("token"),
  setUser: (user) => localStorage.setItem("user", JSON.stringify(user)),
  setToken: (token) => localStorage.setItem("token", token),
  clear: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },
};

export default storage;
