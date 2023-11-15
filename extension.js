// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function getWebViewContent(context, templatePath, panel) {
    const resourcePath = path.join(context.extensionPath, templatePath);
    const dirPath = path.dirname(resourcePath);
    let htmlIndexPath = fs.readFileSync(resourcePath, 'utf-8');

    const html = htmlIndexPath.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
        const absLocalPath = path.resolve(dirPath, $2);
        const webviewUri = panel.webview.asWebviewUri(vscode.Uri.file(absLocalPath));
        const replaceHref = $1 + webviewUri.toString() + '"';
        return replaceHref;
    });
    return html;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "snow-vscode-plugin" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('snow-vscode-plugin.snowCode', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		console.log('Run This Code.');
		vscode.window.showInformationMessage('Welcome To My Zone!');
		vscode.commands.executeCommand('snow-vscode-plugin-panel');
	});

	let showPanel = vscode.commands.registerCommand('snow-vscode-plugin-panel', function () {
		const panel = vscode.window.createWebviewPanel(
			'translationPanel',
			'⛄ Snow Whale ⛲',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				retainContextWhenHidden: true
			}
		);
		panel.webview.html = getWebViewContent(context, '/src/views/panel.html', panel);
	});

	context.subscriptions.push(disposable);

	context.subscriptions.push(showPanel);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
