axios.defaults.baseURL = SERVER;

let toast = new Notyf({ position: { x: "right", y: "top" } });

const checkSession = async () => {
  const session = await getSession();
  if (session) {
    location.href = "/dashboard";
  }
};

checkSession();

const signup = async (e) => {
  try {
    e.preventDefault();
    const form = e.target;

    const elements = form.elements;

    const payload = {
      fullname: elements.fullname.value,
      email: elements.email.value,
      password: elements.password.value,
      mobile: elements.mobile.value,
    };

    const response = await axios.post("/api/signup", payload);

    form.reset();
    toast.success(response.data.message);

    setTimeout(() => {
      toast.success("Redirecting to Login Page...");
    }, 1000);

    setTimeout(() => {
      location.href = "/login";
    }, 2000);
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);
  }
};
