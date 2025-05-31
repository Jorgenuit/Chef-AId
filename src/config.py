import os

import whisper
from openai import AzureOpenAI



# GENERAL
metadataFile = 'metadata.py'
dataStore = 'chef-ai/app/data/'
recipeFilePath = './app/data/'

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

    The ingredients must be divided into what part of the meal they belong to. Each part of the meal should contain a list of ingredients spesific to itself. For example:
    {
        "Title": ,
        "Ingredients": {
            "Dough": [],
            "Filling": []
        },
        "Instructions":
    }
    When it is not possible to divide the ingredients into different parts of the meal, they should all be in a list under a variable with the same name as the title. For example:
    {
        "Title": "Example title",
        "Ingredients": {
            "Example title": []
        },
        "Instructions":
    }

    The instructions must be a list of strings.
    
'''

gptClient = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version="2025-03-01-preview"
)

def configureInput(description, transcription):
    return f'DESCRIPTION:\n{description}\n\nTRANSCRIPTION:\n{transcription}'

