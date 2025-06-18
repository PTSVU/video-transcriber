import hashlib
import os

from django.core.cache import cache
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from langdetect import detect

from .summ import summarize_auto


@csrf_exempt
def summarize_view(request):
    if request.method == 'POST':
        text = request.POST.get('text')
        if not text:
            return JsonResponse({'error': 'No text provided'}, status=400)
        if detect(text) != 'en':
            return JsonResponse({'text': 'Text must be in English'})
        text_hash = hashlib.sha256(text.encode()).hexdigest()
        cache_summ_key = f"summarization_{text_hash}"

        cached_summary = cache.get(cache_summ_key)
        if cached_summary:
            return JsonResponse({'text': cached_summary})

        summary = summarize_auto(text)
        cache.set(cache_summ_key, summary, timeout=60 * 60)
        print(f"Summary generated: {summary}")
        return JsonResponse({'text': summary})
    return JsonResponse({'error': 'Invalid request method'}, status=400)
