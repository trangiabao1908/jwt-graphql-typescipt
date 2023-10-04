import jwtDecode, { JwtPayload } from "jwt-decode";
import axios from "axios";
const authToken = () => {
  let tokenValue: string | null = null;
  let refreshTokenTimeoutId: number | null = null;
  let userId: number | null = null;

  const getToken = () => {
    return tokenValue;
  };
  const getUserId = () => {
    return userId;
  };
  const setToken = (token: string) => {
    tokenValue = token;
    const decoded = jwtDecode(tokenValue) as JwtPayload & {
      userId: number;
    };
    const { exp, iat } = decoded;
    userId = decoded.userId;
    sendReFreshToken((exp as number) - (iat as number));
    return true;
  };
  const cleareTimeoutRefreshToken = () => {
    if (refreshTokenTimeoutId) window.clearTimeout(refreshTokenTimeoutId);
  };

  const deleteToken = () => {
    tokenValue = null;
    cleareTimeoutRefreshToken();
    return true;
  };

  const getRefreshToken = async () => {
    try {
      const res = await axios(`http://localhost:4000/refresh_token`, {
        withCredentials: true,
      });
      if (res.data.success) {
        const data = res.data as {
          success: boolean;
          accessToken: string;
        };
        setToken(data.accessToken);
      }
      return true;
    } catch (err) {
      console.log(err);
      deleteToken();
      return false;
    }
  };
  const sendReFreshToken = (delay: number) => {
    refreshTokenTimeoutId = window.setTimeout(
      getRefreshToken,
      delay * 1000 - 5000
    );
  };
  return {
    getToken,
    setToken,
    getRefreshToken,
    sendReFreshToken,
    deleteToken,
    getUserId,
  };
};

export default authToken();
