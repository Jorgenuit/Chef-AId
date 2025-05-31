import os

import whisper
from openai import AzureOpenAI



# GENERAL
metadataFile = 'metadata.py'

# WHISPER
whisperModel = whisper.load_model('base')

# CHATGPT
gptModel = 'gpt-4o'
gptContext = '''
    Assistant is trained to create a recipe from the provided input text. 
    The assistant takes two textual sources as input: DESCRIPTION and TRANSCRIPTION. 
    The outputted recipe contains a list of the neccesary ingredients and a step-by-step instruction on how to cook the meal.
    The output must have the following structure with no extra text or special characters before or after the curly brackets:
    {
        "Title": ,
        "Ingredients": ,
        "Instructions":
    }
    
'''

gptClient = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version="2025-03-01-preview"
)

def configureInput(description, transcription):
    return f'DESCRIPTION:\n{description}\n\nTRANSCRIPTION:\n{transcription}'

