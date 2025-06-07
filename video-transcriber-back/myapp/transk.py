import whisper
from accelerate import Accelerator
from moviepy import VideoFileClip
import os

accelerator = Accelerator()
device = accelerator.device

def is_video_file(file_path):
    video_extensions = ['.mp4', '.mov', '.mkv', '.avi', '.webm']
    return os.path.splitext(file_path)[1].lower() in video_extensions

def extract_audio_from_video(video_path, output_audio_path):
    """Извлекает аудио из видео"""
    video = VideoFileClip(video_path)
    video.audio.write_audiofile(output_audio_path, codec='aac')

def transcribe_media(file_path, model_name="turbo"):
    """
    Метод: принимает видео или аудио файл и возвращает транскрипцию.
    """
    temp_audio_path = None

    if is_video_file(file_path):
        temp_audio_path = file_path.rsplit('.', 1)[0] + "_temp_audio.m4a"
        extract_audio_from_video(file_path, temp_audio_path)
        audio_input_path = temp_audio_path
    else:
        audio_input_path = file_path

    model = whisper.load_model(model_name).to(device)

    result = model.transcribe(audio_input_path)

    if temp_audio_path and os.path.exists(temp_audio_path):
        os.remove(temp_audio_path)

    return result['text']
