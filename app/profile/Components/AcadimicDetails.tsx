import { Grid, Typography } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"

const AcadimicDetails = () => {
  return (
    <Grid size={{ xs: 12, md: 4 }} sx={{
        backgroundColor: '#25666e',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
    }}>
       <div className="flex justify-between items-center">
       <Typography variant="h3" color="white">Acadimic Details</Typography>
       <EditIcon  />
       </div>
        <div className="flex justify-between items-center mt-2 border-b border-white pb-2">
            <Typography variant="body1" color="white">College</Typography>
            <Typography variant="body1" color="white">MIT WPU</Typography>
        </div>
        <div className="flex justify-between items-center mt-2 border-b border-white pb-2">
            <Typography variant="body1" color="white">Branch</Typography>
            <Typography variant="body1" color="white">Computer Science and Engineering</Typography>
        </div>
        <div className="flex justify-between items-center mt-2 border-b border-white pb-2">
            <Typography variant="body1" color="white">Semester</Typography>
            <Typography variant="body1" color="white">1</Typography>
        </div>
       
        <div className="flex justify-between items-center mt-2 border-b border-white pb-2">
            <Typography variant="body1" color="white">Year of Graduation</Typography>
            <Typography variant="body1" color="white">2027</Typography>
        </div>
        <div className="flex justify-between items-center mt-2 border-b border-white pb-2">
            <Typography variant="body1" color="white">Year of Joining</Typography>
            <Typography variant="body1" color="white">2023</Typography>
        </div>
        <div className="flex justify-between items-center mt-2 border-b border-white pb-2">  
            <Typography variant="body1" color="white">CGPA</Typography>
            <Typography variant="body1" color="white">9.0</Typography>
        </div>
        <div className="flex justify-between items-center mt-2 border-b border-white pb-2">
            <Typography variant="body1" color="white"                   >Degree</Typography>
            <Typography variant="body1" color="white">B.Tech</Typography>
        </div>
        <div className="flex justify-between items-center mt-2 border-b border-white pb-2">
            <Typography variant="body1" color="white">Years of Experience</Typography>
            <Typography variant="body1" color="white">3</Typography>
        </div>
    </Grid>
  )
}

export default AcadimicDetails