import * as React from 'react';
import * as ReactDOM from "react-dom";

// CSS imported here will be bundled by webpack
import './index.css';
// You can import any components here
import './components/my-component';
import DogPicturesGalery from './components/DogPicturesGalery';


ReactDOM.render(
  React.createElement(DogPicturesGalery),
document.getElementById('main')
)
