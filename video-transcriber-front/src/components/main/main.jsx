import { useState } from 'react';
import Input from "../input/input";
import { Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import './main.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Footer from '../footer/footer';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import GeneratedText from '../generated-text/generated-text';
import TypingEffect from '../typing-effect/typing-effect';
import Loading from '../loading/loading';

export default function Main() {
  const [isFileValid, setIsFileValid] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState(null);
  const [selectedModel, setSelectedModel] = useState('base');

  const phrases = [
    "Привет, мир!",
    "Video-Transcriber для транскрипции из видео",
  ];

  const handleFileValidation = (isValid) => {
    setIsFileValid(isValid);
  };

  const handleFileSelected = (file) => {
    setSelectedFile(file);
    setResultText(null);
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  const handleSendChange = () => {
    if (!selectedFile) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('model', selectedModel);

    fetch('http://localhost:7777/api/transcribe/', {
      method: 'POST',
      body: formData,
    })
        .then(response => {
          if (!response.ok) throw new Error('Ошибка сервера');
          return response.json();
        })
        .then(data => {
          setResultText(data.text);
          setLoading(false);
        })
        .catch(error => {
          console.error('Ошибка:', error);
          setSelectedFile(null);
          setLoading(false);
        });
  };

  if (loading)
    return <Loading/>

  return (
      <div className="main-page">
        <div className="figure-1"></div>
        <div className="figure-2"></div>
        <div className="figure-3"></div>

        <div className="text-preview">
          Video-Transcriber - краткая и информативная выжимка из видео
        </div>

        {!resultText && (
            <Input
                video
                onValidation={handleFileValidation}
                onFileSelected={handleFileSelected}
            />
        )}

        {!resultText && selectedFile && (
            <>
              <div className="radio-group">
                <FormControl>
                  <FormLabel id="model-selection-label" style={{color: "White", marginTop: "1rem"}}>
                    Выберите модель:
                  </FormLabel>
                  <RadioGroup
                      row
                      aria-labelledby="model-selection-label"
                      name="model-radio-group"
                      value={selectedModel}
                      onChange={handleModelChange}
                  >
                    <FormControlLabel
                        value="tiny"
                        control={<Radio color="secondary" title='Лучше подходит для быстрой расшифровки'/>}
                        label="tiny"
                    />
                    <FormControlLabel
                        value="base"
                        control={<Radio color="secondary" title='Сбалансировано время и расшифровка'/>}
                        label="base"
                    />
                    <FormControlLabel
                        value="turbo"
                        control={<Radio color="secondary" title='Лучше подходит для тщательной расшифровки'/>}
                        label="turbo"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </>
        )}

        {!selectedFile && !resultText && (
            <TypingEffect
                phrases={phrases}
                speed={80}
                eraseSpeed={40}
                pauseBetween={1500}
            />
        )}

        {!resultText && selectedFile && (
            <Button
                loadingPosition="end"
                variant='contained'
                endIcon={<SendIcon />}
                onClick={handleSendChange}
                disabled={!isFileValid || loading}
                size="medium"
            >
              Отправить
            </Button>
        )}

        {loading && <Loading/>}

        {resultText &&
            <div className="result-container">
              <GeneratedText text={resultText} />
              <Input
                  video
                  onValidation={handleFileValidation}
                  onFileSelected={handleFileSelected}
              />
            </div>
        }

        <Footer/>
      </div>
  );
}
