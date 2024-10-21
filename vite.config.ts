/*
 * @Author: 闻人放歌 wenrenfangge@gmail.com
 * @Date: 2024-10-20 10:46:51
 * @LastEditors: 闻人放歌 wenrenfangge@gmail.com
 * @LastEditTime: 2024-10-20 23:07:30
 * @FilePath: /cesiumDraw/Users/wenrenfangge/Documents/wenrenfangge-studio/frontEnd/cesium-draw/vite.config.ts
 * @Description: vite配置
 */
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "package/index.ts"),
      name: "@wenrenfangge/cesium-draw",
      fileName: "cesium-draw",
      formats: ["es", "cjs"],
    },
    outDir: "lib",
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["vue"],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: "Vue",
        },
      },
    },
    minify: "terser",
    terserOptions: {
      // 在打包代码时移除 console、debugger 和 注释
      compress: {
        /* (default: false) -- Pass true to discard calls to console.* functions.
          If you wish to drop a specific function call such as console.info and/or
          retain side effects from function arguments after dropping the function
          call then use pure_funcs instead
        */
        drop_console: true, // 生产环境时移除console
        drop_debugger: true,
      },
      format: {
        comments: false, // 删除注释comments
      },
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true, // 生成类型文件入口
      outDir: "lib/types", // 声明文件的输出目录
    }),
  ],
});
