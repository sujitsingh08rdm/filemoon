const logout = async () => {
  localStorage.clear();
  location.href = "/login";
};
