import Cookies from "js-cookie";
import axiosInstance from "../services/axios";

export const setSession = (accessToken, refreshToken = null) => {
  if (accessToken) {
    Cookies.set("accessToken", accessToken, { path: "/", secure: true, sameSite: "Strict" });
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  } else {
    Cookies.remove("accessToken", { path: "/" });
    delete axiosInstance.defaults.headers.common["Authorization"];
  }

  if (refreshToken) {
    Cookies.set("refreshToken", refreshToken, { path: "/", secure: true, sameSite: "Strict" });
  }
};

export const resetSession = () => {
  Cookies.remove("accessToken", { path: "/" });
  Cookies.remove("refreshToken", { path: "/" });
  delete axiosInstance.defaults.headers.common["Authorization"];
};
