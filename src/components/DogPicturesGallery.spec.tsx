import React from 'react'
import renderer from 'react-test-renderer';
import DogPicturesGallery from './DogPicturesGallery';

describe('DogPicturesGallery', ():void => {
  it('should render correctly', ():void => {
     /* Test the state after async functions, write a function to be called  */
     /* After the async calls finished inside dogpicturesgallery */
    expect.assertions(1);
    const wrapper = renderer.create(<DogPicturesGallery/>)
    expect(wrapper.toJSON()).toMatchSnapshot()
  })
})
