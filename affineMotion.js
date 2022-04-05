function affineMotion(quaternions, vectors) {
   
  let HInt = [];
  let SH = [];
  
  for(let i=0; i <n; i++){
      
     let q1 = quaternions[i];
     let d1 = vectors[i];
 
     let Q1 = dualQuaternion(q1,d1);
   
     let H1 = homogenousMatrix(Q1);
    
     HInt[i] = H1

    }
   let t = 0;
   while( t <=1) {
        for(let r=1; r< n; r++){
           for(let i = 0; i < n-r; i++) {
               let H1 = HInt[i];
               let H2 = HInt[i+1];

               let sH1 = math.multiply(1-t, [
                 [H1[0][0], H1[0][1], H1[0][2], H1[0][3]],
                 [H1[1][0], H1[1][1], H1[1][2], H1[1][3]],
                 [H1[2][0], H1[2][1], H1[2][2], H1[2][3]],
                 [H1[3][0], H1[3][1], H1[3][2], H1[3][3]]
               ])
               let sH2 = math.multiply(t, [
                 [H2[0][0], H2[0][1], H2[0][2], H2[0][3]],
                 [H2[1][0], H2[1][1], H2[1][2], H2[1][3]],
                 [H2[2][0], H2[2][1], H2[2][2], H2[2][3]],
                 [H2[3][0], H2[3][1], H2[3][2], H2[3][3]]
               ])    
              HInt[i] = math.add(sH1,sH2)
      }
    }
     
     SH = HInt[0];   
     push()
     applyMatrix(SH[0][0], SH[0][1], SH[0][2], 0.0,
                 SH[1][0], SH[1][1], SH[1][2], 0.0,
                 SH[2][0], SH[2][1], SH[2][2], 0.0,
                 SH[0][3], SH[1][3], SH[2][3], 1.0);
     drawAffineFrame(15, 3)
     pop()
     t = t+0.01;
   }
  

}