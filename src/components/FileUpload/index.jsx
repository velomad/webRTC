import React, { useRef } from "react";

const FileUploader = ({ onFileSelect }) => {
  const fileInput = useRef(null);

  const handleFileInput = (e) => {
    // handle validations
    const file = e.target.files[0];
    onFileSelectSuccess(file);
  };

  return (
    <div>
      <div className="file-uploader">
        <input type="file" onChange={handleFileInput} />
        <button
          onClick={(e) => fileInput.current && fileInput.current.click()}
          className="btn btn-primary"
        />
      </div>
    </div>
  );
};

export default FileUploader;
