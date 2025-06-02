import http.server
import socketserver
import socket
from urllib.parse import urlparse
import uuid

import os
import requests
import json

import pyktok as pyk
import pandas as pd
import config as cf

# exampleTiktokURL = 'https://www.tiktok.com/@shezcooks/video/7424055700164316449?q=food&t=1748256368770' # DEBUG
# exampleTiktokURL = 'https://www.tiktok.com/@sivanskitchen/video/7453908585282571550' # DEBUG


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

        url = urlparse(self.path).path
        if url != '/':
            print('ERROR: Server does not support POST to other endpoints than root!')
            return self.return_not_implemented()
        
        contentLength = int(self.headers['content-length'])
        tiktokURL = self.rfile.read(contentLength).decode('utf-8')
        # tiktokURL = exampleTiktokURL  # DEBUG

        # 1. Read body with url - VENT
        # 2. Check validity of url? Hiv på en try except
        
        # 3. Download video file (mp4)
        videoFile = pyk.save_tiktok(tiktokURL, True, cf.metadataFile, return_fns=True)['video_fn']
        # 3a. Get transcription
        transcription = cf.whisperModel.transcribe(videoFile, fp16=False)['text']
        # 3b. Get description
        description = pd.read_csv(cf.metadataFile).loc[0, 'video_description']

        # 4. Prompt chatGPT for recipe
        textGen = cf.gptClient.chat.completions.create(
            model=cf.gptTextModel,
            messages=[
                {'role': 'system', 'content': cf.gptContext},
                {'role': 'user', 'content': cf.configureInput(description=description, transcription=transcription)}
            ]
        )
        recipeJsonString = textGen.choices[0].message.content
        print(recipeJsonString)


        # Save file to file system
        recipe = json.loads(recipeJsonString)
        newFile = recipe['Title'].lower().replace(' ', '_')

        newRecipe = {
            "Id": str(uuid.uuid4()),
            "Name": recipe['Title'],
            "FilePath": cf.recipeFilePath + newFile + '.json',
            "ImagePath": '/' + newFile + '.png',
            "VideoPath": '/' + newFile + '.mp4'
        }


        # Read index file
        with open(cf.dataStore + 'index.json', 'r') as f:
            data = json.load(f)
            data.append(newRecipe)
        # Update index file
        with open(cf.dataStore + 'index.json', 'w') as f:
            json.dump(data, f, indent=6)

        # Create new file for recipe
        with open(cf.dataStore + newFile + '.json', 'w') as f:
            json.dump(recipe, f, indent=6)

        # Create recipe image
        imageGen = cf.gptClient.images.generate(
            model=cf.gptImageModel,
            prompt=f'''
                Using the following subsections which contains information about a recipe, grenerate an image representative of the finished meal.
                Title: 
                {str(recipe['Title'])}

                Ingredients:
                {str(recipe['Ingredients'])}

                Instructions:
                {str(recipe['Instructions'])}
            ''',
            n=1
        )
        json_response = json.loads(imageGen.model_dump_json())
        image_url = json_response['data'][0]['url']
        generated_image = requests.get(image_url).content 
        with open(cf.imageStore + newFile + '.png', "wb") as image_file:
            image_file.write(generated_image)


        # Create recipe video
        os.rename(videoFile, cf.imageStore + newFile + '.mp4')

        # 5. Clean up downloaded files
        os.remove(cf.metadataFile)

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