const API_URL = 'https://vision.googleapis.com/v1/images:annotate?key=';

// A generic onclick callback function.
function genericOnClick(info, tab, callback) {
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

    callback(location);
  })
  .catch((error) => {
    // let user know if could not determine landmark
    alert('Sorry, we could not figure out where this image was taken :(');
  });
}

function mapsOnClick(info, tab){
  genericOnClick(info, tab, (location) => {
    // format the landmark for google maps
    maps_loc = location.split(' ').join('+');
    console.log(maps_loc);
    // open up a new tab with maps page for landmark
    chrome.tabs.create({ url: 'https://www.google.com/maps/dir/?api=1&destination=' + maps_loc + '&travelmode=driving' });
  });
}

function wikiOnClick(info, tab){
  genericOnClick(info, tab, (location) => {
    // format the landmark for wikipedia
    wiki_loc = location.split(' ').join('_');
    console.log(wiki_loc);
    // open up a new tab with wikipedia page for landmark
    chrome.tabs.create({ url: 'https://en.wikipedia.org/wiki/' + wiki_loc });
  });
}

// adds option for right-click on images
let take_me = chrome.contextMenus.create({
  "title": "Take me here!",
  "contexts": ["image"],
  "id": "parent",
});
let wiki_tab = chrome.contextMenus.create({
  "title": "Wikipedia",
  "contexts": ["image"],
  "parentId": "parent",
  "id": "child1",
  "onclick": wikiOnClick,
});
let maps_tab = chrome.contextMenus.create({
  "title": "GoogleMaps",
  "contexts": ["image"],
  "parentId": "parent",
  "id": "child2",
  "onclick": mapsOnClick,
});
