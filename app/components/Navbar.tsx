import { Typography } from '@mui/material'
import Image from 'next/image'

const Navbar = () => {
  return (
    <div className="flex justify-between w-full py-4 items-center">
        <div>
            <Image src="/logo.png" alt="logo" width={50} height={50} />
        </div>

        <div className="flex gap-8 items-center">
            <Typography variant="h6">Home</Typography>
            <Typography variant="h6">Offerings</Typography>
            <Typography variant="h6">About</Typography>
            <Typography variant="h6">Contact</Typography>
        </div>

        <div>
            <Typography variant="h6">Login</Typography>
        </div>
    </div>
  )
}

export default Navbar