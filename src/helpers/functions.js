import momentJalaali from "jalali-moment";
import { orderStates, productsPropertiesTypes } from "./constants";

export const configReq = (token = false) => {
  if (token) {
    return {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
  } else {
    return {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
  }
};

export const snackMaker = (type, message) => {
  return {
    type,
    message,
  };
};

export const typeValueToObj = (type) => {
  const object = productsPropertiesTypes.filter((obj) => obj.value === type);
  return object[0];
};

export const ascPersianAlphabetSort = (rows, title) => {
  let copy = [...rows];
  copy.sort((a, b) => a[title].localeCompare(b[title]));
  return copy;
};

export const descPersianAlphabetSort = (rows, title) => {
  let copy = [...rows];
  copy.sort((a, b) => b[title].localeCompare(a[title]));
  return copy;
};

export const ascNumbersSort = (rows, title) => {
  let copy = [...rows];
  copy.sort((a, b) => parseInt(a[title]) - parseInt(b[title]));
  return copy;
};

export const descNumbersSort = (rows, title) => {
  let copy = [...rows];
  copy.sort((a, b) => parseInt(b[title]) - parseInt(a[title]));
  return copy;
};

export const searchHandler = (rows, keys = [], word) => {
  const notFilteredRows = [...rows];
  let afterFilterRows = keys.map((key) =>
    notFilteredRows.filter((row) =>
      String(row[key]).toLowerCase().includes(word.toLowerCase())
    )
  );
  return afterFilterRows;
};

export const IdToTitle = (id, data, searchKey, resultKey) => {
  if (id === null) {
    return "نامشخص";
  }
  let resultObj = [...data].find((d) => d[searchKey] === id);
  return resultObj ? resultObj[resultKey] : "نامشخص";
};

export const orderStateIdToString = (n) => {
  const orderState = orderStates.find((state) => state.key === n);
  return orderState.title || "نامشخص";
};

export const orderStateIdToObj = (n) => {
  return orderStates.find((state) => state.key === n) || null;
};

export const dateConvertor = (date) => {
  if (date) {
    return momentJalaali(date || "").format("jYYYY/jM/jD");
  } else {
    return "";
  }
};

const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/* for checking int number */
export function checkingNumber(e) {
  e.target.value = e.target.value
    .toString()
    .replace(/\d/g, (x) => farsiDigits[x])
    .replace(/[^"۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]/g, "");
}

/* for checking float  number */

export function checkingFloat(e) {
  e.target.value = e.target.value
    .toString()
    .replace(/\d/g, (x) => farsiDigits[x])
    .replace(/[^"۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹".]/g, "");
}

/* for checking noSpace  */

export function noSpace(e) {
  e.target.value = e.target.value.toString().replace(/\s+/g, "");
}
/* for translate numbers to persian */

export function persianToEnglish(str) {
  str = str.toString();
  const persDigit = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const enDigit = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  for (let i = 0; i < persDigit.length; i++) {
    str = str.replace(new RegExp(persDigit[i], "g"), enDigit[i]);
  }
  return str;
}
export function separate(Number) {
  Number += "";
  Number = Number.replace(",", "");
  let x = Number.split(".");
  let y = x[0];
  let z = x.length > 1 ? "." + x[1] : "";
  let rgx = /(\d+)(\d{3})/;
  while (rgx.test(y)) y = y.replace(rgx, "$1" + "," + "$2");
  return y + z;
}
export const toPersianNumber = (n) => {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  if (!n) return "";
  return n.toString().replace(/\d/g, (x) => farsiDigits[x]);
};
export function toIsoString(date) {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function (num) {
      return (num < 10 ? "0" : "") + num;
    };
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    "00" +
    ":" +
    "00" +
    ":" +
    "00"
  );
}
export function toIsoString2(date) {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function (num) {
      return (num < 10 ? "0" : "") + num;
    };
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    "23" +
    ":" +
    "59" +
    ":" +
    "59"
  );
}
export function toIsoString3(date, h, m) {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function (num) {
      return (num < 10 ? "0" : "") + num;
    };
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    h +
    ":" +
    m +
    ":" +
    "00"
  );
}
const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export const capitalizeKeysItems = (arr) => {
  return arr.map((item) => {
    const transformedItem = {};

    Object.keys(item).forEach((key) => {
      const capitalizedKey = capitalizeFirstLetter(key);
      transformedItem[capitalizedKey] = item[key];
    });

    return transformedItem;
  });
};
export function checkMeliCode(value) {
  if (!value) return false;
  var L = value.length;

  if (L < 8 || parseInt(value, 10) == 0) return false;
  value = ("0000" + value).substr(L + 4 - 10);
  if (parseInt(value.substr(3, 6), 10) == 0) return false;
  var c = parseInt(value.substr(9, 1), 10);
  var s = 0;
  for (var i = 0; i < 9; i++) s += parseInt(value.substr(i, 1), 10) * (10 - i);
  s = s % 11;
  return (s < 2 && c == s) || (s >= 2 && c == 11 - s);
}
export function checkPersian(value) {
  if (!value) return false;
  var p = /^[\u0600-\u06FF\s]+$/;
  if (!p.test(value)) {
    return false;
  }
  return true;
}
