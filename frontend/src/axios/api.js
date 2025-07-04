import axios from "axios"

const api = axios.create({
  baseURL: 'http://150.150.150.108:3000'
});

export default api