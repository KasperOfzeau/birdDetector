let video;
let options = {
  video: {  
    facingMode: {
      exact: "environment"
     }
  }
};
let detector;
let detections = [];
let  imgDiv;
let cooldown;
let cooldownDiv = document.getElementById('cooldownDiv');

//Load model
function preload() {
  detector = ml5.objectDetector('cocossd');
}

//Get dedections
function gotDetections(error, results) {
  if (error) {
    console.error(error);
  }
  detections = results;
  detector.detect(video, gotDetections);
}

//Create canvas for video
function setup() {
  createCanvas(720, 1280);
  imgDiv = document.createElement("div");
  imgDiv.classList.add("container");
  document.body.appendChild(imgDiv);
  cooldown = false;
  cooldownDiv.innerHTML = "Cooldown is: " + cooldown;
  video = createCapture(options);
  video.size(AUTO, AUTO);
  video.hide();
  detector.detect(video, gotDetections);
}

// Draw boxes around detected objects
function draw() {
  image(video, 0, 0);

  for (let i = 0; i < detections.length; i++) {
    let object = detections[i];
    //When a bird is detected
   if(object.label == 'bird') {
        stroke(0, 255, 0);
        strokeWeight(4);
        noFill();
        rect(object.x, object.y, object.width, object.height);
        noStroke();
        fill(255);
        textSize(24);
        text(object.label, object.x + 10, object.y + 24);

        saveImage(); // Save image of bird
    }
  }
}

function saveImage() {
  if(cooldown == false) {
    cooldown = true;
    cooldownDiv
    .innerHTML = "Cooldown is: " + cooldown;
    let imgHolder = document.createElement('div');
    imgHolder.classList.add("imgHolder");
    let img = document.createElement("img");
    let tag = document.createElement('p');
    
    img.src = canvas.toDataURL('png'); // set image from canvas in img
    tag.innerHTML =  new Date().toLocaleString(); // add time and date

    imgHolder.appendChild(img);
    imgHolder.appendChild(tag);
    imgDiv.appendChild(imgHolder);

    downloadImage(); // download image of bird

    // Start cooldown
    setTimeout(function(){
      cooldown = false;
      cooldownDiv.innerHTML = "Cooldown is: " + cooldown;
    },150000);
  }
}

function downloadImage(){
  let link = document.createElement('a');
  let date = new Date().toLocaleString();
  link.download = 'capturedBrid' + date + '.png';
  link.href = canvas.toDataURL('png');
  link.click();
}