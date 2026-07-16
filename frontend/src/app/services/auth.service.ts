import api from "../libs/api";

export const syncUser = async () => {
  const res = await api.get("/auth/sync");
  return res.data;
};
