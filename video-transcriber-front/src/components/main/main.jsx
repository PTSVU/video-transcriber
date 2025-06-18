import {useState} from 'react';
import {Button, TextField, Typography, MenuItem, Select, FormControl, InputLabel, Box} from '@mui/material';
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

const LANGS = [
    "ar", "cs", "de", "en", "es", "et", "fi", "fr", "gu", "hi", "it", "ja", "kk", "ko", "lt", "lv", "my", "ne", "nl", "ro", "ru", "si", "tr", "vi", "zh", "af", "az", "bn", "fa", "he", "hr", "id", "ka", "km", "mk", "ml", "mn", "mr", "pl", "ps", "pt", "sv", "sw", "ta", "te", "th", "tl", "uk", "ur", "xh", "gl", "sl"
];

export default function Main() {
    const [inputText, setInputText] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultText, setResultText] = useState(null);
    const [srcLang, setSrcLang] = useState('auto');
    const [tgtLang, setTgtLang] = useState('en');

    const phrases = [
        "Привет, мир!",
        "Translator - это инструмент для перевода текста."
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
        formData.append('src_lang', srcLang);
        formData.append('tgt_lang', tgtLang);

        fetch('http://localhost:7777/api/translate/', {
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
                Translator - это инструмент для перевода текста.
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
                        <Box sx={{display: 'flex', gap: 2, mb: 2}}>
                            <FormControl sx={{minWidth: 120}}>
                                <InputLabel id="src-lang-label">Исходный</InputLabel>
                                <Select
                                    labelId="src-lang-label"
                                    value={srcLang}
                                    label="Исходный"
                                    onChange={e => setSrcLang(e.target.value)}
                                    size="small"
                                >
                                    <MenuItem value="auto">auto</MenuItem>
                                    {LANGS.map(l => (
                                        <MenuItem key={l} value={l}>{l}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl sx={{minWidth: 120}}>
                                <InputLabel id="tgt-lang-label">Перевести на</InputLabel>
                                <Select
                                    labelId="tgt-lang-label"
                                    value={tgtLang}
                                    label="Перевести на"
                                    onChange={e => setTgtLang(e.target.value)}
                                    size="small"
                                >
                                    {LANGS.map(l => (
                                        <MenuItem key={l} value={l}>{l}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <TextField
                            label="Введите текст для перевода"
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
                            Перевести
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
                        Новый перевод
                    </Button>
                </div>
            }

            <Footer/>
        </div>
    );
}