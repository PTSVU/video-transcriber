from django.core.cache import cache
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .transl import translate


@csrf_exempt
def translate_view(request):
    if request.method == 'POST':
        text = request.POST.get('text')
        src_lang = request.POST.get('src_lang', 'auto')
        tgt_lang = request.POST.get('tgt_lang')
        if not text or not tgt_lang:
            return JsonResponse({'error': 'Missing text or target language'}, status=400)
        cache_key = f"translation:{src_lang}:{tgt_lang}:{text}"
        translated = cache.get(cache_key)
        if translated is not None:
            return JsonResponse({'text': translated})
        try:
            print(f"Translating text: {text}\n\nfrom {src_lang} to {tgt_lang}")
            translated = translate(text, src_lang, tgt_lang)
            cache.set(cache_key, translated, timeout=60 * 60)
            return JsonResponse({'text': translated})
        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=400)
