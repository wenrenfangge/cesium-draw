<!--
 * @Author: 闻人放歌 wenrenfangge@gmail.com
 * @Date: 2024-10-21 09:23:44
 * @LastEditors: 闻人放歌 wenrenfangge@gmail.com
 * @LastEditTime: 2024-10-21 19:59:30
 * @FilePath: /cesiumDraw/Users/wenrenfangge/Documents/wenrenfangge-studio/frontEnd/cesium-draw/README-zh.md
 * @Description: 中文文档
-->
[English Docs](/README.md)

# 使用指南

## 添加插件到项目

### npm

  ```bash
  npm install @wenrenfangge/cesium-draw
  ```

### pnpm

  ```bash
  pnpm add @wenrenfangge/cesium-draw
  ```

### yarn

  ```bash
  yarn add @wenrenfangge/cesium-draw
  ```

## 在项目中使用

```ts
import { DrawIrregular }  from '@wenrenfangge/cesium-draw';

const irregularDraw = new DrawIrregular(viewer);

const drawIrregularGraphic = () => {
    irregularDraw.drawings();
}
```
