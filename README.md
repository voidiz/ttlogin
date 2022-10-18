# ttlogin

Automatically perform matrix authentication when logging into the Tokyo Tech portal. Currently only for Chrome (and other Chromium-based browsers?).

## usage

1. Download the latest .zip file from the [releases page](https://github.com/voidiz/ttlogin/releases) and unzip it.
2. Go to `chrome://extensions` and turn on developer mode (toggle in the top left corner).
3. Click "Load unpacked" and select the unzipped folder.
4. Open the extension from the browser toolbar and fill in your matrix values (the extension automatically moves to the next cell when you have typed a letter).
5. Log in as usual.

## notes

The matrix values are stored locally in the browser (see [Matrix.tsx#L68-L70](https://github.com/voidiz/ttlogin/blob/master/src/components/Matrix.tsx#L68-L70)).
