// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  // Register the maskCode command
  const maskCodeDisposable = vscode.commands.registerCommand(
    "maskmeister.maskCode",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const document = editor.document;
      const originalCode = document.getText();
      let maskedCode = originalCode;

      const keywordMap = getKeywordMap();
      for (const [keyword, [dummyValue, matchType]] of (
        await keywordMap
      ).entries()) {
        let regex = new RegExp(""); // Initialize with a default value
        switch (matchType) {
          case "exact":
            regex = new RegExp(`\\b${keyword}\\b`, "gi");
            break;
          case "partial":
            regex = new RegExp(`${keyword}`, "gi");
            break;
        }
        maskedCode = maskedCode.replace(regex, dummyValue);
      }

      editor.edit((editBuilder) => {
        const fullRange = new vscode.Range(
          document.positionAt(0),
          document.positionAt(originalCode.length)
        );
        editBuilder.replace(fullRange, maskedCode);
      });
    }
  );

  const editKeywordsCommand = vscode.commands.registerCommand(
    "maskmeister.editKeywords",
    () => {
      // The path to the keywords file
      const keywordsFilePath = vscode.workspace
        .getConfiguration("maskmeister")
        .get("keywordsFilePath") as string;

      // Check if the keywordsFilePath has been set in the settings
      if (!keywordsFilePath) {
        // If it hasn't been set, show a message to the user and ask them to set it
        vscode.window
          .showInformationMessage(
            "Please specify the location of the keywords file in the MaskMeister settings.",
            "Open Settings"
          )
          .then((selection) => {
            if (selection === "Open Settings") {
              vscode.commands.executeCommand(
                "workbench.action.openSettings",
                "maskmeister.keywordsFilePath"
              );
            }
          });
        return; // Don't execute the command if the keywordsFilePath hasn't been set
      }

      // Default keywords to write if the file doesn't exist
      const defaultKeywords = [
        {
          key: "mySecretPassword",
          value: "AlteredPasswordSecret",
          matchType: "exact",
        },
        {
          key: "anotherSecret",
          value: "AnotherAlteredSecret",
          matchType: "partial",
        },
        {
          key: "yetAnotherSecret",
          value: "YetAnotherAlteredSecret",
          matchType: "exact",
        },
      ];

      // Check if the file exists
      if (!fs.existsSync(keywordsFilePath)) {
        // If the file doesn't exist, create it
        fs.writeFileSync(
          keywordsFilePath,
          JSON.stringify(defaultKeywords, null, 2),
          "utf-8"
        );
      }

      // Now you can open the file in a text editor
      vscode.workspace.openTextDocument(keywordsFilePath).then((doc) => {
        vscode.window.showTextDocument(doc);
      });
    }
  );

  // Register the unmaskCode command
  const unmaskCodeDisposable = vscode.commands.registerCommand(
    "maskmeister.unmaskCode",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const document = editor.document;
      const maskedCode = document.getText();
      let originalCode = maskedCode;

      const keywordMap = getKeywordMap();
      for (const [keyword, dummyValue] of (await keywordMap).entries()) {
        const regex = new RegExp(
          `\\b${dummyValue[0].replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`,
          "gi"
        );

        originalCode = originalCode.replace(regex, keyword);
      }

      editor.edit((editBuilder) => {
        const fullRange = new vscode.Range(
          document.positionAt(0),
          document.positionAt(maskedCode.length)
        );
        editBuilder.replace(fullRange, originalCode);
      });
    }
  );

  // Register the code actions provider
  const codeActionsDisposable = vscode.languages.registerCodeActionsProvider(
    { scheme: "file", language: "*" },
    {
      provideCodeActions(document, range) {
        const maskAction = new vscode.CodeAction(
          "Mask code",
          vscode.CodeActionKind.QuickFix
        );
        maskAction.command = {
          command: "maskmeister.maskCode",
          title: "Mask code",
          tooltip: "Mask code",
          arguments: [],
        };

        const unmaskAction = new vscode.CodeAction(
          "Unmask code",
          vscode.CodeActionKind.QuickFix
        );
        unmaskAction.command = {
          command: "maskmeister.unmaskCode",
          title: "Unmask code",
          tooltip: "Unmask code",
          arguments: [],
        };

        return [maskAction, unmaskAction];
      },
    }
  );

  context.subscriptions.push(
    maskCodeDisposable,
    unmaskCodeDisposable,
    editKeywordsCommand,
    codeActionsDisposable
  );
}

interface KeywordItem {
  key: string;
  value: string;
  matchType: string;
}

async function getKeywordMap(): Promise<Map<string, [string, string]>> {
  const config = vscode.workspace.getConfiguration("maskmeister");
  let keywordsFilePath = config.get<string>("keywordsFilePath");

  if (!keywordsFilePath) {
    const result = await vscode.window.showInputBox({
      prompt: "Please enter the location for the keywords file",
      value: "keywords.json",
    });

    if (result !== undefined) {
      keywordsFilePath = result;
      config.update(
        "keywordsFilePath",
        keywordsFilePath,
        vscode.ConfigurationTarget.Global
      );
    } else {
      return new Map();
    }
  }

  let customKeywordMap = new Map<string, [string, string]>();
  try {
    fs.mkdirSync(path.dirname(keywordsFilePath), { recursive: true });
    if (!fs.existsSync(keywordsFilePath)) {
      const defaultKeywordArray: KeywordItem[] = [];
      fs.writeFileSync(keywordsFilePath, JSON.stringify(defaultKeywordArray));
    }

    const customKeywords: KeywordItem[] = JSON.parse(
      fs.readFileSync(keywordsFilePath, "utf8")
    );
    customKeywordMap = new Map<string, [string, string]>(
      customKeywords.map(({ key, value, matchType }) => [
        key,
        [value, matchType],
      ])
    );
  } catch (err) {
    // Error reading custom keywords file
    console.error(err);
  }

  const configKeywordMap = config.get<{
    [key: string]: { value: string; matchType: string };
  }>("keywords");
  const configKeywordArray: [string, [string, string]][] = configKeywordMap
    ? Object.entries(configKeywordMap).map(([key, { value, matchType }]) => [
        key,
        [value, matchType],
      ])
    : [];

  return new Map<string, [string, string]>([
    ...customKeywordMap,
    ...configKeywordArray,
  ]);
}

export function deactivate() {}
