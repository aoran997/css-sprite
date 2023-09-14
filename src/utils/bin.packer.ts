export class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.x = -1; // 初始化为-1，表示未放置
    this.y = -1;
    this.rotated = false; // 是否旋转
  }
}

class Bin {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.rectangles = [];
  }

  // 尝试将矩形放入箱子中
  tryFit(rectangle) {
    for (let i = 0; i < 2; i++) { // 尝试两次，一次不旋转，一次旋转
      if (rectangle.width <= this.width && rectangle.height <= this.height) {
        // 找到一个可行位置
        rectangle.x = 0;
        rectangle.y = 0;
        rectangle.rotated = i === 1;
        this.rectangles.push(rectangle);
        // 更新箱子的剩余空间
        this.width -= rectangle.width;
        this.height -= rectangle.height;
        return true;
      }
      // 如果无法放置，尝试旋转矩形
      const temp = rectangle.width;
      rectangle.width = rectangle.height;
      rectangle.height = temp;
    }
    return false; // 无法放置
  }
}

export function packRectangles(rectangles, binWidth, binHeight) {
  const bin = new Bin(binWidth, binHeight);
  const packedRectangles = [];

  for (const rectangle of rectangles) {
    if (bin.tryFit(rectangle)) {
      packedRectangles.push(rectangle);
    }
  }

  return packedRectangles;
}

// 示例用法
const rectangles = [
  new Rectangle(4, 5),
  new Rectangle(3, 6),
  new Rectangle(2, 7),
  // 添加更多矩形
];

const binWidth = 10;
const binHeight = 10;

const packedRectangles = packRectangles(rectangles, binWidth, binHeight);

console.log(packedRectangles);