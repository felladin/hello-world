# LLM GPU Setup Summary for Debian + Quadro P1000

**Date:** 2025-06-26  
**User:** felladin

---

## System Overview

- **Hardware:** HP 8200 Elite SFF
- **OS:** Debian 12 (Bookworm), installed using Netinstall with only SSH and base system.
- **Incoming GPU:** NVIDIA Quadro P1000 (4GB, Pascal, PCIe 3.0 x16, low-profile)
- **Purpose:** Running and experimenting with local LLMs and AI agents
- **Constraints:** SFF, low power, only one PCIe x16 slot, no extra GPU power connector

---

## Current Preparation Steps (Before GPU Arrival)

- Debian repositories enabled: `main`, `contrib`, `non-free`, `non-free-firmware`, and `backports`
- Base packages installed:  
  `build-essential`, `dkms`, `linux-headers-$(uname -r)`, `software-properties-common`, `wget`, `curl`
- NVIDIA driver not installed (waiting for GPU)
- CUDA toolkit can be pre-installed (but GPU/driver required for testing)

---

## Planned Actions (On GPU Arrival)

1. **Physically install the Quadro P1000**
2. **Install NVIDIA driver:**
   - Standard:  
     `sudo apt install nvidia-driver -y`
   - For latest via backports:  
     `sudo apt -t bookworm-backports install nvidia-driver -y`
3. **Reboot and verify installation:**  
   `nvidia-smi` (should display Quadro P1000)
4. **(Optional) Install CUDA toolkit:**  
   `sudo apt install nvidia-cuda-toolkit -y`  
   *(or use NVIDIA's official site for the newest version)*
5. **Test LLM frameworks:**  
   - Choices: `llama.cpp`, `Ollama`, `text-generation-webui`, etc.
   - Use quantized models that fit in 4GB VRAM

---

## Key Technical Points

- **Quadro P1000**:  
  - CUDA Compute Capability 6.1 (Pascal)
  - No Tensor Cores (AI matrix acceleration only available on Turing/Ampere+)
- **Tensor Cores**:  
  - Absent on P1000; present on newer GPUs for much faster AI math
- **CUDA Toolkit vs. Driver**:  
  - Most LLM tools require only the NVIDIA driver.
  - CUDA toolkit is needed for compiling CUDA code, not just for running prebuilt binaries.
- **Installation Order**:  
  - Prepping system and installing toolkit is fine before GPU arrives.
  - `nvidia-smi` and GPU compute work only after hardware and driver are present.
- **System Info Gathering**:  
  - Suggested a script for collecting system details (CPU, RAM, PCI devices, drivers, CUDA, etc.) before and after GPU install for tailored troubleshooting and setup.

---

## Next Steps (for Future Reference)

- After GPU install, run the diagnostic script and share output for further advice.
- Proceed with driver + toolkit setup.
- Begin LLM experimentation with frameworks and quantized models suitable for 4GB VRAM and Pascal architecture.

---

*This summary contains all necessary hardware, software, and configuration context for efficient follow-up or hand-off. Update with new system info after GPU installation for best results!*
