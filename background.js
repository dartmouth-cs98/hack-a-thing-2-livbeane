const API_URL = 'https://vision.googleapis.com/v1/images:annotate?key=';

// A generic onclick callback function.
function genericOnClick(info, tab) {
  let srcUrl = info.srcUrl;
  console.log(srcUrl);

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
    let location = response.responses[0].landmarkAnnotations[0].description;
    location = location.split(' ').join('+');
    console.log(location);
    chrome.tabs.create({ url: 'https://www.google.com/maps/dir/?api=1&destination=' + location + '&travelmode=driving' });
  })
  .catch((error) => {
    alert('Sorry, we could not figure out where this image was taken :(');
  });
}

let take_me = chrome.contextMenus.create({
  "title": "Take me here!",
  "contexts": ["image"],
  "onclick": genericOnClick
});
