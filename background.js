// A generic onclick callback function.
function genericOnClick(info, tab) {
  console.log("info: " + JSON.stringify(info));
  console.log(info);
  let srcURL = info.srcUrl;
  console.log(srcURL);
  chrome.tabs.create({ url: srcURL });
}

let take_me = chrome.contextMenus.create({
  "title": "Take me here!",
  "contexts": ["image"],
  "onclick": genericOnClick
});
