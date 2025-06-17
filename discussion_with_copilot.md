# Summary of Discussion

## 1. Curly Brackets in Code Style
- You expressed a preference for always using curly brackets in code, which is considered a best practice.

## 2. Outlook vs. ServiceNow for Data Security
- Both Outlook and ServiceNow are robust in securing personal data, but the best choice depends on configuration and organizational needs.

## 3. Information Sharing Between Agents
- Storing information in structured ServiceNow tables is preferable to using Outlook/emails due to better centralization, auditability, and workflow integration.

## 4. Playing Doom in ServiceNow via js-dos
- It is technically possible to play Doom (or similar shooters) in a ServiceNow widget by embedding a JavaScript DOS emulator (js-dos) and providing a compatible DOOM DOS binary and WAD file.
- You were provided with example widget HTML code for embedding js-dos and instructions to host your `doom.zip` file somewhere accessible.

## 5. Building doom.zip for js-dos
- Detailed steps were provided for creating a `doom.zip` archive, including obtaining a DOS executable and WAD, packaging them, and uploading to ServiceNow.

## 6. Compiling DOOM from Source
- Instructions were given for compiling the original [id-Software/DOOM](https://github.com/id-Software/DOOM) source code with DJGPP in DOSBox.
- It was noted that this is non-trivial and that using prebuilt DOS binaries is often easier for js-dos.

## 7. Chocolate Doom and js-dos Compatibility
- The Windows 64-bit build of Chocolate Doom (e.g., `chocolate-doom-3.1.0-win64.zip`) cannot run in js-dos since js-dos only supports DOS executables, not Windows binaries.

## 8. JavaScript Versions of Doom and Wolfenstein 3D
- Several JavaScript/WebAssembly ports of Doom and Wolfenstein 3D were mentioned:
  - **js-dos:** Runs DOS binaries in the browser (not a native JS rewrite).
  - **DoomJS (Phoboslab):** Once popular, but the demo site is often offline or archived.
  - **Emscripten/WebAssembly ports:** Such as wasm4doom and Emscripten official Doom demo.
  - **Wolf3D.js:** A JavaScript port for Wolfenstein 3D.
- Note: The link to DoomJS (Phoboslab) is likely broken or the demo offline as of 2025.

## 9. General Notes
- Legal and technical considerations for using and distributing DOOM files were discussed.
- You were offered help with links to shareware versions or further integration/code samples.

---

**Broken/Offline Link Note:**  
- The Phoboslab DoomJS demo ([https://phoboslab.org/doomjs/](https://phoboslab.org/doomjs/)) is likely unavailable or archived.
