if (window.addEventListener) {
   window.addEventListener('load', function() { init(); });
}
  var width = 400;
  var height = 0;

  var streaming = false;

  var video = null;
  var canvas = null;
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
  var paintSelected;


function init() {
  video = document.getElementById('video');
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  photo = document.getElementById('photo');
  startbutton = document.getElementById('startbutton');
  savebutton = document.getElementById('savebutton');
  canvas_filename = document.getElementById('canvas_filename');
  imageLoader = document.getElementById('imageLoader');
  stamp = $('.buttons');
  draw = $('#draw');

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


   //drawing
   draw.on('click', function(e){
    paintSelected = true;
    stampId='';
  })


     $('#canvas').mousedown(function(e){
       mouseX = e.pageX - this.offsetLeft;
       mouseY = e.pageY - this.offsetTop;
       if (paintSelected){
       paint = true;
       addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
       redraw();
     }
     });

     $('#canvas').mousemove(function(e){
       if(paintSelected && paint){
         addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
         redraw();
       }
     });

     $('#canvas').mouseup(function(e){
       paint = false;
     });

     $('#canvas').mouseleave(function(e){
       paint = false;
     });

   //stamps
   canvas.addEventListener('click', onClick, false);

   stamp.on('click', function(e){
     paintSelected = false;
    onStamp(this.id);
   })

   clearphoto();

   //stamps
   function onStamp(id){
     stampId = '#' + id + '_';
     $(lastStampId).removeClass('selectedStamp');
     $(stampId).addClass('selectedStamp');
     lastStampId = stampId;
   }

   function onClick(e){
     if (stampId.length){
       ctx.drawImage($(stampId)[0], mouseX - 40, mouseY -40, 100, 100 * ($(stampId)[0].height)/ ($(stampId)[0].width))
     }
   }

   function addClick(x, y, dragging)
   {
     clickX.push(x);
     clickY.push(y);
     clickDrag.push(dragging);
   }

   function redraw(){

    //  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clears the canvas

     ctx.strokeStyle = "#000000";
     ctx.lineJoin = "round";
     ctx.lineWidth = 2;

     for(var i=0; i < clickX.length; i++) {
       ctx.beginPath();
       if(clickDrag[i] && i){
         ctx.moveTo(clickX[i-1], clickY[i-1]);
        }else{
          ctx.moveTo(clickX[i]-1, clickY[i]);
        }
        ctx.lineTo(clickX[i], clickY[i]);
        ctx.closePath();
        ctx.stroke();
     }
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
    // var ctx = canvas.getContext('2d');

    ctx.fillStyle = "#AAA";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }

  function takepicture() {
    clickX = []
    clickY = []
    clickDrag = []

   if (width && height) {
     canvas.width = width;
     canvas.height = height;
     ctx.drawImage(video, 0, 0, width, height);

     var data = canvas.toDataURL('image/png');
     photo.setAttribute('src', data);
   } else {
     clearphoto();
   }
 }
}
