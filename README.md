# IOMS

## IOMS 项目相关操作命令

```
npm包还原
npm install 
```

```
项目运行
npm run dev
npm run server
```

```
打包预览环境
npm run build:stage

打包生产环境
npm run build:prod
```

## IOMS 项目发布相关配置

### windows IIS 服务发布

```
IIS 管理器需要安装 urlrewrite2 组件
```

并添加  web.config  配置

```
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Handle History Mode and custom 404/500" stopProcessing="true">
          <match url="(.*)" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

## IOMS项目本地运行相关环境配置

安装  NODE

```
      NODE
      NPM
```

查看  node 及 npm 版本

```
    node -v
    npm -v
```

Npm 相关配置

```
  查看 npm 相关配置
  npm config list
  
  npm 源镜像地址切换为 taobao
  npm config set registry http://registry.npm.taobao.org
  
  npm 切换为源镜像地址
  npm config set registry http://registry.npm.org
```

安装 webpack 及脚手架

```
    npm install webpack -g
    npm install webpack-cli -g
```

查看 webpack 版本

```
    webpack -v
```

安装 Vue 脚手架

```
    npm install @vue/cli -g
```

查看 Vue 版本

```
    vue -V
```

## npm install 时报错

node-sass 相关

```
    npm install node-sass sass-loader
```
