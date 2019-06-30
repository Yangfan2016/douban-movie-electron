const url = require("url");
const qs = require("querystring");

const { query } = url.parse(window.location.href);
const { info } = qs.parse(query);
const { src, title } = JSON.parse(info);
let video = document.getElementById("video");
video.src = src;


const titleBar = document.getElementById("js-title-bar");
titleBar.innerHTML = title;
