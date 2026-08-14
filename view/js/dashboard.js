const logout = async () => {
  localStorage.clear();
  location.href = "/login";
};

window.onload = () => {
  showUserDetails();
};

const checkSession = async () => {
  const session = await getSession();
  if (!session) {
    location.href = "/login";
  }
};

checkSession();

const showUserDetails = async () => {
  const session = await getSession();

  const fullname = document.getElementById("fullname");
  const email = document.getElementById("email");
  fullname.innerHTML = session.fullname;
  email.innerHTML = session.email;
};
