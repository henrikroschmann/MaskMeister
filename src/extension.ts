// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";
import path = require("path");

export function activate(context: vscode.ExtensionContext) {
  // Register the maskCode command
  const maskCodeDisposable = vscode.commands.registerCommand(
    "maskmeister.maskCode",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const document = editor.document;
      const originalCode = document.getText();
      let maskedCode = originalCode;

      const keywordMap = getKeywordMap();
      for (const [keyword, dummyValue] of keywordMap.entries()) {
        const regex = new RegExp(`\\b${keyword}\\b`, "gi");
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

  // Register the unmaskCode command
  const unmaskCodeDisposable = vscode.commands.registerCommand(
    "maskmeister.unmaskCode",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const document = editor.document;
      const maskedCode = document.getText();
      let originalCode = maskedCode;

      const keywordMap = getKeywordMap();
      for (const [keyword, dummyValue] of keywordMap.entries()) {
        const regex = new RegExp(
          `\\b${dummyValue.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`,
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

  // Register the editKeywords command
  const editKeywordsDisposable = vscode.commands.registerCommand(
    "maskmeister.editKeywords",
    () => {
      const keywordsFilePath = vscode.workspace
        .getConfiguration("maskmeister")
        .get<string>("keywordsFilePath", "keywords.json");
      vscode.window
        .showTextDocument(vscode.Uri.file(keywordsFilePath), {
          viewColumn: vscode.ViewColumn.One,
          preserveFocus: true,
          preview: false,
        })
        .then((editor) => {
          // No need to create an edit here; just open the file.
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
    editKeywordsDisposable,
    codeActionsDisposable
  );
}

function getKeywordMap(): Map<string, string> {
  const defaultKeywordMap = new Map([
    ["password", "****"],
    ["secret", "**"],
  ]);
  const configKeywordMap = vscode.workspace
    .getConfiguration("maskmeister")
    .get<{ [key: string]: string }>("keywords");
  const keywordsFilePath = vscode.workspace
    .getConfiguration("maskmeister")
    .get<string>("keywordsFilePath");
  let customKeywordMap = new Map();
  try {
    let customKeywords;
    if (keywordsFilePath) {
      customKeywords = fs.readFileSync(keywordsFilePath, "utf8");
    } else {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        console.error("No workspace folder found.");
        return defaultKeywordMap;
      }
      const filePath = path.join(workspaceFolder.uri.fsPath, "keywords.json");
      customKeywords = fs.readFileSync(filePath, "utf8");
    }
    customKeywordMap = new Map(Object.entries(JSON.parse(customKeywords)));
  } catch (err) {
    // Error reading custom keywords file
    console.error(err);
  }
  return new Map([
    ...defaultKeywordMap,
    ...(configKeywordMap ? Object.entries(configKeywordMap) : []),
    ...customKeywordMap,
  ]);
}

  
  

export function deactivate() {}
