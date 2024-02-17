import axios from "axios"
export async function loginService(data) {
    return await axios.post(`${import.meta.env.VITE_HUBBLE_BASE_URL}/v2/employee/login`, data);
  }
  