import * as React from 'react';
import * as ReactDOM from "react-dom";

// CSS imported here will be bundled by webpack
import './index.css';
// You can import any components here
import DogPicturesGallery from './components/DogPicturesGallery';


ReactDOM.render(
  React.createElement(DogPicturesGallery),
document.getElementById('main')
)
