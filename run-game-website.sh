#!/bin/bash

# Simple shell script to run the game website server

# Make sure Node.js is installed
if ! command -v node &> /dev/null
then
    echo "Node.js could not be found. Please install Node.js before running this script."
    exit 1
fi

# Run the web server
echo "Starting game website server..."
node web-game-server.js