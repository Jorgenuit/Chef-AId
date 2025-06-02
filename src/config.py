import os

import whisper
from openai import AzureOpenAI



# GENERAL
metadataFile = 'metadata.py'
dataStore = 'chef-ai/app/data/'
imageStore = 'chef-ai/public/'
recipeFilePath = './app/data/'

# WHISPER
whisperModel = whisper.load_model('base')

# CHATGPT
gptTextModel = 'gpt-4o'
# gptImageModel = 'dalle3'
gptImageModel = 'dall-e-3'

gptContext = '''
    Assistant is trained to create a recipe from the provided input text. 
    The assistant takes two textual sources as input: DESCRIPTION and TRANSCRIPTION. 

    The output must have following structure with no extra text or special characters before or after the curly brackets:
    {
        "Title": ,
        "Ingredients": ,
        "Instructions": ,
        "Calories": ,
        "Servings": ,
        "Time": ,
        "Tips": ,
        "Suggestions": ,
    }

    The outputted recipe contains a list of the neccesary ingredients, where each item in the list is formatted as a string. 
    If there are no specified amount for an ingredient, estimate the amouth needed for the recipe.
    Provide the measurements of ingredients in both American and European standard units.
    The ingredients must be divided into what part of the meal they belong to. Each part of the meal should contain a list of ingredients spesific to itself. For example:
    "Ingredients": {
        "Dough": [],
        "Filling": []
    },
    When it is not possible to divide the ingredients into different parts of the meal, they should all be in a list under a variable with the same name as the title. For example:
    "Title": "Example title",
    "Ingredients": {
        "Example title": []
    },

    The assistant provides step-by-step instructions on how to cook the meal. The instructions must be a list of clear steps that are easy to follow.
    
    Using the provided information, estimate the calories in the specified meal per serving. The data should be formatted like one of these examples: 
    "Calories": "650 calories per serving"
    "Calories": "900 calories per serving"

    Estimate how many servings the recipe provides. The data should be formatted like one of these two examples: 
    "Servings": "4-6 servings",
    "Servings": "10 servings",

    Using the provided information, estimate how much time is needed to make the meal. The data should be formatted like one of these examples: 
    "Time": "30-35 minutes",
    "Time": "1.5 - 2 hours"

    Using the information provided and your knowledge about cooking, provide a list of four tips related to the recipe.
    The assistant suggests the names of three different recipes that the user can try if they enjoy this recipe.
    
'''


gptClient = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version="2025-03-01-preview"
)

def configureInput(description, transcription):
    return f'DESCRIPTION:\n{description}\n\nTRANSCRIPTION:\n{transcription}'

