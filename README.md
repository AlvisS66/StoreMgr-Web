## 开发环境
```
vue、vue-element-admin
```

## 首次拉取代码操作
```
1.npm install
2.cp dev.env.example.js dev.env.js
  修改配置本地 dev BASE_API
3.cp index.example.js index.js
  修改配置本地 dev host port
```

## 本地编译操作
```
npm run dev
```

## 线上打包发布

```
npm run build:prod
```

##内存溢出

```
全局安装increase-memory-limit
npm install -g increase-memory-limit
进入工程目录，执行：
increase-memory-limit
```