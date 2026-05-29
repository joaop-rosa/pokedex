#!/bin/bash
PORT=$(cat "$HOME/.securecoder/api.json" | grep -o '"port":[0-9]*' | grep -o '[0-9]*')
if [ -z "$PORT" ]; then 
  echo "SecureCoder PORT not found"
  exit 1
fi

curl -s -X POST http://127.0.0.1:$PORT/dependency/scan \
  -H 'Content-Type: application/json' \
  -d '{ "registry": "npm", "packages": [
        {"package": "vite"},
        {"package": "@vitejs/plugin-react"},
        {"package": "@generouted/react-router"},
        {"package": "react"},
        {"package": "react-dom"},
        {"package": "react-router-dom"},
        {"package": "typescript"},
        {"package": "@types/node"},
        {"package": "@types/react"},
        {"package": "@types/react-dom"},
        {"package": "axios"},
        {"package": "classnames"},
        {"package": "d3"},
        {"package": "lodash"},
        {"package": "react-use"},
        {"package": "socket.io-client"}
   ]}'
