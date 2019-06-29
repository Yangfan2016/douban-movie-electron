const {ipcRenderer}=require("electron");
const url = require("url");
const qs=require("qs");

const { query } = url.parse(window.location.href);
const { src } = qs.parse(query);

let video = document.getElementById("video");
video.src = src;
ipcRenderer.send("open-dialog-msg","Please open the volume");

