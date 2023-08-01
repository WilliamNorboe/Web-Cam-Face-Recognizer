import React, { useEffect, useRef } from "react";
import "./App.css";

const Camera = (props) => {
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const stripRef = useRef(null);
  const colorRef = useRef(null);

  let video;

  let playing = false;
  useEffect(() => {
    getVideo();
  }, [videoRef]);

  const getVideo = () => {
    if(playing){
      return;
    }
    playing = true;
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then(stream => {
        video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error("error:", err);
      });
  };

  const paintToCanvas = () => {
    let video = videoRef.current;
    let photo = photoRef.current;
    let ctx = photo.getContext("2d");

    const width = 320;
    const height = 240;
    photo.width = width;
    photo.height = height;
    return setInterval(() => {
      let color = colorRef.current;

      ctx.drawImage(video, 0, 0, width, height);
      let pixels = ctx.getImageData(0, 0, width, height);

      color.style.backgroundColor = `rgb(${pixels.data[0]},${pixels.data[1]},${
        pixels.data[2]
      })`;
      color.style.borderColor = `rgb(${pixels.data[0]},${pixels.data[1]},${
        pixels.data[2]
      })`;
    }, 200);
  };

  const takePhoto = () => {
    let photo = photoRef.current;
    let strip = stripRef.current;

    const data = photo.toDataURL("image/jpeg");

    console.warn(data);
    const link = document.createElement("a");
    link.href = data;
    link.setAttribute("download", "myWebcam");
    console.log(data);
    link.innerHTML = `<img src='${data}' alt='thumbnail'/>`;
    stop();
    props.setPhotoTaken1(data);
    document.querySelector(".container").style.display = "none";
    // strip.insertBefore(link, strip.firstChild);
  };

  const stop = (e) => {
    if(!playing){
      return;
    }
    const stream = video.srcObject;
    const tracks = stream.getTracks();
  
    for (let i = 0; i < tracks.length; i++) {
      let track = tracks[i];
      track.stop();
    }
    playing = false;
    video.srcObject = null;
  }

  return (
    <div className="container">
      <div ref={colorRef} className="scene">
      </div>
      <div className="webcam-video">
        <div className="buttons">
            <button onClick={() => takePhoto()}>Take a photo</button>
            <button onClick={(e) => {stop(e)}}>Stop Feed</button>
            <button onClick={() => {getVideo()}}>Start Feed</button>
        </div>
        <video
          onCanPlay={() => paintToCanvas()}
          ref={videoRef}
          className="player"
        />
        <canvas ref={photoRef} className="photo" />
        {/* <canvas ref={photoRef} className="photo" />
        <div className="photo-booth">
          <div ref={stripRef} className="strip" />
        </div> */}
      </div>
    </div>
  );
};

export default Camera;
