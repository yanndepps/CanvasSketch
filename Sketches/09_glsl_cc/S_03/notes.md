# Notes

## part_01 : drawing a yellow circle
- we want inCircle to be 1.0 when length(v_position.xy)>0.5
  and 0.0 when it is longer.
  
## part_02 : drawing a square
### the custom function rect()
- takes 3 parameters :
- **pt** : the test pixel position
- **size** : width and height of rectangle
- **center** : the x and y position of the rectangle center

### the range of the v_position.xy varying

| p.x  | step(-0.5, p.x) | step(0.5, p.x) | horz |
| :--- | :-------------: | :------------: | ---: |
| -0.6 | 0               | 0              | 0    |
| 0.6  | 1               | 1              | 0    |
| p.y  | step(-0.5, p.y) | step(0.5, p.y) | vert |
| -0.6 | 0               | 0              | 0    |
| 0.6  | 1               | 1              | 0    |

1. we can use the step function more than once in a calculation.
2. if we are testing for the value being less than an edge value,
   then substract the return value from 1.0
3. we can create custom functions that return a value

## part_03 : moving the shape over time
### sin and cos
- a full revolution in radians is 2 * PI
- adjust the size of the circle by multiplying by a value

## part_04 : rotating the square 
