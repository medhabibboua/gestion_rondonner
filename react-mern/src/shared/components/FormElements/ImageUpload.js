import React, {useRef, useState,useEffect} from "react";
import Button from "./Button";
import "./ImageUpload.css"

const ImageUpload = (props) => {
  const [file,setFile]=useState()
  const [previewUrl, setPreviewUrl]=useState()
  const [isValid, setIsValid]=useState()
    const uploadRef=useRef()
    const uploadClicked=()=>{
        uploadRef.current.click()
    }
    useEffect(()=>{
      if(!file)
      return
      else{
        const fileReader=new FileReader()
        fileReader.readAsDataURL(file)
        fileReader.onload=()=>{
          setPreviewUrl(fileReader.result)
        }
      }
      
    },[file])
    const uploadHandler=(event)=>{
      let fileIsValid=isValid
        if(event.target.files && event.target.files.length===1){
          setFile(event.target.files[0])
          setIsValid(true)
          fileIsValid=true
        }else{
          setIsValid(false)
          fileIsValid=false
        }
        props.onInput(props.id,event.target.files[0],fileIsValid)
    }
  
  return (
    <div className="form-control">
      <input
        id={props.id}
        type="file"
        style={{ display: "none" }}
        accept=".png,.jpg,.jpeg "
        ref={uploadRef}
        onChange={uploadHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className="image-upload__preview">
            {previewUrl?<img src={previewUrl} alt="preview" />:<p>please choose an image</p>}
        </div>
        <Button type="button" onClick={uploadClicked}>UPLOAD IMAGE</Button>
      </div>
    </div>
  );
};

export default ImageUpload;
