import React from 'react'
import { Grid, Typography } from '@mui/material'
import { Icon } from '@iconify/react';
import Divider from '@mui/material/Divider';
import TotalRaids from './TotalRaids';
import TransactionHistory from './TransactionHistory';
import History from './History';
const MainDashboard = () => {
  return (
    <div>

        <Grid container sx={{padding:"10px"}}>
            <Grid item xs={12} lg={7.5} sx={{background: '#2C2C2E' , borderRadius: '12px', color:"white", padding:"10px"}}>
                <Typography sx={{display:"flex", justifyContent:"space-between", padding:"50px 20px 50px 20px", width:"100%", }}>
                    <Typography sx={{width:"100%",}} variant="h5">Total visits</Typography>
                    <Typography sx={{display:"flex", justifyContent:"end", alignItems:"center", gap:"50px", width:"100%", }}>
                        <Typography sx={{color:"rgba(235, 235, 245, 0.3)"}}>Provisions Month</Typography>
                        <Typography sx={{background: 'linear-gradient(98.97deg, #2C2C2E 1.64%, rgba(0, 0, 0, 0) 102.85%)',
                                border: '1px solid #3D3C41', borderRadius: '5px', padding:"10px 15px 10px 15px", fontSize:"14px",}}> AUG 2022 <Icon  color="#47DDFC" icon="uil:calender" /></Typography>
                        <Typography sx={{background: 'linear-gradient(98.97deg, #2C2C2E 1.64%, rgba(0, 0, 0, 0) 102.85%)',
                                border: '1px solid #3D3C41', borderRadius: '5px', padding:"10px 15px 10px 15px",}}><Icon color="#47DDFC" icon="charm:menu-meatball" /></Typography>
                    </Typography>
                    <Divider/>
                    <Divider/>
                    <Divider/>
                </Typography>
                <Typography sx={{display:"flex", color:"white"}}>
                    1.00 SOL <Divider color="white"/>
                </Typography>
               <History/>
            </Grid>
            <Grid item xs={12} lg={4.5} sx={{padding:"0 5px 5px 5px"}}>
            <Typography component="div" sx={{background: '#2C2C2E', borderRadius: '12px', padding:"10px", margin:"0 10px 10px 10px"}}>
            <Typography component="div" sx={{color:"white", display:"flex", justifyContent:"space-around"}}>
                <Typography variant='p'> Available to Claim </Typography>
                <Typography component="div" sx={{display:"flex"}}>
                        <Typography variant='p'> 15.3569 </Typography>
                        <Typography variant='p'> Claim </Typography>
                </Typography>

                </Typography>
                    
                
                <Grid container>

                <TotalRaids/>
                </Grid>
               
            </Typography>
            <Typography component="div" sx={{background: '#2C2C2E', borderRadius: '12px', padding:"10px", margin:"10px"}}>
                <TransactionHistory/>
                </Typography>
                
            </Grid>
        </Grid>
      
    </div>
  )
}

export default MainDashboard
