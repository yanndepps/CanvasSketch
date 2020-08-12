# P.1. Color

- the following examples provide users with the most important technical features for working with color and introduce several ways to use color when designing on the screen.

## [P_1_0_01](P_1_0_01.js)

- the horizontal position of the mouse controls the size of the color field. starting in the center, the colored area is depicted with a height and width of 1 to 720 pixels. the vertical mouse position controls the hue. The background passes through the color spectrum from 0 to 360, while the color field passes through the spectrum in the opposite direction, from 360 to 0.

## [P_1_1_1_01](P_1_1_1_01.js)

- the grid is created by two nested for loops. in the outer loop, the y-position is increased, step by step. the inner loop then draws a line by increasing the value for the rectangle’s x-position, step by step, until the entire width is processed. the step size is set by the value of the mouse position and is located in the variables stepX and stepY. it also determines the length and width of the rectangles.
