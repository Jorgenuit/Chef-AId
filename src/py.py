import http.server
import socketserver
import socket
from urllib.parse import urlparse
import os

import whisper
import pyktok as pyk
from openai import AzureOpenAI

import numpy as np
import pandas as pd

import base64
# from config import gptModel, metadataFile, whisperModel, gptClient
import config as cf

# whisperModel = whisper.load_model('base')
# exampleTiktokURL = 'https://www.tiktok.com/@shezcooks/video/7424055700164316449?q=food&t=1748256368770'
exampleTiktokURL = 'https://www.tiktok.com/@sivanskitchen/video/7453908585282571550'
# gptModel = 'gpt-4o'


class LogRequestHandler(http.server.SimpleHTTPRequestHandler):
    def return_not_implemented(self):
        self.send_response(501)
        self.end_headers()
    
    def do_GET(self):
        return super().do_GET()
    
    def do_HEAD(self):
        return super().do_HEAD()
    
    def do_PUT(self):
        return self.return_not_implemented()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-type, Authorization")
        self.end_headers()
        return

    def do_POST(self):
        # OBS! Må slette csv fil på slutten så ingen annen metadata lagres i samme fil


        # url = urlparse(self.path).path
        # if url != '/':
        #     print('ERROR: Server does not support POST to other endpoints than root!')
        #     return self.return_not_implemented()
        
        contentLength = int(self.headers['content-length'])
        tiktokURL = self.rfile.read(contentLength).decode('utf-8')
        # tiktokURL = exampleTiktokURL  # DEBUG

        # 1. Read body with url - VENT
        # 2. Check validity of url? Maybe not. Hiv på en try except
        
        # 3. Download video file (mp4)
        videoFile = pyk.save_tiktok(tiktokURL, True, cf.metadataFile, return_fns=True)['video_fn']
        # 3a. Get transcription
        transcription = cf.whisperModel.transcribe(videoFile, fp16=False)['text']
        # 3b. Get description
        description = pd.read_csv(cf.metadataFile).loc[0, 'video_description']

        # 4. Prompt chatGPT for recipe
        textGen = cf.gptClient.chat.completions.create(
            model=cf.gptModel,
            messages=[
                {'role': 'system', 'content': cf.gptContext},
                {'role': 'user', 'content': cf.configureInput(description=description, transcription=transcription)}
            ]
        )
        print(textGen.choices[0].message.content)

        # imageGen = cf.gptClient.chat.completions.create(
        #     model=cf.gptModel,
        #     messages=[
        #     {
        #         "role": "system", 
        #         "content": "You are an expert image creator. Generate high-quality images based on descriptions."
        #     },
        #     {
        #         "role": "user", 
        #         "content": "Create an image of a cripsy rice salad"
        #     }
        #     ],
        #     max_tokens=1000
        # )

        # print(imageGen.choices[0].message)

        # imageGen = cf.gptClient.responses.create(
        #     model=cf.gptModel,
        #     input='Crispy rice salad',
        #     tools=[{'type': 'image_generation'}],
        # )

        # image_data = [
        #     output.result
        #     for output in imageGen.output
        #     if output.type == 'image_generation_call'
        # ]
        # if image_data:
        #     image_base64 = image_data[0]
        #     with open("otter.png", "wb") as f:
        #         f.write(base64.b64decode(image_base64))

        # 5. Clean up downloaded files
        os.remove(cf.metadataFile)
        os.remove(videoFile)



        # Save video and metadata
        # savedFiles = pyk.save_tiktok(tiktokURL, True, metadataFile, return_fns=True)
        # Get video file name
        # videoFile = savedFiles['video_fn'] 
        # Get description from metadata
        # df = pd.read_csv(metadataFile)
        # description = df.loc[0, 'video_description']
        # Transcribe video file
        # transcription = whisperModel.transcribe(videoFile, fp16=False)
        # transcription = transcription['text']
        # Transcribed video
        # print(description)
        # print(transcription)

        # print('Setting up GPT client')
        # client = AzureOpenAI(
        #     azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        #     api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        #     api_version="2025-01-01-preview"
        # )

        # print('Promting ChatGPT')
        # response = client.chat.completions.create(
        #     model=gptModel,
        #     messages=[
        #         {'role': 'system', 'content': 'Assistant is trained to create a recipe from the provided input text. The assistant takes two textual sources as input: DESCRIPTION and TRANSCRIPTION. The outputted recipe contains a list of the neccesary ingredients and a step-by-step instruction on how to cook the meal.'},
        #         {'role': 'user', 'content': 'DESCRIPTION: ' + description + '\nTRANSCRIPTION: ' + transcription}
        #     ]
        # )

        # print(response.choices[0].message.content)
        

            

        # print('Request to URL ' + url)
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-type', 'application/json')
        self.end_headers()

        self.wfile.write(textGen.choices[0].message.content.encode()) # Kanskje
        return



if __name__ == '__main__':

    host = 'localhost'
    port = 8080
    # Start server
    with socketserver.TCPServer((host, int(port)), LogRequestHandler) as server:
        print(f"Serving HTTP on {host} port {port}...")
        server.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server.serve_forever()