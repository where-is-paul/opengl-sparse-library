//test fragment shader

#version 130

float x = 0.1;
float test() {
    x = x + 0.1;
    return x;
}

mat3 matrix;
vec3 v;
float power_method(mat3 matrix) {
    //set starting vector
    v = vec3(1.0, 0.0, 0.0);
    float last = 1e10, curr = 0;
    while (abs(last-curr) > 1e-5) {
        v = matrix*v;
        last = curr;
        curr = length(v);
        v = normalize(v);
    }
    return curr;
}

float arr[4];
void main()
{
    matrix[0].xyz = vec3(0.1,0.2,0.3);
    matrix[1].xyz = vec3(0.3,0.5,0.6);
    matrix[2].xyz = vec3(0.2,0,0.7);
    
    //arr[0] = 0.1, arr[1] = 0.2, arr[2] = 0.3, arr[3] = 0.4;
	//gl_FragColor = vec4(test(),test(),test(),test());
	//gl_FragColor = vec4(arr[0], arr[1], arr[2], arr[3]);
	
	gl_FragColor = vec4(power_method(matrix),
	                    power_method(matrix),
	                    power_method(matrix),
	                    power_method(matrix));
    
}
