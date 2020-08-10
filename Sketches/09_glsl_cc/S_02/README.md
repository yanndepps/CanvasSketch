# Notes

- [Notes](#notes)
- [part-01](#part-01)
- [part-02](#part-02)
- [part-03](#part-03)
- [part-04](#part-04)
- [part-05](#part-05)
- [part-06](#part-06)
- [part-07](#part-07)

# part-01

- we need a vertex shader and a fragment shader and each of these
  must have a main function.
- the vertex shader main function must set the value of gl_Position
  and it uses the projectionMatrix, the modelViewMatrix and the position
  of the vertex to do this.
- the fragment shader main function must set the value of gl_FragColor
  to a rgba format value.
- each channel of a rgba format color takes a value between 0.0 and 1.0.

# part-02

- jumbling the elements of a vec variable is called swizzling :
  color.grba -> swaps the red and green channels.

# part-03

- Uniforms pass data between the control program and the shaders.
- Each uniform will store a common value for each vertex & pixel.
- u_mouse stores the x, y location of the mouse.
- u_mouse stores the mouse coordinates
- u_resolution stores the pixel size of the window

```
u_mouse.x = u_mouse[0]
```

- Vector Opererations:
- vec2 v = u_mouse/u_resolution results in :

```
v.x = u_mouse.x/u_resolution.x
v.y = u_mouse.y/u_resolution.y
```

# part-04

- gl_FragCoord is a vec4 type which provides the coordinates of 
  the current pixel.
- it has x, y, z and w values.
- remember that u_resolution provides the pixels of the window.
- the mix method :
   - takes 3 parameters : mix(x, y, a)
```
mix(x, y, 0.0) = x
mix(x, y, 1.0) = y
```
- x * (1-a) + y * a -> linear interpolation
- x and y can be floats, vec2, vec3 or vec4 values but :
  - x, y and return type must be the same.
- mix(x, y, a)
```
x = vec3(1.0, 0.0, 0.0) -> red 
y = vec3(0.0, 0.0, 1.0) -> blue
a = uv.y -> value between 0.0 and 1.0 
```
- suppose a with a value of 0.25 :
```
mix(x,y,a) = x * (1-a) + y * a
x * (1.0 - 0.25) + y * 0.25 = x * 0.75 + y * 0.25
vec3(1.0, 0.0, 0.0) * 0.75 + vec3(0.0, 0.0, 1.0) * 0.25
vec3(0.75, 0.0, 0.0) + vec3(0.0, 0.0, 0.25) = vec3(0.75, 0.0, 0.25)
```

# part-05

- pass values into the shaders using uniforms.
- those values can be integers, floats, vectors or images.
- it must be delared : name and type + the keyword uniform.
- a varying is a variable that we pass from the vertex to 
  the fragment shader.
- how can we get the uv in a fragment shader ?
- we use varying value.
- varying vec2 v_uv

# part-06
- **clamp** constrains a value between a _min_ and a _max_ value.
- **colors** in GLSL : each channel takes a value between 0.0 and 1.0
- clamp take 3 parameters : **clamp(n, min, max)**
```
clamp(2.0, 0.0 1.0) -> 1.0 

clamp(-1.0, 0.0, 1.0) -> 0.0 

clamp(0.5, 0.0, 1.0) -> 0.5
```

# part-07
- **step** returns 0.0 or 1.0 by comparing two values
- **step** takes 2 parameters : **step(edge, n)** 
- if n < edge -> 0.0 is returned 
- if n > edge -> 1.0 is returned
- **smoothstep** is an interpolation between two values
- it takes 3 parameters : **smoothstep(edge0, edge1, n)**
- if n < edge0 -> 0.0 is returned 
- if n > edge1 -> 1.0 is returned
