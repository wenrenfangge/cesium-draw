<!--
 * @Author: 闻人放歌 wenrenfangge@gmail.com
 * @Date: 2024-10-21 09:15:24
 * @LastEditors: 闻人放歌 wenrenfangge@gmail.com
 * @LastEditTime: 2024-10-23 19:31:03
 * @FilePath: /cesiumDraw/Users/wenrenfangge/Documents/wenrenfangge-studio/frontEnd/cesium-draw/README.md
 * @Description: 英文文档
-->

[中文文档](/README-zh.md)

# Usage Guide

## Add plugins to the project

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

## Used in the project

```ts
import { DrawIrregular }  from '@wenrenfangge/cesium-draw';
// The constructor must be used after cesium initialization is completed and the viewer is obtained
const irregularDraw = new DrawIrregular(viewer);
irregularDraw.onDrawFinish = (drawData) => {
  // handle draw data
}

const drawIrregularGraphic = () => {
    irregularDraw.drawings();
}
```
