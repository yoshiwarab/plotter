import svg5, { noFill, render } from "svg5"
import { vec2 } from 'gl-matrix'

const width = 1000
const height = 1000
const numCircles = 1000
const minRadius = 3
const maxRadius = 20

svg5.createSVG(width, height)
svg5.background(255)
svg5.fill(255)
svg5.stroke(0)

const circles = packCircles(numCircles, width, height, minRadius, maxRadius)
circles.forEach((circle) => circle.draw())
render()

function packCircles(numCircles, width, height, minRadius, maxRadius) {
  const circles = []
  while(circles.length < numCircles) {
    const newX = svg5.random(maxRadius, width - maxRadius)
    const newY = svg5.random(maxRadius, height - maxRadius)

    if (circles.length === 0) {
      circles.push(new Circle(newX, newY, maxRadius, 0))
      continue
    }

    for (let newR = maxRadius; newR >= minRadius; newR--) {
      let intersection = false
      for (let i = 0; i < circles.length; i++) {
        const d = vec2.distance([newX, newY], [circles[i].x, circles[i].y])
        intersection = d < (circles[i].r + newR)
        if (intersection) {
          break
        }
      }

      if (!intersection) {
        circles.push(new Circle(newX, newY, newR, circles.length))
        break
      }
    }
  }

  for (let i = 0; i < circles.length; i++) {
    let closestCircle;
    for (let j = 0; j < circles.length; j++) {
      if (i !== j) {
        const d = vec2.distance([circles[i].x, circles[i].y], [circles[j].x, circles[j].y])
        if (d <= circles[i].r + circles[j].r + 1) {
          closestCircle = circles[j]
          break
        }
      }
    }
    if (closestCircle) {
      circles[i].lookAt = closestCircle
    }
  }

  return circles
}

function Circle(x, y, r, id) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.id = id;
  this.lookAt = null;

  Circle.prototype.draw = function () {
    svg5.circle(this.x, this.y, this.r * 2)
    
    let newR = this.r

    let angle
    if (this.lookAt) {
      angle = Math.atan2(this.lookAt.y - this.y, this.lookAt.x - this.x)
    }

    while (newR >= this.r * 0.2 ) {
      newR = newR - (this.r * 0.2)
      
      const distance = (this.r - newR) / 2
      let offset = [0, 0]
      if (angle) {
        offset = [distance * Math.cos(angle), distance * Math.sin(angle)]
      }
      svg5.circle(this.x + offset[0], this.y + offset[1], newR * 2)
    }
  };
}
