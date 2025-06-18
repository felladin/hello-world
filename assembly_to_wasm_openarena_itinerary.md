# Learning and Building OpenArena with WebAssembly: Step-by-Step Itinerary

This guide will walk you through learning Assembly, installing Emscripten on Debian, forking OpenArena, and building a WebAssembly version to launch from a web page.

---

## 1. Learn Assembly Language Basics

- **Resource:** [Codecademy Assembly Language Course](https://www.codecademy.com/courses/computer-architecture-assembly-language/lessons/assembly-language/exercises/modern-assembly-applications)
- **Goal:** Complete the lesson to understand Assembly syntax, registers, memory addressing, and modern application.
- **Tip:** Take notes on how low-level concepts map to high-level constructs.

---

## 2. Install Emscripten on Debian

- **Resource:** [Emscripten: Downloads and Installation](https://emscripten.org/docs/getting_started/downloads.html)
- **Steps:**
    1. Open a terminal on your Debian machine.
    2. Install prerequisites:
        ```bash
        sudo apt update
        sudo apt install git cmake python3 python3-pip nodejs npm
        ```
    3. Clone the Emscripten SDK:
        ```bash
        git clone https://github.com/emscripten-core/emsdk.git
        cd emsdk
        ```
    4. Install and activate the latest SDK:
        ```bash
        ./emsdk install latest
        ./emsdk activate latest
        source ./emsdk_env.sh
        ```
    5. Confirm installation:
        ```bash
        emcc --version
        ```

---

## 3. Fork and Clone OpenArena

- **Resource:** [OpenArena/engine GitHub](https://github.com/OpenArena/engine)
- **Steps:**
    1. Fork the repository on GitHub via the web interface.
    2. On your Debian system, clone your fork:
        ```bash
        git clone https://github.com/YOUR_USERNAME/engine.git openarena-engine
        cd openarena-engine
        ```
    3. Add the upstream repository:
        ```bash
        git remote add upstream https://github.com/OpenArena/engine.git
        ```

---

## 4. Build OpenArena with Emscripten for WebAssembly

- **Resources:**
    - [WebAssembly.org Developer's Guide](https://webassembly.org/getting-started/developers-guide/)
    - [MDN: Compiling C/C++ to Wasm](https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Existing_C_to_Wasm)
- **Steps:**
    1. In your OpenArena engine directory, set up the build:
        ```bash
        mkdir build && cd build
        ```
    2. Run CMake with Emscripten:
        ```bash
        emcmake cmake ..
        ```
    3. Build the project:
        ```bash
        emmake make
        ```
    4. Look for `.wasm` and associated `.js` glue files in the build output.

---

## 5. Create a Web Page to Test OpenArena in WebAssembly

- **Steps:**
    1. Write a simple HTML file to load and run the WebAssembly build:
        ```html
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>OpenArena WebAssembly Test</title>
        </head>
        <body>
            <h1>OpenArena WebAssembly Test</h1>
            <script src="openarena.js"></script>
            <script>
                // Emscripten-provided JS will instantiate the WASM and handle the main loop
            </script>
        </body>
        </html>
        ```
    2. Serve the directory with a local web server (important for Wasm):
        ```bash
        python3 -m http.server 8080
        ```
    3. Open `http://localhost:8080/` in your browser to test.

---

## 6. Troubleshooting and Next Steps

- Read [Emscripten documentation](https://emscripten.org/docs/getting_started/downloads.html) for build options.
- Consult [MDN’s C/C++ to Wasm guide](https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Existing_C_to_Wasm) for optimization and integration tips.
- Explore the [WebAssembly Developer’s Guide](https://webassembly.org/getting-started/developers-guide/) for deeper understanding.

---

## 7. Share and Iterate

- Commit your changes and push to your fork on GitHub.
- Optionally, create a GitHub Pages site or similar to share your demo.

---

**Tip:** Not all native OpenArena features may work in the browser due to system dependencies (e.g., graphics, input, file access). Experiment, and consider starting with simple engine components or demos.

---

Congratulations! You now have a roadmap from Assembly basics to running a classic open source FPS in your browser with WebAssembly.
