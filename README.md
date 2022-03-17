# Planet Master

![](./public/logo192.png)

### Guide

Modify required changes in the folliowing files:

`.env`: Chain ID

`src/configs/<Chain-ID>/configs.json`: DApp metadata and Contract settings

Install dependencies and run on a local server:

```bash
$ yarn install

$ ln -s env.testnet .env

$ yarn start
```

Transpile and minify sources for production:

```bash
$ yarn build
# Build results are in the `build` folder
```
