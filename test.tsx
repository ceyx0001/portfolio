if (uDisintegrationProgress < 1.0) {
    transformed += (0.5 * sin(uTime) + 0.5) * aRand * normal;
    vTransformed = transformed;
  } else {
    transformed = vTransformed;
    transformed.x -= aRand * (uTime - uDisintegrationProgress) * 2.0; // Move vertices to the left individually
    transformed.y += sin(transformed.x * 2.0 + (uTime - uDisintegrationProgress)) * 0.1; // Add a curved path
  }