import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const FileUpload = ({ onFileUploaded }) => {
  const [file, setFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    if (onFileUploaded) {
      onFileUploaded(uploadedFile);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop an Excel file here, or click to select a file</p>
      <div>{file && <div>{file.name}</div>}</div>
    </div>
  );
};

export default FileUpload;
