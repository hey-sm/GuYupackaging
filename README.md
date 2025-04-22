# Org

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ monorepo的项目✨

初始化按照文档进行

创建libs

storybook

````typescript
// components是包名
nx g @nx/react:library components --directory=features
````

````typescript
// features-components是项目名
nx g @nx/react:storybook-configuration features-components
````

运行app

````javascript
nx serve admin
````

运行components

````
 nx storybook features-components
````


安装依赖
`npm install --legacy-peer-deps`


