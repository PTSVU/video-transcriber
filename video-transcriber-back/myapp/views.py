import hashlib
import os

from django.core.cache import cache
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .transk import transcribe_media


@csrf_exempt
def transcribe_view(request):
    if request.method == 'POST' and request.FILES.get('file'):
        file = request.FILES['file']
        file_content = file.read()
        file_hash = hashlib.sha256(file_content).hexdigest()
        ai_model = request.POST.get('model', 'turbo')
        ai_model_hash = hashlib.sha256(ai_model.encode()).hexdigest()
        cache_transk_key = f"transcription_{file_hash}_{ai_model_hash}"

        print(f"Using AI model: {ai_model}")

        cached_text = cache.get(cache_transk_key)
        if cached_text:
            text = cached_text
        else:
            file_path = f'/tmp/{file.name}'
            with open(file_path, 'wb+') as destination:
                destination.write(file_content)

            text = transcribe_media(file_path, model_name=ai_model)
            os.remove(file_path)
            cache.set(cache_transk_key, text, timeout=60 * 60)  # кеш на 1 час

        print(f"Transcription generated: {text}")
        return JsonResponse({'text': text})
    return JsonResponse({'error': 'No file uploaded'}, status=400)
