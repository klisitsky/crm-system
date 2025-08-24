import axios from "axios";

export const instance = axios.create({
  baseURL: "https://easydev.club/api/v1",
});
