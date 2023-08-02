import './App.css';
import { useEffect, useRef, useState} from 'react';
import * as faceapi from "face-api.js";
import Face from './face';

import Camera from "./camera";

import download from "./download.jpg"
function App() {

  const [photoTaken, setPhotoTaken] = useState(false);
  // let timg = "https://images.pexels.com/photos/1537635/pexels-photo-1537635.jpeg";
  //let timg = "https://image.cnbcfm.com/api/v1/image/107228941-1682027700192-_DSC5658.jpg?v=1682427601&w=1920&h=1080";

  const takeNewPhoto = () => {
    window.location=(window.location.href);
  }

  return (
    <div className="App">
      
      <Camera setPhotoTaken1 = {setPhotoTaken} />
      <div>
        {photoTaken ? (
          <div>
            <button onClick={takeNewPhoto}>Take New Photo</button>
            <Face img = {photoTaken}/>
          </div>
          // <img src = {photoTaken} />
        ) : (
        <></>
        )}
      </div>
      <div className = "example test"></div>
    </div>
  );
}

export default App;
