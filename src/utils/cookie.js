import Cookies from 'js-cookie';

const getCookie = (key) => {
  const val = Cookies.get(key);
  return val;
};

const setCookie = (key, val) => {
  Cookies.set(key, val, {
    expires: 365,
    // secure: true,
    // sameSite: 'none',
    // path: '/',
  });
};

const delCookie = (key) => {
  Cookies.remove(key);
};

export default {
  getCookie,
  setCookie,
  delCookie,
};
