<!--
 * @Author: 闻人放歌 wenrenfangge@gmail.com
 * @Date: 2024-10-21 09:15:24
 * @LastEditors: 闻人放歌 wenrenfangge@gmail.com
 * @LastEditTime: 2024-10-21 19:59:38
 * @FilePath: /cesiumDraw/Users/wenrenfangge/Documents/wenrenfangge-studio/frontEnd/cesium-draw/README.md
 * @Description: 英文文档
-->
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

const irregularDraw = new DrawIrregular(viewer);

const drawIrregularGraphic = () => {
    irregularDraw.drawings();
}
```
