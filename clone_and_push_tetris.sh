#!/bin/bash

# === User variables ===
# Replace 'YOUR_USERNAME' and the repo names as desired
YOUR_USERNAME="your_github_username"
REPO1_NAME="my-react-tetris"
REPO2_NAME="my-js-tetris"

# === Repo sources ===
REACT_TETRIS_SRC="https://github.com/chvin/react-tetris.git"
JS_TETRIS_SRC="https://github.com/jakesgordon/javascript-tetris.git"

# === 1. Clone React Tetris ===
git clone "$REACT_TETRIS_SRC"
cd react-tetris
git remote remove origin
git remote add origin "https://github.com/$YOUR_USERNAME/$REPO1_NAME.git"
git push -u origin master || git push -u origin main
cd ..

# === 2. Clone JS Tetris ===
git clone "$JS_TETRIS_SRC"
cd javascript-tetris
git remote remove origin
git remote add origin "https://github.com/$YOUR_USERNAME/$REPO2_NAME.git"
git push -u origin master || git push -u origin main
cd ..

echo "All done! Check your GitHub repos for the code."
