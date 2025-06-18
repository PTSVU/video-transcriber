import {useState} from 'react';
import {Button, TextField, Box} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import './main.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Footer from '../footer/footer';
import GeneratedText from '../generated-text/generated-text';
import TypingEffect from '../typing-effect/typing-effect';
import Loading from '../loading/loading';

export default function Main() {
    const [inputText, setInputText] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultText, setResultText] = useState(null);

    const phrases = [
        "Привет, мир!",
        "Summarizer — это инструмент для сжатия текста."
    ];

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputText(value);
        setIsValid(value.length > 0 && value.length <= 2048);
    };

    const handleSendChange = () => {
        if (!isValid) return;

        setLoading(true);

        const formData = new FormData();
        formData.append('text', inputText);

        fetch('http://localhost:7777/api/summarize/', {
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
                setLoading(false);
            });
    };

    if (loading)
        return <Loading/>;

    return (
        <div className="main-page">
            <div className="figure-1"></div>
            <div className="figure-2"></div>
            <div className="figure-3"></div>

            <div className="text-preview">
                Summarizer — это инструмент для сжатия текста.
            </div>

            {!resultText && (
                <div className="input-text-container">
                    <Box
                        sx={{
                            backgroundColor: '#23272f',
                            borderRadius: 2,
                            boxShadow: 4,
                            p: 3,
                            mb: 3,
                            maxWidth: 600,
                            mx: 'auto',
                            border: '1px solid #333',
                            transition: 'background-color 0.3s'
                        }}
                    >
                        <TextField
                            label="Введите текст для суммаризации"
                            multiline
                            fullWidth
                            rows={6}
                            variant="outlined"
                            value={inputText}
                            onChange={handleInputChange}
                            inputProps={{maxLength: 2048}}
                            helperText={`${inputText.length}/2048 символов`}
                            error={inputText.length > 2048}
                            sx={{marginBottom: 2}}
                        />
                        <Button
                            variant='contained'
                            endIcon={<SendIcon/>}
                            onClick={handleSendChange}
                            disabled={!isValid || loading}
                            size="medium"
                        >
                            Суммаризировать
                        </Button>
                    </Box>
                </div>
            )}

            {!resultText && !inputText && (
                <TypingEffect
                    phrases={phrases}
                    speed={80}
                    eraseSpeed={40}
                    pauseBetween={1500}
                />
            )}

            {resultText &&
                <div className="result-container">
                    <GeneratedText text={resultText}/>
                    <Button
                        variant='outlined'
                        onClick={() => {
                            setResultText(null);
                            setInputText('');
                            setIsValid(false);
                        }}
                        sx={{marginTop: 2}}
                    >
                        Новая суммаризация
                    </Button>
                </div>
            }

            <Footer/>
        </div>
    );
}