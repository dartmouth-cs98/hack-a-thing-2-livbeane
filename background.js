const API_URL = 'https://vision.googleapis.com/v1/images:annotate?key=';

// A generic onclick callback function.
function genericOnClick(info, tab) {
  // Get url of image
  let srcUrl = info.srcUrl;
  console.log(srcUrl);

  // Google cloud vision api request body
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

  // Call Google cloud vision api on image for landmark detection
  fetch(API_URL + API_KEY, {
    method: 'post',
    body: JSON.stringify(body)
  }).then(function(response) {
    return response.json();
  }).then(function(response) {
    // strip landmark from response
    let location = response.responses[0].landmarkAnnotations[0].description;
    // format the landmark for google maps
    maps_loc = location.split(' ').join('+');
    // format the landmark for wikipedia
    wiki_loc = location.split(' ').join('_');
    console.log(maps_loc);
    console.log(wiki_loc);
    // open up a new tab with directions from current location to landmark
    chrome.tabs.create({ url: 'https://www.google.com/maps/dir/?api=1&destination=' + maps_loc + '&travelmode=driving' });
    // open up a new tab with wikipedia page for landmark
    chrome.tabs.create({ url: 'https://en.wikipedia.org/wiki/' + wiki_loc });
  })
  .catch((error) => {
    // let user know if could not determine landmark
    alert('Sorry, we could not figure out where this image was taken :(');
  });
}

// adds option for right-click on images
let take_me = chrome.contextMenus.create({
  "title": "Take me here!",
  "contexts": ["image"],
  "onclick": genericOnClick
});
