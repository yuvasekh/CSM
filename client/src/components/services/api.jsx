import axios from "axios";

const rootUrl="http://172.17.10.78:4000"
export async function fileUpload(file, id) {
    const formData = new FormData();
    formData.append("inputFIle", file);
    console.log(formData)
    return await axios.post(
      `${rootUrl}/api/uploadFile`,
      formData
    );
  }
  export async function lipsync(content) {

    console.log(content)
    return await axios.post(
      "http://localhost:4000/lipsync",
      content
    );
  }