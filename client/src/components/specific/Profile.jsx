import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'
import { Face as FaceIcon, AlternateEmail as UsernameIcon, CalendarMonth as CalendarIcon } from '@mui/icons-material'
import moment from 'moment'
import { transformImage } from '../../lib/features'

const Profile = ({ user }) => {


  return (
    <>
      <Stack spacing={'2rem'} direction={'column'} alignItems={'center'}>
        <Avatar src={transformImage(user?.data?.avatar?.url)} sx={{
          width: 200,
          height: 200,
          objectFit: 'contain',
          marginBottom: '1rem',
          border: '3px solid white'
        }} />
        <ProfileCard heading={'Name'} text={user?.data?.name} Icon={<FaceIcon />} />
        <ProfileCard heading={'Username'} text={user?.data?.username} Icon={<UsernameIcon />} />
        <ProfileCard heading={'bio'} text={user?.data?.bio} />
        <ProfileCard heading={'Joined'} text={moment(user?.data?.createdAt).fromNow()} Icon={<CalendarIcon />} />
      </Stack>
    </>
  )
}

const ProfileCard = ({ text, Icon, heading }) => {
  return (
    <>
      <Stack direction={'row'} alignItems={'center'} spacing={'1rem'} color={'white'} textAlign={'center'}>
        {Icon && Icon}

        <Stack>
          <Typography variant='body1'>{text}</Typography>
          <Typography color={'gray'} variant='caption'>{heading}</Typography>
        </Stack>
      </Stack>
    </>
  )
}
export default Profile