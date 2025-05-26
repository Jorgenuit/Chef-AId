import http.server
import socketserver
import socket
from urllib.parse import urlparse
import os

# from openai import OpenAI
import whisper
import pyktok as pyk

import numpy as np
import pandas as pd

whisperModel = whisper.load_model('base')
tiktokURL = 'https://www.tiktok.com/@shezcooks/video/7424055700164316449?q=food&t=1748256368770'


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
    
    def do_POST(self):
        # OBS! Må slette csv fil på slutten så ingen annen metadata lagres i samme fil


        url = urlparse(self.path).path
        if url != '/':
            print('ERROR: Server does not support POST to other endpoints than root!')
            return self.return_not_implemented()
        
        # 1. Read body with url
        # 2. Check validity of url? Maybe not. Hiv på en try except
        # 3. Download video file (mp4) and get description
        # 4. Send mp4 file to whisper and get text

        metadataFile = 'metadata.csv'

        # Save video and metadata
        savedFiles = pyk.save_tiktok(tiktokURL, True, metadataFile, return_fns=True)
        # Get video file name
        videoFile = savedFiles['video_fn'] 
        # Get description from metadata
        df = pd.read_csv(metadataFile)
        description = df.loc[0, 'video_description']
        # Transcribe video file
        transcription = whisperModel.transcribe(videoFile, fp16=False)
        # Transcribed video
        print(transcription['text'])

        

            

        # print('Request to URL ' + url)
        self.send_response(200)
        self.end_headers()
        return



if __name__ == '__main__':
    # Pyktok config
    # pyk.specify_browser('chrome')

    host = 'localhost'
    port = 8080
    # Start server
    with socketserver.TCPServer((host, int(port)), LogRequestHandler) as server:
        print(f"Serving HTTP on {host} port {port}...")
        server.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server.serve_forever()