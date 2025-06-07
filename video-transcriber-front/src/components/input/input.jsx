import { useState, useRef } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import VideoPlayer from '../video-player/video-player';
import './input.css';

export default function Input({ type = "file", video, onValidation, onFileSelected }) {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [wrongFileType, setWrongFileType] = useState('');
  const fileRef = useRef();
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setFileName("");
      setWrongFileType("");
      if (onValidation) onValidation(false);
      return;
    }

    const isValid = file.type.startsWith('video/');
    
    if (video && !isValid) {
      setWrongFileType('Данный файл не является видео!');
      setFile(null);
      if (onValidation) onValidation(false);
      if (onFileSelected) onFileSelected(null);
    } else {
      setWrongFileType("");
      setFile(file);
      setFileName(file.name)
      if (onValidation) onValidation(true);
      if (onFileSelected) onFileSelected(file);
    }
    
    if (onValidation) onValidation(isValid);
  };

  const dropFile = () => {
    if (fileRef.current) fileRef.current.value = "";
    setFile(null);
    setFileName("");
    setWrongFileType("");
    if (onValidation) onValidation(false);
    if (onFileSelected) onFileSelected(null);
  };

  return (
    <div className="input-main">
      <div className="input-group">
        <Button variant="outlined"
          startIcon={<FileUploadIcon/>}>
          <input
            type={type}
            id="input-main"
            className={type === "file" ? "file-input" : ""}
            onChange={handleFileChange}
            accept={video ? 'video/*' : undefined}
            ref={fileRef}
          />
          <label htmlFor="input-main" className="input-label">
            Загрузить видео
          </label>
        </Button>
        {video && fileName && <Button variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={dropFile}
          size="medium"
          >
          Удалить файл
        </Button>}
      </div>

      {wrongFileType && <p className="error">{wrongFileType}</p>}
      {fileName && <div className="select-file"><InsertDriveFileIcon/> {`Файл: ${fileName}`}</div>}

      {video && file && <VideoPlayer file={file} />}
    </div>
  );
}