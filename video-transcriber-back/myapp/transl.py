import torch
from accelerate import Accelerator
from langdetect import detect
from transformers import MBart50TokenizerFast, MBartForConditionalGeneration

accelerator = Accelerator()
device = accelerator.device

mbart_model_name = "facebook/mbart-large-50-many-to-many-mmt"
mbart_tokenizer = MBart50TokenizerFast.from_pretrained(mbart_model_name)
mbart_model = MBartForConditionalGeneration.from_pretrained(mbart_model_name).to(device)

lang_map = {
    "ar": "ar_AR",
    "cs": "cs_CZ",
    "de": "de_DE",
    "en": "en_XX",
    "es": "es_XX",
    "et": "et_EE",
    "fi": "fi_FI",
    "fr": "fr_XX",
    "gu": "gu_IN",
    "hi": "hi_IN",
    "it": "it_IT",
    "ja": "ja_XX",
    "kk": "kk_KZ",
    "ko": "ko_KR",
    "lt": "lt_LT",
    "lv": "lv_LV",
    "my": "my_MM",
    "ne": "ne_NP",
    "nl": "nl_XX",
    "ro": "ro_RO",
    "ru": "ru_RU",
    "si": "si_LK",
    "tr": "tr_TR",
    "vi": "vi_VN",
    "zh": "zh_CN",
    "af": "af_ZA",
    "az": "az_AZ",
    "bn": "bn_IN",
    "fa": "fa_IR",
    "he": "he_IL",
    "hr": "hr_HR",
    "id": "id_ID",
    "ka": "ka_GE",
    "km": "km_KH",
    "mk": "mk_MK",
    "ml": "ml_IN",
    "mn": "mn_MN",
    "mr": "mr_IN",
    "pl": "pl_PL",
    "ps": "ps_AF",
    "pt": "pt_XX",
    "sv": "sv_SE",
    "sw": "sw_KE",
    "ta": "ta_IN",
    "te": "te_IN",
    "th": "th_TH",
    "tl": "tl_XX",
    "uk": "uk_UA",
    "ur": "ur_PK",
    "xh": "xh_ZA",
    "gl": "gl_ES",
    "sl": "sl_SI",
}


def translate(text, src_lang, tgt_lang, max_length=2048):
    tgt_lang = lang_map.get(tgt_lang, "en_XX")
    if src_lang == "auto":
        src_lang = detect(text)
        src_lang = lang_map.get(src_lang, "en_XX")
    print(f"src_lang: {src_lang}, tgt_lang: {tgt_lang}")
    mbart_tokenizer.src_lang = src_lang
    inputs = mbart_tokenizer(text, return_tensors="pt", max_length=max_length, truncation=True).to(device)
    with torch.no_grad():
        generated_tokens = mbart_model.generate(
            **inputs,
            forced_bos_token_id=mbart_tokenizer.lang_code_to_id[tgt_lang],
            max_length=max_length
        )
    return mbart_tokenizer.decode(generated_tokens[0], skip_special_tokens=True)
