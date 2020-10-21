# Layout : Geometric Composition


## canvas division

-   position and scale the images to each take up one third of the canvas. it guarantees that each image has an equal amount of space and that the horizontal lines created between the bordering images are evenly distributed from top to bottom.

-   [code](sketch_01.js)

-   however, the result appears somewhat dense because there is no whitespace between the images. to make up for this, we can introduce margins ( empty space around content ) to make the design more airy.
-   first, we have to find the size of the margin, which we calculate based on the canvas height in order to make our layout responsive in case we ever resize the canvas.
    
    ```js
    const margin = height / 20;
    ```
-   we then calculate the combined height of all three images, which is the canvas height without our margins. note that since we are only adding the margin between the images, there are only two margins for three images.
    
    ```js
    const allHeight = height - 2 * margin;
    ```
-   finally, we divide the `allHeight` variable by the number of images, which gives us the height of a single image. this value will also be used with the `margin` variable to calculate the position of each image.
    
    ```js
    const imgHeight = allHeight / 3;
    ```
-   by changing the value of the `margin` variable, we can easily increase or decrease the amount of whitespace, or even use the `random()` function to randomize the margin every time the code runs.

-   [code](sketch_02.js)

-   we can continue our quest to add more whitespace by introducing margins around the edges of the canvas as well. we use the same code from above to calculate the height of each image, adding two extra margins for the top and bottom. we also use the same type of calculation for a new imgWidth variable to find the width of each image.

-   [code](sketch_03.js)

-   notice how the calculations are becoming longer the further down the page we go. this is because each image has to find its y position based on the number of images that came before it. let us instead rewrite the same example using the `translate()` function. we no longer need the long calculations for the last images, since the translations are added on top of each other as we go along

-   [code](sketch_04.js)

-   geometric composition is a great strategy when designing in code. it might take a little longer to write the code compared to making the same design in a traditional design tool, but the result is a pixel-perfect, balanced design that makes it easy to test variations by tweaking a single variable.


## procedural layouts
