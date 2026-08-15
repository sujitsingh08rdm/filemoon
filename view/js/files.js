axios.defaults.baseURL = SERVER;
let toast = new Notyf({ position: { x: "right", y: "top" } });

window.onload = () => {
  fetchImage();
  fetchFiles();
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

const toggleDrawer = () => {
  const drawer = document.getElementById("drawer");
  const rightValue = drawer.style.right;

  if (rightValue === "0px") {
    drawer.style.right = "-33.33%";
  } else {
    drawer.style.right = "0px";
  }
};

const logout = async () => {
  localStorage.clear();
  location.href = "/login";
};

const uploadFile = async (e) => {
  e.preventDefault();
  try {
    const form = e.target;
    const formdata = new FormData(form);
    const progress = document.getElementById("progress");
    const uploadButton = document.getElementById("upload-btn");
    const options = {
      onUploadProgress: (e) => {
        const loaded = e.loaded;
        const total = e.total;
        const percentage = Math.floor((100 * loaded) / total);
        progress.style.width = percentage + "%";
        progress.innerHTML = percentage;
      },
      ...getToken(),
    };
    uploadButton.disabled = true;
    await axios.post("/api/file", formdata, options);
    toast.success("File Uploaded..");
    uploadButton.disabled = false;
    fetchFiles();
    progress.innerHTML = "";
    progress.style.width = 0;
    form.reset();
    setTimeout(() => {
      toggleDrawer();
    }, 300);
  } catch (err) {
    console.log(err.message);
    toast.error(err.response ? err.response.data.message : err.message);
  }
};

const formatSize = (size) => {
  const mb = size / 1000 / 1000;
  return mb.toFixed(2);
};

const fetchFiles = async () => {
  try {
    const { data } = await axios.get("/api/file", getToken());
    const table = document.getElementById("file-table");
    table.innerHTML = "";
    for (let file of data) {
      const ui = `
        <tr class="text-gray-600 border-b border-gray-200">
        <td class="py-2.5 pl-4">${file.filename}</td>
        <td>${file.type}</td>
        <td>${formatSize(file.size)}Mb</td>
        <td>${moment(file.createdAt).format("DD MMM YYYY hh:mm A")}</td>
        <td>
          <div class="space-x-2">
            <button
              class="bg-rose-400 text-white px-2 py-1 hover:bg-rose-600 rounded"
              onclick="deleteFile('${file._id}')"
              >
              <i class="ri-delete-bin-4-fill"></i>
            </button>
            <button
              class="bg-green-400 text-white px-2 py-1 hover:bg-green-600 rounded"
              onclick="downloadFile('${file._id}', '${file.filename}')"
              >
              <i class="ri-download-fill"></i>
            </button>
            <button
              class="bg-amber-400 text-white px-2 py-1 hover:bg-amber-600 rounded"
            >
              <i class="ri-share-fill" onclick="openModelForShare('${file._id}', '${file.filename}')"></i>
            </button>
          </div>
        </td>
      </tr>
      `;
      table.innerHTML += ui;
    }
  } catch (err) {
    console.log(err.message);
    toast.error(err.response ? err.response.data.message : err.message);
  }
};

const deleteFile = async (id) => {
  try {
    await axios.delete(`/api/file/${id}`, getToken());
    toast.success("file deleted !");
    fetchFiles();
  } catch (err) {
    console.log(err.message);
    toast.error(err.response ? err.response.data.message : err.message);
  }
};

const downloadFile = async (id, filename) => {
  try {
    const options = { responseType: "blob", ...getToken() };
    const { data } = await axios.get(`/api/file/download/${id}`, options);
    const ext = data.type.split("/").pop();
    const url = URL.createObjectURL(data);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.${ext}`;
    a.click();
    a.remove();
  } catch (err) {
    console.log(err.message);
    toast.error(err.response ? err.response.data.message : err.message);
  }
};

const openModelForShare = (id, filename) => {
  new Swal({
    showConfirmButton: false,
    html: `
    <form class="flex gap-4 flex-col text-left" onsubmit="shareFile('${id}', event)" >
      <h2 class="font-bold  text-2xl " >Email Id</h2>
      <input type="email" required class="border border-red-300 w-full p-3 rounded" placeholder="mail@gmail.com" name="email" />
      <button id="send-button" class="bg-indigo-400 hover:bg-indigo-600 text-white rounded py-2 px-4 w-fit font-medium" >Send</button>
      <div class="flex items-center gap-2">
        <p class="text-gray-500" >You are sharing - </p>
        <p class="text-green-400 font-medium">${filename}</p>
      </div>
      </form>
    `,
  });
};

const shareFile = async (id, e) => {
  const sendButton = document.getElementById("send-button");
  const form = e.target;
  try {
    e.preventDefault();
    sendButton.disabled = true;
    sendButton.innerHTML = `<i class="ri-loader-4-line animate-spin"></i> Sending...`;

    const email = form.elements.email.value.trim();
    const payload = { email: email, fileId: id };

    await axios.post("/api/share", payload, getToken());
    toast.success("File Shared Successfully...");
  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message);
  } finally {
    Swal.close();
    sendButton.disabled = false;
    sendButton.innerHTML = "Send";
    form.reset();
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
