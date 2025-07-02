# LLM GPU Setup on Debian 12 (Bookworm) with NVIDIA Quadro P1000

This guide will walk you step-by-step through preparing your Debian 12 system to run local large language models (LLMs) using llama.cpp with GPU (CUDA) acceleration on an NVIDIA Quadro P1000.
It includes all necessary dependencies and fixes for common build errors.

---

## 1. System Update

```sh
sudo apt update && sudo apt upgrade -y
```

---

## 2. Install Base Development Tools

```sh
sudo apt install git build-essential cmake python3 python3-pip -y
```

---

## 3. Install Python venv Module (for virtual environments)

```sh
sudo apt install python3.11-venv -y
```

---

## 4. Install CUDA Toolkit (if not already installed)

```sh
sudo apt install nvidia-cuda-toolkit -y
```
> *The system must have the NVIDIA driver installed and the GPU recognized (`nvidia-smi` should show the Quadro P1000).*

---

## 5. Install cURL Development Headers (required for llama.cpp build)

```sh
sudo apt install libcurl4-openssl-dev -y
```

---

## 6. Set Up a Python Virtual Environment (Recommended)

```sh
python3 -m venv llm-env
source llm-env/bin/activate
```

---

## 7. Clone llama.cpp Repository

```sh
git clone https://github.com/ggerganov/llama.cpp.git
cd llama.cpp
```

---

## 8. Build llama.cpp with CUDA (GPU) Support

1. **Always start with a clean build directory:**
    ```sh
    rm -rf build
    mkdir build
    cd build
    ```

2. **Configure with CMake for CUDA:**
    ```sh
    cmake .. -DGGML_CUDA=ON
    ```

3. **Build:**
    ```sh
    cmake --build . --config Release
    ```

---

## 9. Download a Quantized Model (Example: TinyLlama 1.1B Q4_K_M)

```sh
cd ..
mkdir -p models
wget https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf -O models/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf
```

---

## 10. Run Your First LLM Chat

```sh
./build/bin/llama-cli -m models/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf --color -c 2048 -t 4 --temp 0.7 --interactive
```
- `-m`: Path to your GGUF model file.
- `-c 2048`: Context window (can lower if you run out of VRAM).
- `-t 4`: Number of CPU threads (set to number of CPU cores).
- `--interactive`: Enables chat mode.

---

## 11. Monitor GPU Usage

Open a second terminal and run:

```sh
watch -n 1 nvidia-smi
```
You should see activity on the Quadro P1000 when the model is running.

---

## 12. Troubleshooting

- If you get build or dependency errors, ensure all the following are installed:
    - `build-essential`, `cmake`, `git`
    - `python3`, `python3-pip`, `python3.11-venv`
    - `libcurl4-openssl-dev`
    - `nvidia-cuda-toolkit`
    - NVIDIA proprietary driver (verify with `nvidia-smi`)
- If you change CMake build options, always delete and recreate the `build/` directory.
- For out-of-memory errors, use a smaller model or lower the `-c` (context) value.

---

## References

- [llama.cpp official build guide](https://github.com/ggerganov/llama.cpp/blob/master/docs/build.md)
- [TheBloke HuggingFace models](https://huggingface.co/TheBloke)
- [CUDA toolkit for Debian](https://developer.nvidia.com/cuda-downloads)

---
