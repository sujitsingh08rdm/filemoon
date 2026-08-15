axios.defaults.baseURL = SERVER;
let toast = new Notyf({ position: { x: "right", y: "top" } });

const logout = async () => {
  localStorage.clear();
  location.href = "/login";
};

window.onload = () => {
  showUserDetails();
  fetchFilesReport();
  fetchRecentFile();
  fetchRecentShared();
  fetchImage();
};

const getToken = () => {
  const options = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };

  return options;
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

const formatSize = (size) => {
  const mb = size / 1000 / 1000;
  return mb.toFixed(2);
};

const fetchRecentFile = async () => {
  try {
    const { data } = await axios.get("/api/file?limit=3", getToken());

    const recentFilesBox = document.getElementById("recent-files-box");
    for (let item of data) {
      const ui = `
        <div class="flex items-start justify-between">
          <div>
            <h2 class="font-medium text-zinc-600">${item.filename}</h2>
            <small class="text-sm text-zinc-500">${formatSize(item.size)} Mb</small>
          </div>
          <p class="text-md text-zinc-600">${moment(item.createdAt).format("DD MMM YYYY hh:mm A")}</p>
      </div>
        `;
      recentFilesBox.innerHTML += ui;
    }
  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message);
  }
};

const fetchRecentShared = async () => {
  try {
    const { data } = await axios.get("/api/share?limit=3", getToken());
    const recentSharedBox = document.getElementById("recent-shared-box");

    for (let item of data) {
      const ui = `
        <div class="flex items-start justify-between">
          <div>
            <h2 class="font-medium text-zinc-600">${item.file.filename}</h2>
            <small class="text-sm text-zinc-500">${item.receiverEmail}</small>
          </div>
          <p class="text-md text-zinc-600">${moment(item.file.createdAt).format("DD MMM YYYY hh:mm A")}</p>
      </div>
        `;
      recentSharedBox.innerHTML += ui;
    }
  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message);
  }
};

const fetchFilesReport = async () => {
  try {
    const { data } = await axios.get("/api/dashboard", getToken());
    const reportCard = document.getElementById("report-card");

    for (let item of data) {
      const ui = `

        <div
          class="overflow-hidden relative bg-white rounded-lg shadow hover:shadow-lg h-36 flex items-center justify-center flex flex-col"
        >
          <h2 class="text-2xl font-bold text-gray-600">${item._id.split("/")[0]}</h2>
          <p class="text-xl font-semibold text-gray-600">2560</p>
          <div
            class="flex justify-center items-center w-[100px] h-[100px] rounded-full absolute top-5 -left-6"
            style="
              background-image: linear-gradient(
                to top,
                #fbc2eb 0%,
                #a6c1ee 100%
              );
            "
          >
            <i class="ri-live-line text-4xl text-white"></i>
          </div>
        </div>
        `;

      reportCard.innerHTML += ui;
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
