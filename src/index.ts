import wordsArray from "./wordsArray";
import whiteList from "./whiteList";
import * as OpenCC from "opencc-js";

interface CensorCheckResult {
  result: boolean;
  list: string[];
}

const preConversionCheckList = [
  "+1s",
  "5\xb11",
  "\ud83d\udc3b",
  "\ud83d\udc38",
  "\ud83c\udf3e",
  "\u5927\ud83d\udc30",
  "\u5927\ud83d\udc07",
  "\ud83d\udc53",
  "\ud83d\udc69\u200d\ud83c\udf3e",
  "\ud83d\udc68\u200d\ud83c\udf3e",
];

const taboo = {
  x: "\u4e60\u5915\u516e\u620f\u5438\u6c50\u897f\u5e0c\u7cfb\u7ec6\u6790\u6614\u77fd\u831c\u6d17\u90d7\u6816\u5e2d\u606f\u727a\u73ba\u595a\u550f\u7852\u6dc5\u5f99\u88ad\u665e\u89cb\u6878\u60dc\u70ef\u7fd5\u559c\u5092\u9699\u6670\u6673\u7280\u7a00\u774e\u7699\u9521\u798a\u5ab3\u5d60\u5faf\u7155\u6eaa\u7184\u8725\u50d6\u5c63\u7199\u5b09\u563b\u6b59\u7fb2\u71b9\u7ab8\u8785\u87cb\u6a84\u8e4a\u66e6\u56cd",
  j: "\u8fd1\u8fdb\u5c3d\u4ec5\u7981\u65a4\u91d1\u664b\u6d78\u52b2\u4eca\u7d27\u70ec\u9526\u7b4b\u77dc\u5dfe\u895f\u747e\u69ff\u8c28\u50c5\u5807\u7f19\u89d0\u9888\u5f84\u7ecf\u955c\u830e\u60ca\u775b\u7adf\u4eac\u9759\u666f\u4e95\u7cbe\u656c\u51c0\u6676\u8b66\u5883\u9756\u8346\u7ade\u5a67\u83c1\u9cb8\u65cc\u8ff3\u749f\u5162\u6cfe\u9631\u61ac\u75c9\u7cb3\u66bb\u5106",
  p: "\u74f6\u8bc4\u5e73\u5c4f\u840d\u82f9\u576a\u546f\u4e52\u546f\u51ed\u6cd9\u8d2b\u54c1\u62fc\u8058\u9891\u5ad4\u98a6\u59d8\u725d",
};

const tabooRegStr = Object.fromEntries(
  Object.entries(taboo).map(([key, value]) => [
    key,
    "(?:" + value.split("").join("|") + ")",
  ])
);

const tabooRegExp = new RegExp(
  [
    tabooRegStr.x + tabooRegStr.j,
    tabooRegStr.j + tabooRegStr.p,
    "(?:\u5201|\u53fc)" + tabooRegStr.j,
    "\u8fdc" + tabooRegStr.p,
    tabooRegStr.x + "\u94f6",
  ].join("|"),
  "g"
);

const delimiter = /&&|\+\+/;
const convert = OpenCC.Converter({ from: "t", to: "cn" });

function sanitize(text: string): string {
  return convert(
    text.replace(/\u4E00-\u9FA5\uF900-\uFA2D0-9A-Za-z/g, "").toLocaleLowerCase()
  );
}

export function censorCheck(text: string): CensorCheckResult {
  const list: string[] = [];
  if (!text) {
    return {
      result: false,
      list,
    };
  }

  for (const word of preConversionCheckList) {
    if (text.includes(word)) {
      list.push(word);
    }
  }

  sanitize(text);

  for (const word of wordsArray as string[]) {
    if (word.includes("#")) {
      continue;
    } else if (delimiter.test(word)) {
      if (word.split(delimiter).reduce((a, b) => a && text.includes(b), true)) {
        list.push(word);
      }
    } else {
      if (text.includes(word)) {
        list.push(word);
      }
    }
  }

  (text.match(tabooRegExp) || []).forEach((m) => {
    if (!(whiteList as string[]).includes(m)) {
      list.push(m);
    }
  });

  return {
    result: list.length ? true : false,
    list,
  };
}
