const API_URL = 'https://vision.googleapis.com/v1/images:annotate?key=';

// A generic onclick callback function.
function genericOnClick(info, tab) {
  let srcUrl = info.srcUrl;
  console.log(srcUrl);
  chrome.tabs.create({ url: srcUrl });

  let body = {
    "requests": [
      {
        "image": {
          "source": {
            "imageUri": srcUrl
          }
        },
        "features": [
          {
            "type": "LANDMARK_DETECTION",
            "maxResults": 1
          }
        ]
      }
    ]
  }

  fetch(API_URL + API_KEY, {
    method: 'post',
    body: JSON.stringify(body)
  }).then(function(response) {
    return response.json();
  }).then(function(response) {
    console.log(response.responses[0].landmarkAnnotations[0].description);
  })
  .catch((error) => {
    console.log('Error with axios call');
  });
}

let take_me = chrome.contextMenus.create({
  "title": "Take me here!",
  "contexts": ["image"],
  "onclick": genericOnClick
});
