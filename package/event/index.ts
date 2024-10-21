/*
 * @Author: 闻人放歌 wenrenfangge@gmail.com
 * @Date: 2024-10-19 16:09:53
 * @LastEditors: 闻人放歌 wenrenfangge@gmail.com
 * @LastEditTime: 2024-10-19 18:57:59
 * @FilePath: /cesiumDraw/Users/wenrenfangge/Documents/wenrenfangge-studio/frontEnd/cesium-draw/package/event/index.ts
 * @Description: 事件绑定
 */
export type Handler<T> = (event: T) => void;
export class EventDispatcher<T> {
  private handlers: Handler<T>[] = [];
  fire(event: T) {
    for (const h of this.handlers) {
      h(event);
    }
  }
  register(handler: Handler<T>) {
    this.handlers.push(handler);
  }
}
