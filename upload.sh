#!/bin/bash

# Check if the user provided a file path as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 <path_to_mp3_file>"
  exit 1
fi

# Extract the file path from the first argument
file_path="$1"

# Check if the provided file exists
if [ ! -f "$file_path" ]; then
  echo "Error: The specified file does not exist."
  exit 1
fi

# Make the cURL request to the /upload endpoint
upload_url="http://localhost:3000/file-upload"
# -F posts as form data
# and we also provide the correct mime type otherwise the server will complain
curl -X POST -F "file=@$file_path;type=audio/mpeg" $upload_url
