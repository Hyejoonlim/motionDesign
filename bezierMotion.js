function bezierMotion(quaternions, vectors) {
    
   let qInt = [];
   let dInt = [];
   let qS;
   let dS;
  
   for(let i=0; i<n; i++ ) {
     qInt[i] = quaternions[i];
     dInt[i] = vectors[i];
   }
  
   let t = 0;
   while( t <=1) {
        for(let r=1; r< n; r++){
           for(let i = 0; i < n-r; i++) {
               let q1 = qInt[i];
               let d1 = dInt[i];
               let q2 = qInt[i+1];
               let d2 = dInt[i+1];
               
               let sq1 = math.multiply(1-t, [q1[0],q1[1], q1[2], q1[3]]) 
               let sq2 = math.multiply(t, [q2[0],q2[1], q2[2], q2[3]]);
               qInt[i] = math.add(sq1,sq2);
               let sd1 = math.multiply(1-t, [d1[0],d1[1], d1[2], d1[3]]) 
               let sd2 = math.multiply(t, [d2[0],d2[1], d2[2], d2[3]]);
               dInt[i] = math.add(sd1,sd2);
      }
    }
     qS = qInt[0];
     dS = dInt[0];
     let sQuat = dualQuaternion(qS, dS)
       
      push()
      drawObject(sQuat)
      drawBezierFrame(15, 3)
      pop()
      t = t+0.01;
   }

  
}