
import { Typography, Avatar } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { isLoggedIn } from '@/app/utils/auth'

const Navbar = () => {
  return (
    <div className="flex justify-between w-full px-8 py-4 items-center">
        <div>
            <Link href="/">
              <Image src="/logo.png" alt="logo" width={50} height={50} style={{ cursor: 'pointer' }} />
            </Link>
        </div>

        <div className="flex gap-8 items-center">
            <Typography variant="h6">Home</Typography>
            <Typography variant="h6">Offerings</Typography>
            <Typography variant="h6">About</Typography>
            <Typography variant="h6">Contact</Typography>
        </div>

        <div>
          {isLoggedIn() ? (
            <Link href="/profile">
              <Avatar
                src="/auth/profile.png"
                alt="Profile"
                sx={{
                  width: 40,
                  height: 40,
                  cursor: 'pointer',
                  border: '2px solid #25666e',
                }}
              />
            </Link>
          ) : (
            <Typography variant="h6">
              <Link href="/auth/login">Login</Link>
            </Typography>
          )}
        </div>
    </div>
  )
}

export default Navbar