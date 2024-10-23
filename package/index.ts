/*
 * @Author: 闻人放歌 wenrenfangge@gmail.com
 * @Date: 2024-10-20 10:47:39
 * @LastEditors: 闻人放歌 wenrenfangge@gmail.com
 * @LastEditTime: 2024-10-23 11:25:48
 * @FilePath: /cesiumDraw/Users/wenrenfangge/Documents/wenrenfangge-studio/frontEnd/cesium-draw/package/index.ts
 * @Description: 绘制工具入口文件
 */
import DrawIrregular from "./irregular";

export { DrawIrregular };

// 如果 Cesium 仍然未定义，手动将其添加到全局对象中
declare global {
  interface Window {
    Cesium: typeof Cesium;
  }
}

window.Cesium = Cesium; // 手动将 Cesium 挂载到 window 上
