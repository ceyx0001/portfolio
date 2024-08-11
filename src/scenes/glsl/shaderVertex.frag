vec3 viewDirection = normalize(uCameraPosition + vWorldPosition);
vec3 reflection = reflect(viewDirection, normalize(vWorldNormal));

float fresnel = pow(-max(dot(viewDirection, normalize(vWorldNormal)), 0.0), 2.0);
fresnel = mix(uMetalness, 0.1, fresnel);

vec3 specColor = texture2D(uEnvironmentMap, reflection.xy).rgb;

vec3 baseColor = vec3(0.3, 0.3, 0.3);

vec3 color = mix(baseColor, specColor, fresnel);

float contrast = 1.2;
color = (color - 0.5) * contrast + 0.5;
color = pow(color, vec3(1.0 / 1.5));

gl_FragColor = vec4(color, 1.0);