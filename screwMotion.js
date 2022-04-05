function screwMotion(quaternions, vectors) {
  
    for(let i=0; i <n-1; i++){
      
     let q1 = quaternions[i];
     let d1 = vectors[i];
     let q2 = quaternions[i+1];
     let d2 = vectors[i+1];
     let t = 0;
      
     while(t <= 1) {
       
          let sq1 = math.multiply(1-t, [q1[0],q1[1], q1[2], q1[3]]) 
          let sq2 = math.multiply(t, [q2[0],q2[1], q2[2], q2[3]]);
          let sq = math.add(sq1,sq2);
          let sd1 = math.multiply(1-t, [d1[0],d1[1], d1[2], d1[3]]) 
          let sd2 = math.multiply(t, [d2[0],d2[1], d2[2], d2[3]]);
          let sd = math.add(sd1,sd2);
          
          let sQuat = dualQuaternion(sq, sd)
       
          push()
          drawObject(sQuat)
          drawScrewFrame(15, 3)
          pop()
          t = t + 0.1;
      }


  }
  
}