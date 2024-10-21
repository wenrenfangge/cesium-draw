/*
 * @Author: 闻人放歌 wenrenfangge@gmail.com
 * @Date: 2022-06-22 16:23:12
 * @LastEditors: 闻人放歌 wenrenfangge@gmail.com
 * @LastEditTime: 2024-10-21 22:41:33
 * @FilePath: \ant-design-vue-prod:\work\company_new_bridge\fontweb\casearth\src\utils\cesiumDrawings.ts
 * @Description: 不规则图形绘制
 */
import {
  CallbackProperty,
  Cartesian2,
  Cartesian3,
  Cartographic,
  Color,
  defined,
  Entity,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Viewer,
  Math,
} from "cesium";
import { ElNotification } from "element-plus";
import { EventDispatcher, Handler } from "../event";
declare const turf: any;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DrawFinishEvent {}

export class CesiumDrawings {
  //#region

  //#endregion

  private handler: ScreenSpaceEventHandler;
  private viewer: Viewer;
  // private scene: any;
  private milkTruck: any;
  private ground: any;
  // private camera: any;
  private color: Color = new Color();
  private colors: Array<Color> = [];
  private polyline: Entity = new Entity();
  private points: Entity = new Entity();
  private directPolyline: Entity = new Entity();
  private drawing = false;
  private positions: Array<Cartesian3> = [];
  private activeShape: Entity = new Entity();
  private floatingPoint: any;
  public activeShapePointsLatlng: Array<any> = [];
  public activeShapePoints: Array<any> = [];
  public activeShapeMapLatlng: Array<any> = [];
  public proxy: any;
  private drawFinishDispatcher = new EventDispatcher<DrawFinishEvent>();
  // public proxy :any

  constructor(viewerInstance: Viewer) {
    // this.proxy= getCurrentInstance()
    this.viewer = viewerInstance;
    this.handler = new ScreenSpaceEventHandler(this.viewer.canvas);
    // this.camera = this.viewer.camera;
    // this.scene = this.viewer.scene;
    this.viewer.scene.globe.depthTestAgainstTerrain = true;
    this.viewer.screenSpaceEventHandler.removeInputAction(
      ScreenSpaceEventType.LEFT_CLICK
    );
    this.viewer.screenSpaceEventHandler.removeInputAction(
      ScreenSpaceEventType.MOUSE_MOVE
    );
    console.log(this.activeShape);
  }
  public onDrawFinish(handler: Handler<DrawFinishEvent>) {
    this.drawFinishDispatcher.register(handler);
  }
  private fireDrawFinish(event: DrawFinishEvent) {
    this.drawFinishDispatcher.fire(event);
  }

  public drawings() {
    const drawingsEntity = this.viewer.entities.getById("unregular-drawings");

    drawingsEntity && this.viewer.entities.remove(drawingsEntity);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    this.handler.setInputAction(function (event: any) {
      if (_this.drawing) {
        _this.reset(_this.color, _this.positions);
      } else {
        const postions = new CallbackProperty(function () {
          return _this.positions;
        }, false);
        _this.polyline = _this.viewer.entities.add({
          polyline: {
            positions: postions,
            material: _this.color,
            width: 3,
            clampToGround: true,
          },
          // polygon: {
          //   hierarchy: {
          //     positions: postions
          //   },
          //   material: Color.GREENYELLOW,
          //   clampToGround: true,
          // }
        });
        const { position } = event;
        const earthPosition = _this.viewer.scene.pickPosition(position);
        const metaEarthPosition =
          position instanceof Cartesian2
            ? _this.viewer.scene.camera.pickEllipsoid(position)
            : earthPosition;
        // console.log("metaEarthPosition=>", metaEarthPosition);
        if (defined(metaEarthPosition)) {
          if (_this.activeShapePointsLatlng.length === 0) {
            _this.floatingPoint = _this.createPoint(metaEarthPosition);
            _this.activeShapePointsLatlng.push(metaEarthPosition);
            const dynamicPositions: any = new CallbackProperty(function () {
              return _this.activeShapePointsLatlng;
            }, false);
            _this.activeShape = _this.drawGraphic(dynamicPositions); //绘制动态图
          }
          _this.activeShapePointsLatlng.push(metaEarthPosition);
          _this.activeShapePoints.push(_this.createPoint(metaEarthPosition));
        }
      }
      _this.drawing = !_this.drawing;
    }, ScreenSpaceEventType.LEFT_CLICK);

    this.handler.setInputAction(function (movement: any) {
      // console.log(movement)
      const { endPosition } = movement;
      const pickedObject = _this.viewer.scene.pick(movement.endPosition);
      const length = _this.colors.length;
      const lastColor = _this.colors[length - 1];
      let cartesian: Cartesian3 | undefined = _this.viewer.scene.pickPosition(
        movement.endPosition
      );
      if (!cartesian) {
        cartesian = _this.viewer.scene.camera.pickEllipsoid(endPosition);
      }
      // console.log(pickedObject,cartesian)
      if (_this.viewer.scene.pickPositionSupported && defined(cartesian)) {
        // const cartographic = Cartographic.fromCartesian(cartesian);
        if (!defined(pickedObject)) {
          _this.color = Color.GREENYELLOW;

          if (!defined(lastColor) || !lastColor.equals(Color.GREENYELLOW)) {
            _this.colors.push(Color.GREENYELLOW);
          }
          if (_this.drawing) {
            if (defined(lastColor) && lastColor.equals(Color.GREENYELLOW)) {
              _this.positions.push(cartesian);
            } else {
              _this.reset(lastColor, _this.positions);
              _this.draw(_this.color, _this.positions);
            }
          }
        }

        // are we drawing on one of the 3D models
        if (
          defined(pickedObject) &&
          (pickedObject.id === _this.ground ||
            pickedObject.id === _this.milkTruck)
        ) {
          const penultimateColor = _this.colors[length - 2];

          if (pickedObject.id === _this.ground) {
            _this.color = Color.GREENYELLOW;
          } else {
            _this.color = Color.ORANGE;
          }
          _this.pushColor(_this.color, _this.colors);

          if (_this.drawing) {
            if (lastColor.equals(Color.GREENYELLOW)) {
              _this.reset(lastColor, _this.positions);
              _this.draw(_this.color, _this.positions);
              console.log(_this.positions, 121212);
            } else if (
              (Color.GREENYELLOW.equals(lastColor) &&
                Color.ORANGE.equals(penultimateColor)) ||
              (Color.ORANGE.equals(lastColor) &&
                Color.GREENYELLOW.equals(penultimateColor))
            ) {
              _this.positions.pop();
              _this.reset(penultimateColor, _this.positions);
              _this.draw(lastColor, _this.positions);
              _this.colors.push(_this.color);
            } else {
              _this.positions.push(cartesian);
            }
          }
        }
      }
      if (_this.drawing && defined(_this.floatingPoint)) {
        let newPosition: Cartesian3 | undefined =
          _this.viewer.scene.pickPosition(movement.endPosition);
        if (!newPosition) {
          newPosition = _this.viewer.camera.pickEllipsoid(movement.endPosition);
        }
        if (defined(newPosition)) {
          _this.floatingPoint.position.setValue(newPosition);
          _this.activeShapePointsLatlng.pop();
          _this.activeShapePointsLatlng.push(newPosition);

          const cartesian: Cartesian3 | undefined =
            _this.viewer.camera.pickEllipsoid(movement.endPosition);
          if (!defined(cartesian)) {
            throw new Error("cartesian is not defined");
          }
          const cartographic = Cartographic.fromCartesian(cartesian);
          const lng = Math.toDegrees(cartographic.longitude); // 经度
          const lat = Math.toDegrees(cartographic.latitude); // 纬度

          _this.activeShapeMapLatlng.push({ lng, lat });
        }
      } else {
        // console.log("_this.activeShapePointsLatlng=>", _this.activeShapePointsLatlng)
        // _this.activeShapePointsLatlng = []
      }
    }, ScreenSpaceEventType.MOUSE_MOVE);
  }
  createPoint(position: any) {
    const point = this.viewer.entities.add({
      position: position,
      // point: {
      //     color: Color.WHITE,
      //     // outlineColor: Color.RED,
      //     outlineWidth:  2,
      //     pixelSize: 10,
      //     heightReference: HeightReference.CLAMP_TO_GROUND
      // }
    });
    this.points = point;
    return point;
  }
  private pushColor(color: Color, colors: Array<Color>) {
    const lastColor = colors[colors.length - 1];
    if (!defined(lastColor) || !color.equals(lastColor)) {
      colors.push(color);
    }
  }

  private reset(color?: Color, currentPositions?: Cartesian3[]) {
    console.log(color, currentPositions);
    const loopPosition = [this.positions[0]];
    const entity = {
      polyline: {
        positions: this.positions.concat(loopPosition),
        material: Color.GREENYELLOW.withAlpha(1),
        width: 3,
        clampToGround: true,
      },
      latlonList: this.activeShapeMapLatlng,
      positionsDegreesArray: this.activeShapeMapLatlng.map((item) => [
        item.lng,
        item.lat,
      ]),
      polygon: {
        hierarchy: {
          positions: this.positions,
          holes: [],
        },
        outline: true,
        // outlineColor: new Color(92, 184, 92, 1),
        outlineColor: Color.GREENYELLOW.withAlpha(1),
        material: Color.ORANGE.withAlpha(0.5),
        outlineWidth: 5,
        clampToGround: true,
      },
    };
    this.fireDrawFinish(entity);
    this.viewer.entities.add({
      id: "unregular-drawings",
      ...entity,
    });
    const defaultView = turf.polygon([
      [
        [-21, -54.01],
        [-19, -54.22],
        [-16, -54.18],
        [-15, -54.12],
        [-12, -54.27],
        [-10, -54.2],
        [-7, -53.88],
        [-2, -53.14],
        [-1, -52.89],
        [2, -52.43],
        [5, -51.72],
        [7, -51.31],
        [8, -50.96],
        [11, -50.23],
        [15, -48.77],
        [17, -47.56],
        [17.57, -47],
        [19, -46.15],
        [19.18, -46],
        [20.17, -45],
        [21.39, -43],
        [22.14, -42],
        [23.06, -40],
        [24.5, -38],
        [25, -36.95],
        [26, -36],
        [27.55, -34],
        [28.11, -33],
        [29, -31.79],
        [29.48, -31],
        [29.78, -30],
        [29.88, -29],
        [29.73, -28],
        [29.42, -27],
        [28.72, -26],
        [27.69, -25],
        [27, -24.44],
        [24, -22.8],
        [23, -22.33],
        [17, -20.68],
        [14, -20.13],
        [12, -19.82],
        [8, -19.15],
        [6, -18.86],
        [-2.43, -17],
        [-5, -16.17],
        [-6, -15.85],
        [-10.38, -14],
        [-16, -10.75],
        [-18, -9.21],
        [-19.39, -8],
        [-20.42, -7],
        [-21.19, -6],
        [-22.9, -3],
        [-23.77, -1],
        [-24.57, 1],
        [-25.37, 3],
        [-26, 4.02],
        [-27, 4.42],
        [-29, 4.89],
        [-30, 5.03],
        [-31, 5.66],
        [-33, 5.67],
        [-39, 5.33],
        [-42, 4.9],
        [-51, 3.46],
        [-65, 0.24],
        [-66, -0.14],
        [-68, -0.48],
        [-75, -2.32],
        [-77, -2.81],
        [-78, -3.14],
        [-81, -3.77],
        [-82, -4.09],
        [-95, -6.65],
        [-100, -7.57],
        [-102.04, -8],
        [-102.84, -9],
        [-103, -9.61],
        [-104, -9.58],
        [-104.93, -10],
        [-104.35, -11],
        [-103.53, -12],
        [-93, -23.64],
        [-91.92, -25],
        [-89.86, -28],
        [-89, -29.15],
        [-88.58, -30],
        [-87, -32.28],
        [-85.87, -34],
        [-83.8, -37],
        [-81, -40.68],
        [-78.94, -43],
        [-76.64, -45],
        [-76, -45.51],
        [-75, -46.06],
        [-73.49, -47],
        [-73, -47.32],
        [-70, -48.58],
        [-68.48, -49],
        [-68, -49.26],
        [-65, -49.98],
        [-64.86, -50],
        [-63, -50.49],
        [-61, -50.85],
        [-58.88, -51],
        [-57, -51.46],
        [-55, -51.69],
        [-46, -52.17],
        [-43, -52.24],
        [-39, -52.56],
        [-30, -53],
        [-28, -53.33],
        [-21, -54.01],
      ],
    ]);
    for (let i = 0; i < this.activeShapeMapLatlng.length; i++) {
      const select = turf.point([
        this.activeShapeMapLatlng[i].lng.toFixed(2),
        this.activeShapeMapLatlng[i].lat.toFixed(2),
      ]);

      if (turf.booleanPointInPolygon(select, defaultView)) {
        ElNotification({
          title: "警告",
          message: "绘制区域有重叠",
          duration: 3000,
        });
        break;
      }
    }
    this.positions = [];
    this.activeShapePointsLatlng = [];
    this.activeShapeMapLatlng = [];
    this.activeShapePoints = [];
    this.viewer.entities.remove(this.polyline);
    this.viewer.entities.remove(this.points);
    this.viewer.entities.remove(this.directPolyline);
    this.handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
    this.handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
  }

  private draw(color: Color, currentPositions: Cartesian3[]) {
    const entity = {
      // polyline: {
      //   loop: true,
      //   positions: new CallbackProperty(function () {
      //     return currentPositions;
      //   }, false),
      //   material: color,
      //   width: 10,
      //   clampToGround: true
      // },
      polygon: {
        hierarchy: {
          positions: currentPositions,
          holes: [],
        },
        material: color,
        clampToGround: true,
        width: 10,
      },
    };
    this.polyline = this.viewer.entities.add(entity);
  }
  private drawGraphic(positionData: Cartesian3[]) {
    let shape: Entity;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    shape = this.viewer.entities.add({
      polyline: {
        positions: positionData,
        clampToGround: true,
        width: 3,
        material: Color.GREENYELLOW,
      },
    });
    this.directPolyline = shape;
    return shape;
  }
}
