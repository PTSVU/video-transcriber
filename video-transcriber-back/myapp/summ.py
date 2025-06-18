import torch
from accelerate import Accelerator
from langdetect import detect
from transformers import BartForConditionalGeneration, BartTokenizer

from .transl import lang_map, translate

accelerator = Accelerator()
device = accelerator.device

bart_model_name = "facebook/bart-large-cnn"
bart_tokenizer = BartTokenizer.from_pretrained(bart_model_name)
bart_model = BartForConditionalGeneration.from_pretrained(bart_model_name).to(device)


def summarize_auto(text, max_length=300):
    lang = detect(text)
    src_lang_code = lang_map.get(lang, "en_XX")
    need_translate = src_lang_code != "en_XX"

    # Перевод на английский, если нужно
    if need_translate:
        text_en = translate(text, src_lang_code, "en_XX")
    else:
        text_en = text

    inputs = bart_tokenizer([text_en], max_length=2048, return_tensors='pt', truncation=True).to(device)
    with torch.no_grad():
        summary_ids = bart_model.generate(
            inputs["input_ids"],
            num_beams=4,
            max_length=max_length,
            early_stopping=True
        )
    summary_en = bart_tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    if need_translate:
        summary = translate(summary_en, "en_XX", src_lang_code)
    else:
        summary = summary_en

    return summary
