import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layouts/AdminLayout'
import Table from '../../components/specific/Table'
import { dashboardData } from '../../constants/sampleData'
import { fileFormate, transformImage } from '../../lib/features'
import moment from 'moment'
import { Avatar, Box, Skeleton, Stack } from '@mui/material'
import RenderAttachment from '../../components/shared/RenderAttachment'
import { useFetchData } from '6pp'
import { useErrors } from '../../hooks/hook'
import { server } from '../../constants/config'


const Mesasges = () => {

  const { loading, data, error } = useFetchData(`${server}/api/admin/messages`, 'dashboard-messages')

  console.log(data)

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
      field: 'attachments',
      headerName: 'Attachments',
      headerClassName: 'table-header',
      width: 200,
      renderCell: (params) => {
        const { attachment } = params.row
        return attachment?.length > 0 ? attachment.map((i) => {
          const url = i.url;
          const file = fileFormate(url);
          return <Box>
            <a href={url} download target='_blank' style={{ color: 'black' }} > {RenderAttachment(file, url)} </a>
          </Box>
        }) : 'No Attachments'
      }
    },
    {
      field: 'content',
      headerName: 'Content',
      headerClassName: 'table-header',
      width: 400
    },
    {
      field: 'sender',
      headerName: 'Sent By',
      headerClassName: 'table-header',
      width: 200,
      renderCell: (params) => (
        <Stack direction={'row'} spacing={'1rem'} alignItems={'center'} >
          <Avatar alt={params.row.name} src={params.row.sender.avatar} />
          <span>{params.row.sender.name}</span>
        </Stack>
      )
    },
    {
      field: 'chat',
      headerName: 'Chat',
      headerClassName: 'table-header',
      width: 220
    },
    {
      field: 'groupChat',
      headerName: 'Group Chat',
      headerClassName: 'table-header',
      width: 200
    },
    {
      field: 'craetedAt',
      headerName: 'Time',
      headerClassName: 'table-header',
      width: 240
    },
  ]

  useEffect(() => {
    if (data) {
      setRows(data.messages.map((i) => ({
        ...i,
        id: i._id,
        sender: {
          name: i.sender.name,
          avatar: transformImage(i.sender.avatar, 50)
        },
        craetedAt: moment(i.createdAt).format('MMMM Do YYYY,h:m:ss a')
      })))
    }
  }, [data])


  return (
    <AdminLayout>
     {
      loading ? <Skeleton  height={"100vh"} /> :  <Table heading={'All Messages'} columns={columns} rows={rows} rowHeight={160} />
     }
    </AdminLayout>
  )
}

export default Mesasges