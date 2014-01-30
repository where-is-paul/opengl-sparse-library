//test fragment shader

#version 130

// a very badly done lanczos with no breakdown checking
// just as a template for sparse minres
vec4 minres(mat4 A, vec4 b, vec4 x0) {
    int n = 4;
    mat4 V = mat4(0);
    mat4 T = mat4(0);
    
    // set number of inner its before restart
    int iters = 4;
    vec4 wj;
    float alpha[5], beta[5];
    
    for (int i = 0; i < 5; i++) {
        alpha[i] = 0;
        beta[i] = 0;
    }
    
    //set initial vector for orthogonal basis
    vec4 r0 = b-A*x0;
    beta[0] = length(r0);
    V[0] = r0/beta[0];
    for (int j = 0; j < iters; j++) {
        if (j == 0) {
            wj = A*V[0];
        } else {
            wj = A*V[j]-beta[j]*V[j-1];
        }
        alpha[j] = dot(wj,V[j]);
        wj = wj - alpha[j]*V[j];
        beta[j+1] = length(wj);
        
        //breakdown check would go here
        //end imaginary breakdown check
        
        if (j != iters-1) {
            V[j+1] = wj/beta[j+1];
        }
    }
    
    for (int i = 0; i < iters; i++) {
        T[i][i] = alpha[i];
        if (i < iters-1) {
            T[i][i+1] = beta[i+1];
            T[i+1][i] = beta[i+1];
        }
    }
    
    //change inverse(T) to be computed by givens rotations
    //in the sparse version
    vec4 e1 = vec4(1,0,0,0);
    return x0+V*inverse(T)*(beta[0]*e1);
}

void main()
{
    //define matrix
    mat4 A;
    /*
    A[0].xyzw = vec4(0.1,0.2,0.3,1.0);
    A[1].xyzw = vec4(0.2,0.5,0.0,2.0);
    A[2].xyzw = vec4(0.3,0.0,0.7,3.0);
    A[3].xyzw = vec4(1.0,2.0,3.0,4.0);
    */
    A[0].xyzw = vec4(1,2,3,4);
    A[1].xyzw = vec4(2,1,2,3);
    A[2].xyzw = vec4(3,2,1,2);
    A[3].xyzw = vec4(4,3,2,1);
    
    //define RHS
    //vec4 b = vec4(3.0,2.2,1.8,2.0);
    vec4 b = gl_FragCoord;
	
	// 10 iterations of minres
	vec4 x = vec4(0), y;
	for (int i = 0; i < 10; i ++) {
	    y = minres(A,b,x);
	    if (length(x-y) < 1e-8) {
	        //x = vec4(1);
	        break;
	    }
	    x = y;
	}
	
	gl_FragColor = x;
    //gl_FragColor = vec4(0.1, 0.2, 0.3, 0.4);
}
