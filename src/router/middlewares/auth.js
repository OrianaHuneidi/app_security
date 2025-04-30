import { useUserStore } from "stores/users";

export const isLogin = async (_to, _from, next) => {
  const storeUser = useUserStore();
  const isSession = await storeUser.getVerifySession();

  try {
    if (isSession) next();
    else next({ name: "login" });
  } catch (err) {
    next({ name: "login" });
  }
};

export const isLogout = async (_to, _from, next) => {
  const storeUser = useUserStore();
  const isSession = await storeUser.getVerifySession();
  try {
    if (isSession) next({ name: "panel" });
    else next();
  } catch (err) {
    next();
  }
};
