# MaskMeister

<!-- [![Version](https://vsmarketplacebadge.apphb.com/version/henrikroschmann.maskmeister.svg)](https://marketplace.visualstudio.com/items?itemName=henrikroschmann.maskmeister)
[![Installs](https://vsmarketplacebadge.apphb.com/installs/henrikroschmann.maskmeister.svg)](https://marketplace.visualstudio.com/items?itemName=henrikroschmann.maskmeister)
[![Ratings](https://vsmarketplacebadge.apphb.com/rating/henrikroschmann.maskmeister.svg)](https://marketplace.visualstudio.com/items?itemName=henrikroschmann.maskmeister) -->

MaskMeister is a Visual Studio Code extension that allows you to mask and unmask code by replacing sensitive information with placeholders. This helps protect sensitive data when sharing code snippets with others.

## Features

- Mask sensitive information in your code
- Unmask the code to reveal the original content
- Edit the keywords used for masking and unmasking

## Usage

1. Install the MaskMeister extension in Visual Studio Code
2. Open the file containing the code you want to mask
3. To mask your code, use one of the following methods:
   - Press `Ctrl+Shift+P` and run the `Mask Code` command
   - Right-click and select `Mask Code` from the context menu
4. To unmask your code, use one of the following methods:
   - Press `Ctrl+Shift+P` and run the `Unmask Code` command
   - Right-click and select `Unmask Code` from the context menu
5. To edit the keywords used for masking and unmasking:
   - Press `Ctrl+Shift+P` and run the `Edit Masked Code Keywords` command
   - Edit the `keywords.json` file to add or remove keyword/placeholder pairs

## Example Usage

Assume we have a `keywords.json` file with the following content:

```json
[
  {
    "key": "mySecretPassword",
    "value": "AlteredPasswordSecret",
    "matchType": "exact"
  },
  {
    "key": "anotherSecret",
    "value": "AnotherAlteredSecret",
    "matchType": "partial"
  },
  {
    "key": "yetAnotherSecret",
    "value": "YetAnotherAlteredSecret",
    "matchType": "exact"
  }
]
```

Let's take the following test sentences:

1. "My name is Sam and my password is mySecretPassword."
2. "I am a huge fan of anotherSecret and I talk about it all the time."
3. "My yetAnotherSecret is that I love chocolate."
4. "The best part of the day is when I can sit down and write in peace."
5. "I use the keyword mySecretPassword to access my private files."
6. "I keep all my important information under anotherSecret."
7. "Everyone should have a yetAnotherSecret in their lives."

After running the `maskCode` command, the sentences would be altered as follows.

1. "My name is Sam and my password is AlteredPasswordSecret." (Exact match of mySecretPassword is replaced)
2. "I am a huge fan of AnotherAlteredSecret and I talk about it all the time." (All instances of anotherSecret are replaced, even if they are part of another word)
3. "My YetAnotherAlteredSecret is that I love chocolate." (Exact match of yetAnotherSecret is replaced)
4. "The best part of the day is when I can sit down and write in peace." (This sentence remains unchanged as it does not contain any keywords)
5. "I use the keyword AlteredPasswordSecret to access my private files." (Exact match of mySecretPassword is replaced)
6. "I keep all my important information under AnotherAlteredSecret." (All instances of anotherSecret are replaced, even if they are part of another word)
7. "Everyone should have a YetAnotherAlteredSecret in their lives." (Exact match of yetAnotherSecret is replaced)

Please remember to replace the text within `keywords.json` and the sentences with your own content and keywords.

Note: In the example above, the "matchType" parameter is used to control how the keywords are matched. An "exact" match means the keyword is replaced only when it appears exactly as is. A "partial" match means the keyword is replaced even when it is part of another word.

## Configuration

You can configure the keywords and the path to the keywords file in your VS Code settings. Open your settings and search for "masked-code" to find the available options.

## Add Configuration to User Settings

To add the configuration to your user settings in Visual Studio Code, include the following line:

Press `Ctrl+Shift+P` and run the `user settings (json)` command

Add the desired key-value pair using the correct JSON syntax. For example, to add the "maskmeister.keywordsFilePath" setting, you would add the following line:

```json
"maskmeister.keywordsFilePath": "C:\\dev\\keywords.json",
```

Make sure to adjust the file path according to your system's directory structure.

## Contributing

If you'd like to contribute to MaskMeister, please submit issues or pull requests on the GitHub repository.

## License

MIT License

