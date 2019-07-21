# IOMS

## IOMS 项目相关操作命令

```
npm包还原
npm install
```

```
项目运行
npm run dev
npm run serve
```

```
打包预览环境
npm run build:stage

api 地址可在 .env.staging 文件中进行配置

打包生产环境
npm run build:prod

api 地址可在 .env.production 文件中进行配置

```

## IOMS 项目发布相关配置

### windows IIS 服务发布

```
IIS 管理器需要安装 urlrewrite2 组件
```

并添加 web.config 配置

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

## IOMS 项目本地运行相关环境配置

安装 NODE

```
      NODE
      NPM
```

查看 node 及 npm 版本

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

## 项目相关文档直达链接

Vue 相关

```
    github:      https://github.com/vuejs/vue
    中文文档:     https://cn.vuejs.org/index.html
    英文文档：    https://vuejs.org/
```

Vuex 相关

```
    github:   https://github.com/vuejs/vuex
    中文文档：  https://vuex.vuejs.org/zh/
    英文文档：  https://vuex.vuejs.org/
```

element-ui 相关

```
    github:   https://github.com/ElemeFE/element
    中文文档： https://element.eleme.cn/#/zh-CN
    英文文档： https://element.eleme.cn/#/en-US
```

vue-treeselect 相关

```
    github:   https://github.com/riophae/vue-treeselect
    文档：    https://vue-treeselect.js.org/
```

axios 相关文档

```
    github:   https://github.com/axios/axios
    文档：    https://www.axios.com/
```

moment 日期时间格式化 相关文档

```
    github:     https://github.com/moment/moment
    文档：      https://momentjs.com/
```

Vue Element Admin 相关文档

```
    github:     https://github.com/PanJiaChen/vue-element-admin/
    预览地址：  https://panjiachen.github.io/vue-element-admin/#/dashboard
    中文文档：  https://panjiachen.github.io/vue-element-admin-site/zh/
    英文文档：  https://panjiachen.github.io/vue-element-admin-site/
```
