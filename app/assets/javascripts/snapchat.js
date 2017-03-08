
$('.pages.face').ready(function () {



if (window.addEventListener) {
   window.addEventListener('load', function() { init(); });
}
  var width = 400;
  var height = 0;

  var streaming = false;

  var video = null;
  var canvas = null;
  var canvas2 = null;
  var photo = null;
  var startbutton = null;
  var clickX = []
  var clickY = []
  var clickDrag = []
  var paint;
  var stampId = '';
  var lastStampId='';
  var mouseX;
  var mouseY;
  var toolSelected;


function init() {


  video = document.createElement('video');
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  canvas2 = document.getElementById('canvas2');
  context2 = canvas2.getContext('2d');


  photo = document.getElementById('photo');
  startbutton = document.getElementById('startbutton');
  savebutton = document.getElementById('savebutton');
  publishbutton = document.getElementById('publishbutton');
  // canvas_filename = document.getElementById('canvas_filename');
  imageLoader = document.getElementById('imageLoader');
  stamp = $('.buttons');
  draw = $('#draw');
  drawColor = $('#drawColor');
  textColor = $('#textColor');
  filter = document.getElementById('filter');
  maskDropdown = document.getElementById('masks');

  // camera streaming
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(function(stream) {
        // video.srcObject = stream;
        // video.play();
        video.src = (window.URL && window.URL.createObjectURL) ? window.URL.createObjectURL(stream) : stream;
        processWebcamVideo();
    })
    .catch(function(err) {
        console.log("An error occured! " + err);
    });

    var mask = new Image();
    var maskImage = $('#masks').val();
    mask.src = "/assets/" + maskImage + ".png";


    function processWebcamVideo() {
      var startTime = +new Date(),
             changed = false,
             scaleFactor = 1,
             faces;

      context2.drawImage(video, 0, 0, canvas2.width, canvas2.height);

      function drawFrame() {
        context2.drawImage(video, 0, 0, canvas2.width, canvas2.height);
        setTimeout(drawFrame, 20);
      }

      maskDropdown.onchange = function(){
        maskImage = $('#masks').val();
        mask.src = "/assets/" + maskImage + ".png";
      }

      faces = detectFaces();

      function detectFaces() {
        return ccv.detect_objects({canvas : (ccv.pre(canvas2)), cascade: cascade, interval: 2, min_neighbors: 1});
      }

      if (maskImage === "catEars"){
        drawMasks(faces);

        function drawMasks(faces) {
          if(!faces) {
              return false;
          }
          for (var i = 0; i < faces.length; i++) {
              var face = faces[i];
              context2.drawImage(mask, face.x - face.width * 0.5, face.y - face.height*0.8, face.width * 2, face.height * 1.3);
          }
        }
      }

      if (maskImage === "whiskers"){
        drawMasks(faces);

        function drawMasks(faces) {
          if(!faces) {
              return false;
          }
          for (var i = 0; i < faces.length; i++) {
              var face = faces[i];
              context2.drawImage(mask, face.x - face.width*0.5, face.y , face.width * 2, face.height * 1.3);
          }
        }
      }

      if (maskImage === "witchhat"){
        drawMasks(faces);

        function drawMasks(faces) {
          if(!faces) {
              return false;
          }
          for (var i = 0; i < faces.length; i++) {
              var face = faces[i];
              context2.drawImage(mask, face.x - face.width*0.5, face.y - face.height *1.2, face.width * 2, face.height * 1.4);
          }
        }
      }

      if (maskImage === "wolverine"){
        drawMasks(faces);

        function drawMasks(faces) {
          if(!faces) {
              return false;
          }
          for (var i = 0; i < faces.length; i++) {
              var face = faces[i];
              context2.drawImage(mask, face.x - face.width*0.4, face.y - face.height * 0.7, face.width * 1.8, face.height * 1.4);
          }
        }
      }

      if (maskImage === "ironman"){
        drawMasks(faces);

        function drawMasks(faces) {
          if(!faces) {
              return false;
          }
          for (var i = 0; i < faces.length; i++) {
              var face = faces[i];
              context2.drawImage(mask, face.x - face.width*0.4, face.y - face.height * 0.4, face.width * 2.1, face.height * 1.8);
          }
        }
      }

      if (maskImage === "sunglasses"){
        drawMasks(faces);

        function drawMasks(faces) {
          if(!faces) {
              return false;
          }
          for (var i = 0; i < faces.length; i++) {
              var face = faces[i];
              context2.drawImage(mask, face.x - face.width*0.1 , face.y + face.height*0.2 , face.width * 1.2, face.height * 0.5);
          }
        }
      }

      // if (maskImage === "moustache"){
      //   drawMasks(faces);
      //
      //   function drawMasks(faces) {
      //     if(!faces) {
      //         return false;
      //     }
      //     for (var i = 0; i < faces.length; i++) {
      //         var face = faces[i];
      //         context2.drawImage(mask, face.x  , face.y + face.height*0.7 , face.width * 1, face.height * 0.2);
      //     }
      //   }
      // }



      setTimeout(processWebcamVideo, 80);
    };

    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);

        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas2.setAttribute('width', width);
        canvas2.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    //filters
    filter.onchange = function(){
      video.className = filter.value;
    }

    //take picture button
    startbutton.addEventListener('click', function(ev){
    takepicture();
    ev.preventDefault();
    }, false);

    //saving photo to Users' computer
    savebutton.addEventListener("click", function(event) {
     event.preventDefault();
     savephoto();
   }, false);

   //saving photo to db and cloudinary
  publishbutton.addEventListener("click", function(event) {
    event.preventDefault();
    publishphoto();
  }, false);


   //loading images from users' computer (and phone?)
   imageLoader.addEventListener('change', handleImage, false);

   //mouse
   document.getElementById("canvas").style.cursor = "pointer";

   //draw
   draw.on('click', function(e){
    toolSelected = "draw"
    stampId='';

  })

    $('#canvas').mousedown(function(e){
      //ensures color changes everytime
      clickX = [];
      clickY = [];
      clickDrag = [];
      mouseX = e.pageX - this.offsetLeft;
      mouseY = e.pageY - this.offsetTop;
      if (toolSelected === "draw"){
      paint = true;
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
      redraw();
    }
    });

    $('#canvas').mousemove(function(e){
      if(toolSelected === "draw" && paint){
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
      }
    });

    $('#canvas').mouseup(function(e){
      paint = false;
      redraw();
    });

    $('#canvas').mouseleave(function(e){
      paint = false;
    });
    var buttonClicked;
    var lastButtonClicked;

    // Add class to the selected button that is clicked on
    $('.tools div div').on('click', function(e){checkButton(this.id)});
    function checkButton(id){
      buttonClicked = '#' + id;
      $(lastButtonClicked).removeClass('selectedStamp');
      $(buttonClicked).addClass('selectedStamp');
      lastButtonClicked = buttonClicked;
    }

   //stamps
   stamp.on('click', function(e){
    toolSelected = 'stamp';
    id = this.id
    stampId = '#' + id + '_';
    lastStampId = stampId;
   })

   canvas.addEventListener('click', onClick, false);



   clearphoto();

   function onClick(e){
     if (toolSelected==='stamp'){
       ctx.drawImage($(stampId)[0], mouseX - 40, mouseY -40, 100, 100 * ($(stampId)[0].height)/ ($(stampId)[0].width))
     }
   }
   //Text
   $('#text').on('click',function(){
     toolSelected = "text";
   })
  $('#canvas').on('click', text);


  function text(){
   if(toolSelected==='text'){
     str = $('#inputText').val()
     if(str){
       ctx.font = '30px sans-serif';
       ctx.fillStyle=textColor.val();
       ctx.fillText(str, mouseX, mouseY);
     }
    }
  }

  //Drawing/painting
   function addClick(x, y, dragging)
   {
     clickX.push(x);
     clickY.push(y);
     clickDrag.push(dragging);
   }

   function redraw(){


    //  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clears the canvas

    ctx.beginPath();
     ctx.lineJoin = "round";
     ctx.lineWidth = 2;

     for(var i=0; i < clickX.length; i++) {

       if(clickDrag[i] && i){
         ctx.moveTo(clickX[i-1], clickY[i-1]);
        }else{
          ctx.moveTo(clickX[i]-1, clickY[i]);
        }
        ctx.lineTo(clickX[i], clickY[i]);

        ctx.closePath();
        ctx.strokeStyle = drawColor.val();
        ctx.stroke();
     }
   }



  function handleImage(e){
    var reader = new FileReader();
    reader.onload = function(event){
      var img = new Image();
      img.onload = function(){
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
        , (photo_name.value || photo_name.placeholder) + ".png"
      );
    }, "image/png");

  }

  function publishphoto(){
    $('.image_upload').unbind('cloudinarydone');
    var data = canvas.toDataURL('image/png');
    $('.image_upload').cloudinary_fileupload();
    $('.image_upload').fileupload('option', 'formData').file = data;
    $('.image_upload').fileupload('add', { files: [ data ] });
    $('.image_upload').bind('cloudinarydone', function(e, data) {
      data = data.result.public_id;
      filename = $('#photo_name').val();
      $.ajax({
          url : "/photos",
          type : "post",
          data : {
            photo: {
              name: filename, image: data
            }
          }
      });
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      $('#photo_name').val('');
      $('.drawAlert').html("Photo published!")
      setTimeout(function(){ $('.drawAlert').html("")}, 3000);

      return true;
    });

  }
// data_value: JSON.stringify(data)
  function clearphoto() {
    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // var data = canvas.toDataURL('image/png');
    // photo.setAttribute('src', data);
  }

  function takepicture() {
    clickX = []
    clickY = []
    clickDrag = []
    if (width && height) {
     canvas.width = width;
     canvas.height = height;
     ctx.filter = filter.value +"(1)";
     ctx.drawImage(canvas2, 0, 0, width, height);
     var data = canvas.toDataURL('image/png');
    //  photo.setAttribute('src', data);
    } else {
     clearphoto();
    }
  }



}

});
