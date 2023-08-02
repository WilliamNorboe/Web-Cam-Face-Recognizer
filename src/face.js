import './App.css';
import { useEffect, useRef } from 'react';
import * as faceapi from "face-api.js";



function Face(props) {

    let example = getComputedStyle(document.querySelector(".example"));
    let width = Number(example.width.split('p')[0]);
    let height = Number(example.height.split('p')[0]);
    console.log(height);

    // width = document.querySelector(".example").clientWidth;
    // height = document.querySelector(".example").clientHeight;
  const imgRef = useRef();
  const canvasRef = useRef();

  const handleImage = async () => {
    const detections = await faceapi.detectAllFaces(
      imgRef.current,
      new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender();
      console.log(detections);
      canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(imgRef.current);
      faceapi.matchDimensions(canvasRef.current, {
        width: width,
        height: height,
      })
      const resized = faceapi.resizeResults(detections, {
        width: width,
        height: height,
      });
      faceapi.draw.drawDetections(canvasRef.current, resized);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
      resized.forEach( detection => {
        const box = detection.detection.box
        const drawBox = new faceapi.draw.DrawBox(box, { label: Math.round(detection.age) + " year old " + detection.gender })
        drawBox.draw(canvasRef.current)
      })
  
  }
  useEffect(()=>{
    const loadModels = () =>{
      Promise.all([
        faceapi.nets.tinyFaceDetector.load("/Web-Cam-Face-Recognizer/models"),
        faceapi.nets.faceLandmark68Net.load("/Web-Cam-Face-Recognizer/models"),
        faceapi.nets.faceRecognitionNet.load("/Web-Cam-Face-Recognizer/models"),
        faceapi.nets.faceExpressionNet.load("/Web-Cam-Face-Recognizer/models"),
        faceapi.nets.ageGenderNet.loadFromUri("/Web-Cam-Face-Recognizer/models"),
      ]).then(handleImage)
      .catch((e) => console.log(e));
    }
    imgRef.current && loadModels()
  }, []);

  // let timg = "https://images.pexels.com/photos/1537635/pexels-photo-1537635.jpeg";
  let timg = props.img;
  return (
    <div className="app">
      <img
      crossOrigin='anonymous'
      ref = {imgRef}
      src = {timg}
      alt = "" className = "example"
      />
      <canvas ref = {canvasRef}  /> 
    </div>
  );
}

export default Face;
