import imageCompression from "browser-image-compression";
import dayjs from "dayjs";

export const chargeConvert = (charge) =>
  charge ? charge.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";

export const periodConvert = (item) =>
  item.period_type === 1 ? item.period + "일" : item.period + "개월";

export const depositConvert = (deposit) =>
  deposit ? deposit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";

export const specialSymbolReg =
  // eslint-disable-next-line
  /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;

export const lockerListResultFormat = (list) => {
  return list.map((item) => ({
    ...item,
    charge: chargeConvert(item.charge),
    period: periodConvert(item),
    deposit: depositConvert(item.deposit),
    key: item.idx,
  }));
};

export const numberToLocaleString = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const numberValueGetter = (value, format) => {
  if (value === 0 || value === "0") {
    return numberToLocaleString("0") + format;
  }
  return value ? numberToLocaleString(value) + format : "-";
};

export const getByteLength = (s, b, i, c) => {
  // c >> 11 ? 3 : c >> 7 ? 2 : 1; // unicode
  // c == 10 ? 2 : c >> 7 ? 2 : 1; // euc-kr  (개행: \n\r)
  // c >> 7 ? 2 : 1; // euc-kr  (개행: \n)
  // 현재 위의 euc-kr 구하는 로직은 한글, 영어, 일부 특문 외에는 고려하고 있지 않음 (그래서 ==), 그리고 알리고는 euc-kr
  for (b = i = 0; (c = s.charCodeAt(i++)); b += c >> 7 ? 2 : 1);
  return b;
};

export const actionImgCompress = async (fileSrc) => {
  const options = {
    maxSizeMB: 0.9,
    maxWidthOrHeight: 640,
    useWebWorker: true,
    fileType: "image/jpeg",
  };
  try {
    const compressedFile = await imageCompression(fileSrc, options);
    return compressedFile;
  } catch (e) {
    console.log(e);
  }
};

export const encodeFileName = (file) => {
  if (!file) return;
  return new File([file], encodeURIComponent(file.name), {
    type: file.type,
  });
};

export const filenameEllipsis = (str) => {
  const extension = str.split(".").pop();
  const ellipsis =
    str
      .split(".")
      .filter((t) => t !== extension)
      .join("")
      .slice(0, 15) + "...";
  return ellipsis + "." + extension;
};

export const numberHyphenDivider = (e, divide1 = 4, divide2 = 8) => {
  let tmp = "";
  if (e.length < divide1) {
    return e;
  } else if (e.length < divide2) {
    tmp += e.substr(0, divide1 - 1);
    tmp += "-";
    tmp += e.substr(divide1 - 1);
    return tmp;
  } else {
    tmp += e.substr(0, divide1 - 1);
    tmp += "-";
    tmp += e.substr(divide1 - 1, divide2 - divide1);
    tmp += "-";
    tmp += e.substr(divide2 - 1);
    return tmp;
  }
};

export const checkDisabledDate = ({ current, range_list = [] }) => {
  let isNotOk = false;
  if (range_list.length === 0) {
    return isNotOk;
  }
  const date = dayjs(current.date);
  for (let { idx, start_date, end_date } of range_list) {
    if (current.idx && idx === current.idx) {
      continue;
    }
    if (
      date.isAfter(start_date) &&
      date.isBefore(dayjs(end_date).add(1, "day"))
    ) {
      isNotOk = true;
      break;
    }
  }
  return isNotOk;

  // let diabled_list = [];
  // range_list.map(([start_date, end_date]) => {
  //   const date = dayjs(start_date);
  //   const range = Math.abs(date.diff(end_date, "day"));
  //   for (let i = 0; i <= range; i++) {
  //     const disabled_date = date.add(i, "day").format("YYYY-MM-DD");
  //     diabled_list.push(disabled_date);
  //   }
  // });
  // diabled_list = [...new Set(diabled_list)];
  // return diabled_list;
};

export const download = ({ file, url }) => {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.download = file ? file?.name : url;
  a.href = url;
  a.target = "_blank";
  a.click();
  document.body.removeChild(a);
};
