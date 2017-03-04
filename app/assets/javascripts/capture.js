(function() {
  var width = 400;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream

  var streaming = false;

  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;

  function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');
    savebutton = document.getElementById('savebutton');
    canvas_filename = document.getElementById('canvas_filename');
    imageLoader = document.getElementById('imageLoader');

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(function(stream) {
          video.srcObject = stream;
          video.play();
      })
      .catch(function(err) {
          console.log("An error occured! " + err);
      });

      video.addEventListener('canplay', function(ev){
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth/width);

          video.setAttribute('width', width);
          video.setAttribute('height', height);
          canvas.setAttribute('width', width);
          canvas.setAttribute('height', height);
          streaming = true;
        }
      }, false);

      startbutton.addEventListener('click', function(ev){
      takepicture();
      ev.preventDefault();
      }, false);

      savebutton.addEventListener("click", function(event) {
       event.preventDefault();
       savephoto();
     }, false);

     imageLoader.addEventListener('change', handleImage, false);

      // clearphoto();

    }

    function handleImage(e){
      var reader = new FileReader();
      reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img,0,0);
        }
        img.src = event.target.result;
      }
      reader.readAsDataURL(e.target.files[0]);
    }

    function savephoto(){
      canvas.toBlobHD(function(blob) {
        saveAs(
            blob
          , (canvas_filename.value || canvas_filename.placeholder) + ".png"
        );
      }, "image/png");

    }

    function clearphoto() {
      var context = canvas.getContext('2d');
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, canvas.width, canvas.height);
      var data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
    }

    function takepicture() {
     var context = canvas.getContext('2d');
     if (width && height) {
       canvas.width = width;
       canvas.height = height;
       context.drawImage(video, 0, 0, width, height);

       var data = canvas.toDataURL('image/png');
       photo.setAttribute('src', data);
     } else {
       clearphoto();
     }
   }

   window.addEventListener('load', startup, false);
})();
