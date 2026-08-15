window.onload = () => {
  fetchImage();
  fetchHistory();
};

axios.defaults.baseURL = SERVER;
let toast = new Notyf({ position: { x: "right", y: "top" } });

const logout = async () => {
  localStorage.clear();
  location.href = "/login";
};

const checkSession = async () => {
  const session = await getSession();
  if (!session) {
    location.href = "/login";
  }
};

checkSession();

const getToken = () => {
  const options = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };

  return options;
};

const fetchHistory = async () => {
  try {
    const { data } = await axios.get("/api/share", getToken());
    const table = document.getElementById("table");
    const notFoundUi = `
      <div class="p-16 text-center" >
        <h2 class="text-gray-500 text-2xl" >Oops! you have not shared any file  yet!</h2>
      </div>
      `;

    if (data.length === 0) {
      table.innerHTML = notFoundUi;
      return;
    }

    for (let item of data) {
      const ui = `
        <tr class="text-gray-600 border-b border-gray-200">
          <td class="py-2.5 pl-4">${item.file.filename}</td>
          <td>${item.receiverEmail}</td>

          <td>${moment(item.createdAt).format("DD MMM YYYY, hh:mm A")}</td>
        </tr>
        `;
      table.innerHTML += ui;
    }
  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message);
  }
};

const uploadImage = () => {
  try {
    const input = document.createElement("input");
    const pic = document.getElementById("pic");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append("picture", file);
      await axios.post("/api/profile-pic", formData, getToken());

      const url = URL.createObjectURL(file);
      pic.src = url;
    };
  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message);
  }
};

const fetchImage = async () => {
  try {
    const options = {
      responseType: "blob",
      ...getToken(),
    };
    const { data } = await axios.get("/api/profile-pic", options);
    const url = URL.createObjectURL(data);
    const pic = document.getElementById("pic");
    pic.src = url;
  } catch (err) {
    if (!err.response) {
      return toast.error(err.message);
    }
    const error = await err.response.data.text();
    const { message } = JSON.parse(error);
    toast.error(message);
  }
};
