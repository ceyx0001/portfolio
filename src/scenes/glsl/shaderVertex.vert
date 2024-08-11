float prog = position.x + 6.6;
float locProg = clamp((uProgress - 0.045 * prog) / 0.2, 0.0, 1.0);

transformed = transformed - aCenter;

transformed += 1.0 * normal * aRand * locProg;

transformed *= (1.0 - locProg);
transformed += aCenter;

// Rotate around the z-axis for horizontal rotation
transformed = rotate(transformed, vec3(0.0, 1.0, 0.0), -aRand * locProg);

float angle = locProg * 2.0 * 3.14159265359; // 2π for a full circle

// Calculate the new x and y positions
float radius = 100.0; // Adjust the radius as needed
float newX = radius * sin(angle);
float newZ = radius * cos(angle);

// Apply the circular motion
transformed.x -= newX * locProg;
transformed.z += newZ * locProg;

vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
vWorldNormal = normalize(mat3(modelMatrix) * normal);
gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
