# IOMS
# Visual Studio Code

### Code Formatting

```
{
  // 使能每一种语言默认格式化规则
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "workbench.editor.enablePreview": false, //新标签打开文件
  "editor.tabSize": 2, //制表符符号eslint
  "editor.formatOnSave": true, //每次保存自动格式化
  "files.autoSave": "onFocusChange", // 文件失去焦点自动保存
  "eslint.autoFixOnSave": true, // 每次保存的时候将代码按eslint格式进行修复
  "eslint.validate": ["javascript", "javascriptreact", { "language": "vue", "autoFix": true }, { "language": "html", "autoFix": true }], // 开启对.vue文件中错误的检查
  "prettier.eslintIntegration": true, //让prettier使用eslint的代码格式进行校验
  "prettier.jsxSingleQuote": true, // 在jsx中使用单引号代替双引号
  "prettier.tslintIntegration": false, // 不让prettier使用tslint的代码格式进行校验 !!!!
  "prettier.singleQuote": true, // 使用带引号替代双引号
  "prettier.semi": false, // 去掉代码结尾的分号
  "prettier.printWidth": 500, // 超过最大值换行
  "javascript.format.insertSpaceBeforeFunctionParenthesis": true, // 让函数(名)和后面的括号之间加个空格
  "vetur.format.defaultFormatter.js": "vscode-typescript", // 让vue中的js按编辑器自带的ts格式进行格式化
  "vetur.format.defaultFormatter.html": "js-beautify-html", // 格式化.vue中html
  "vetur.format.defaultFormatterOptions": {
    "prettier": {
      "semi": false, //结尾分号
      "singleQuote": true //使用单引号代替双引号
    },
    "js-beautify-html": {
      "wrap_line_length": 500,
      "wrap_attributes": "auto",
      "end_with_newline": false
    }
  },
  "git.autofetch": true,
  "git.confirmSync": false
}
```

### Extension plug-in

![image test](https://code.jingshonline.net/lawfirmoa/WebApp/raw/master/ReadmeImg/10514185-a5af44ac9271b76a.png)
