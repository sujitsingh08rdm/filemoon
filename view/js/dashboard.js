const checkSession = async () => {
  const session = await getSession();
  if (!session) {
    location.href = "../index.html";
  }
};

checkSession();
