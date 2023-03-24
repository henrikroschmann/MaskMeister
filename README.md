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


### Example keywords.json
```json
{
    "ExampleToReplace": "ReplacementValue",
    "SomeOtherValue": "SomeOtherReplacementValue"
}
```

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

