const getSession = async () => {
  try {
    const session = localStorage.getItem("authToken");

    if (!session) {
      return null;
    }

    const payload = {
      token: session,
    };

    const { data } = await axios.post(
      "http://localhost:8080/token/verify",
      payload,
    );
    return data;
  } catch (error) {
    return null;
  }
};

const logout = async () => {
  localStorage.clear();
  location.href = "../index.html";
};

// getSession();
