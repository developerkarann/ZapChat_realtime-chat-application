import { Avatar, Skeleton, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layouts/AdminLayout'
import AvatarCard from '../../components/shared/AvatarCard'
import Table from '../../components/specific/Table'
import { dashboardData } from '../../constants/sampleData'
import { transformImage } from '../../lib/features'
import { useFetchData } from '6pp'
import { server } from '../../constants/config'
import { useErrors } from '../../hooks/hook'


const ChatManagement = () => {

  const { loading, data, error } = useFetchData(`${server}/api/admin/chats`, 'dashboard-chats')

  useErrors([
    {
      isError: error,
      error: error
    }
  ])

  const [rows, setRows] = useState([])

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      headerClassName: 'table-header',
      width: 200
    },
    {
      field: 'avatar',
      headerName: 'Avatar',
      headerClassName: 'table-header',
      width: 100,
      renderCell: (params) => (
        <AvatarCard avatar={params.row.avatar} />
      )
    },
    {
      field: 'name',
      headerName: 'Name',
      headerClassName: 'table-header',
      width: 150
    },
    {
      field: 'groupChat',
      headerName: 'Group',
      headerClassName: 'table-header',
      width: 150
    },
    {
      field: 'totalMembers',
      headerName: 'Total Members',
      headerClassName: 'table-header',
      width: 150
    },
    {
      field: 'members',
      headerName: 'Members',
      headerClassName: 'table-header',
      width: 150,
      renderCell: (params) => (
        <AvatarCard avatar={params.row.members} />
      )
    },
    {
      field: 'totalMessages',
      headerName: 'Total Messages',
      headerClassName: 'table-header',
      width: 120
    },
    {
      field: 'creator',
      headerName: 'craeted By',
      headerClassName: 'table-header',
      width: 250,
      renderCell: (params) => (
        <Stack direction='row' alignItems='center' spacing='1rem'>
          <Avatar alt={params.row.creator.avatar} src={params.row.creator.avatar} />
          <span>{params.row.creator.name}</span>
        </Stack>
      )
    },
  ]

  useEffect(() => {
    if (data) {
      setRows(data.chats.map((i) => ({
        ...i,
        id: i._id,
        avatar: i.avatar.map((i) => transformImage(i, 50)),
        members: i.members.map((i) => transformImage(i.avatar, 50)),
        creator: {
          name: i.creator.name,
          avatar: transformImage(i.creator.avatar, 50)
        }
      })))
    }
  }, [data])

  return (
    <AdminLayout>
      {
        loading ? <Skeleton height={"100vh"}  /> : <Table columns={columns} rows={rows} heading={'All Chats'} />
      }
    </AdminLayout>
  )
}


export default ChatManagement