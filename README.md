# Chef AId
Chef AId is an app that uses a TikTok recipe video and converts it into a written formatted recipe page using AI.

# How to run

## Requirements
- React
- Next.js
- Python
- Azure OpenAI API key with GPT-4o and DALL-E 3 deployed
- Whisper

## Install
In the source directory run the commands:

``` bash
pip install -r requirements.txt
```

In the chef-ai directory run:
``` bash
npm i
```

You will also need to set up your API key and Endpoint as an Enviroment variable with the names `AZURE_OPENAI_API_KEY` & `AZURE_OPENAI_ENDPOINT` respectively. 

# How to use
Start the backend server by moving to the src directory and using the command:
``` bash
python server.py
```

Start the React server by running the command:
```bash
npm run dev
```
Now you are ready to generate recipes! Go to your web browser, enter `http//localhost:3000` and paste your recipe URL!