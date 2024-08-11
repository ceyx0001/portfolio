float prog = position.x + 6.6;
float locProg = clamp ((uProgress - 0.045 * prog) / 0.2, 0.0, 1.0);

transformed = transformed - aCenter;
transformed += 1.0*normal*aRand*locProg;

transformed *= (1.0-locProg);
transformed += aCenter;

transformed = rotate(transformed, vec3(10.0, 1.0, 0.0), aRand*locProg*3.14);
transformed.x -= 20.0 * locProg;

float curveAmount = 10.0 * locProg;
float modifiedLocProg = pow(locProg, 1.5);
transformed.z += curveAmount * sin(modifiedLocProg);
transformed.z += curveAmount * sin(modifiedLocProg);

vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
vWorldNormal = normalize(mat3(modelMatrix) * normal);
gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);