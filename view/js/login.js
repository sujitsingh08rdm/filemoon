let toast = new Notyf({ position: { x: "right", y: "top" } });

const checkSession = async () => {
  const session = await getSession();
  if (session) {
    location.href = "app/dashboard.html";
  }
};

checkSession();

const login = async (e) => {
  try {
    e.preventDefault();
    const form = e.target;
    const payload = {
      email: form.elements.email.value,
      password: form.elements.password.value,
    };

    const response = await axios.post("http://localhost:8080/login", payload);
    toast.success(response.data.message);
    setTimeout(() => {
      toast.success("Redirecting to Homepage...");
    }, 1000);
    form.reset();
    localStorage.setItem("authToken", response.data.token);

    setTimeout(() => {
      location.href = "./app/dashboard.html";
    }, 3000);
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);
  }
};
