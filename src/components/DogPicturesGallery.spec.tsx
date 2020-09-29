import React from 'react'
import * as renderer from 'react-test-renderer';

import DogPicturesGallery from './DogPicturesGallery';

describe('<DogPicturesGallery', ():void => {
  it('should render correctly', ():void => {
    expect.assertions(0);
    const wrapper = renderer.create(<DogPicturesGallery/>)
    expect(wrapper.toJSON()).toMatchSnapshot()
  })
})
