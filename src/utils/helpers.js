// @flow
import config from "../config";
import { DATA_TYPE_ALL, QUERY, APP_TYPE_COMPANY, DATA_TYPE_STUDENT } from "../enum";
import Code from "../code";

export function kebabCase(string: String) {
  return string
    .split(/ |_|-/)
    .join('-')
    .split('')
    .map((a, index) => {
      if (a.toUpperCase() === a && a !== '-') {
        return (index !== 0 ? '-' : '') + a.toLowerCase();
      }
      return a;
    })
    .join('')
    .toLowerCase();
}

export function titleize(string: String) {
  return string
    .split('-')
    .map(word => word.split(''))
    .map(letters => {
      const first = letters.shift();
      return [first.toUpperCase(), ...letters].join('');
    })
    .join(' ');
}

function formatTimeNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export function getTimeString(timeStamp) {
  let date;
  let ts = parseInt(timeStamp);
  if (isNaN(ts)) {
    date = new Date();
  } else if (ts > 1000000000000) {
    date = new Date(ts);
  } else {
    date = new Date(ts * 1000);
  }
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();

  return [year, month, day].map(formatTimeNumber).join('/') + ' ' + [hour, minute, second].map(formatTimeNumber).join(':')
}

/**
 * 向服务器发送消息
 * @param {*} router 
 * @param {*} json 
 * @param {*} callback 
 * @param {*} args 
 */
export function getData(router, json, callback = null, args = {}) {
  if (!isJson(json)) {

  }
  fetch(router, {
    method: 'POST',
    mode: 'cors',
    cache: 'default',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www.form-urlencoded'
    },
    body: JSON.stringify(json)
  }).then(function status(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    }
    else {
      return Promise.reject(new Error(response.statusText));
    }
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    if (callback !== null) {
      if (data.code === 10099) {
        sessionStorage.logged = false;
      }
      // sessionStorage.logged = false;
      callback(router, data, args);
    }
    return data;
  }).catch(function (e) {
    console.log(e);
    console.log("调用" + router + "接口出错");
  });
  return
}

export function isJson(obj) {
  return typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
}

/**
 * 获取路由
 * @param {*路由键} key 
 */
export function getRouter(key) {
	console.log(key);
  var router = sessionStorage.getItem(key);
  console.log(router);
  return router === null ? config.routers : router;
}

/**
 * 
 * @param {*} key 
 */
export function getStorage(key) {
  return localStorage.getItem(key);
}

/**
 * 获取保存所有数据
 * - info 个人与公司信息
 *  - base
 *  - finance
 *  - express
 *  - admin
 * - students 所有学生
 * - clazz 所属班级
 */
export function getCache(key = DATA_TYPE_ALL) {
  if (key === DATA_TYPE_ALL) {
    return window.CacheData;
  }
  return window.CacheData[key];
}

/**
 * 获取单个学生
 * @param {*学生ID} id 
 */
export function getStudent(id = 0) {
  for (var i = 0; i < window.CacheData[DATA_TYPE_STUDENT].length; i++) {
    if (window.CacheData[DATA_TYPE_STUDENT][i].id === id) {
      return window.CacheData[DATA_TYPE_STUDENT][i];
    }
  }
  return {};
}

/**
 * 每个页面初始化使用的cache
 * @param {*回调函数} callback 
 */
export function initCache(callback = () => { }) {
  // if (!window.CacheData) {
  if (sessionStorage.logged === true || sessionStorage.session !== undefined) {
    var cb = (route, message, arg) => {
      console.log(message)
      if (message.code === 10045) {
        window.CacheData = message.data;
        console.log(window.CacheData)
        callback()
      }
    }
    getData(getRouter(QUERY), { session: sessionStorage.session, type: sessionStorage.apptype }, cb, { callback: callback });
  } else {
    // 请登录
    // window.di
  }
  // } else {
  // callback();
  // }
}

/**
 * 服务器通知
 */
export function notification() {
  var source = new EventSource(config.notification);
  source.onmessage = function (event) {
    console.log(event.data);

  };
}