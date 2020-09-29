import * as React from 'react';
import './DogPicturesGalery.scss';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from "@tensorflow/tfjs";




interface State {
  file?: string;
  imgUrl?:string | ArrayBuffer;
  model?:any;
  results?:any;
  dogPicsUrls?:any;
  page?:number;
  loading?:boolean;
  prevY?:number;
  numberOfItems?:number;
};


export default class DogPicturesGalery extends React.Component <{}, State>{
   imageRef: React.RefObject<HTMLImageElement>
   loadingRef: React.RefObject<HTMLDivElement>

   private observer: IntersectionObserver | undefined;

  constructor(props:any) {
    super(props);
    this.state = {
      file: '',
      imgUrl:'',
      model: null,
      results:null,
      dogPicsUrls: [],
      page:0,
      loading:true,
      prevY: 0,
      numberOfItems:10
    }
    this.imageRef = React.createRef()
    this.loadingRef = React.createRef()
    this.resetUploadedImg = this.resetUploadedImg.bind(this)

  }


  async componentDidMount(): Promise <any> {
    tf.getBackend()
    const model = await this.loadModel()
    this.setState({
      model:model
    } as State)
    console.log(tf.getBackend());
    this.observer = new IntersectionObserver(([entry]) => {
       if(entry.isIntersecting){
         this.setState({ loading: true });
         setTimeout(() => {
           this.setState({ numberOfItems: this.state.numberOfItems + 8, loading: false });
         }, 500);
         }
       console.log("LOADINGGG...")
      },
      {
        root: document.getElementsByClassName("main")[0],
        rootMargin: '0px',
        threshold: 1.0
      });

     this.observer.observe(this.loadingRef.current)

  }

  showDogImages (){
    let items = []
    for (let i = 0; i < this.state.numberOfItems; i++) {
      items.push(<div key={i}>
        <img  src={this.state.dogPicsUrls[i]} loading="lazy" />
      </div>);
    }
    return items;
  }
  async identify () {
    const results = await this.state.model.classify(this.imageRef.current);
    this.setState({
      results: results
     } as State, () => this.fetchDogListByBreed())
  }

  resetUploadedImg(){
    this.setState({
       imgUrl: '',
      results: [],
      dogPicsUrls: []
    })
    console.log("helloo")
  }

  fetchDogListByBreed (){
    fetch(`https://dog.ceo/api/breed/hound/images`)
      .then(response => response.json())
      .then(data => {
        let tmpArray = []
        for(let i = 0;i<data.message.length;i++){
          tmpArray.push(data.message[i])
        }
        //use spread operator
        this.setState({
          dogPicsUrls: tmpArray,
         // loading:false
        } as State)
      } )
  }

  async loadModel(){
    return await mobilenet.load();
  }

  handleSubmit(e:any) {
    e.preventDefault();
  }

  handleImageChange(e:any){
    e.preventDefault()
    let reader =  new FileReader()
    let file = e.target.files[0]
    reader.onload = () => {
      this.setState({
        file:file,
        imgUrl:reader.result
      }, async () => {await this.identify()})
    }
    reader.readAsDataURL(file)
  }
  render(){
    const loadingCSS = {
      height: '100px',
      margin:"30px"
    }
    const imgPreviewStyle = {
      padding: '70px',
      fontSize: '20px'
    }
    const loadingTextCSS = {display: this.state.loading ? "block" : "none"}
    let {imgUrl} = this.state
    let imgPreview = null
    if(imgUrl) {
      imgPreview = (<img src={imgUrl as string} ref={this.imageRef}/>)
    }else{
      imgPreview = (<div style={imgPreviewStyle}>Please select an Image for Preview</div>)
    }
    return(
      <div className="DogPicturesGalery-Container">
      <div className="DogPictureUpload-Wrapper">
        <div className="Upload-Img-Wrapper">
          <form onSubmit={(e)=>this.handleSubmit(e)}>
            <label htmlFor="files" className="Upload-Img-Label">Select Image</label>
            <input className="upload-Image-Input"
                   type="file"
                   onChange={(e)=>this.handleImageChange(e)}
            />
          </form>
        </div>
        <div className="uploaded-Image-Preview">
          {imgPreview}
        </div>
        <div className="DogPictureBreed">
          {this.state.results && <span>Results</span>}
          <ul>
            {this.state.results?.map((result:any) => {
              return(<li>
                {result.className}
              </li>)
            })}
          </ul>
        </div>
        <button className="Reset-Img" onClick={this.resetUploadedImg}>RESET</button>
      </div>
      <div className="DogPicturesList">
        <p>DOG PICTURES LIST</p>
        <div className="Dog-Picture-Item">
          <div>
            {this.showDogImages()}
          </div>
        </div>
        <div
          ref={this.loadingRef}
          style={loadingCSS}
        >
          <span style={loadingTextCSS}>
            Loading Images...
          </span>
        </div>
      </div>
      </div>
    )
  }
}

