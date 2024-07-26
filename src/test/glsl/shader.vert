uniform float time;
attribute float randVal;

void main() {
  vec3 pos = position;
  pos += randVal * (0.5 * sin(time) + 0.5) * normal;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
