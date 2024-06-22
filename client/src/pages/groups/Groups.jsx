import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Add, Delete, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon } from '@mui/icons-material';
import { Backdrop, Box, Button, CircularProgress, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import React, { Suspense, lazy, memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { LayoutLoader } from "../../components/layouts/Loaders";
import AvatarCard from '../../components/shared/AvatarCard';
import UserItem from '../../components/shared/UserItem';
import NewGroupDialog from '../../components/specific/NewGroupDialog';
import { Link } from '../../components/styles/StyledComponents';
import { activeColor, mateBlack, sideBarBgColor } from '../../constants/color';
import { useAsyncMutation, useErrors } from '../../hooks/hook';
import { useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from '../../redux/api/api';
import { setIsAddMember, setIsNewGroup } from '../../redux/reducers/misc';
import Title from '../../components/shared/Title';

const DeleteDialog = lazy(() => import('../../components/dialogs/ConfirmDeleteDialog'))
const AddMemberDialog = lazy(() => import('../../components/dialogs/AddMemberDialog'))


export default function Groups() {
  const chatId = useSearchParams()[0].get('group')
  const dispatch = useDispatch()
  const location = useLocation()

  const { isAddMember } = useSelector((state) => state.misc)
  const { isNewGroup } = useSelector((state) => state.misc)


  const myGroups = useMyGroupsQuery("");

  const groupDetails = useChatDetailsQuery({ chatId, populate: true }, { skip: !chatId });

  const [renameGroup, isLoadingGroupName] = useAsyncMutation(useRenameGroupMutation)

  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(useRemoveGroupMemberMutation)

  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(useDeleteChatMutation)

  const { user } = useSelector((state) => state.auth)

  const [isMobileMenu, setMobileMenu] = useState(false)
  const [isEdit, setisEdit] = useState(false);
  const [groupName, setGroupName] = useState('')
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState('')
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false)
  const [members, setMembers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')


  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error
    }
  ]

  useErrors(errors)


  useEffect(() => {
    if (groupDetails.data) {
      setGroupName(groupDetails.data.chat.name);
      setGroupNameUpdatedValue(groupDetails.data.chat.name)
      setMembers(groupDetails.data.chat.members)
    }

    return () => {
      setGroupName('');
      setGroupNameUpdatedValue('')
      setMembers([])
      setisEdit(false)
    }
  }, [groupDetails.data])



  const navigate = useNavigate()


  const navigateBack = () => {
    navigate('/')
  }
  const handleMobile = () => {
    setMobileMenu((prev) => !prev);
  }
  const handleMobileClose = () => {
    setMobileMenu(false)
  }
  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true)
  }
  const closeConfirmDeletehandler = () => {
    setConfirmDeleteDialog(false)
  }
  const deleteHandler = () => {
    deleteGroup('Deleteing group...', chatId)
    closeConfirmDeletehandler()
    navigate('/groups')
  }
  const openAddMember = () => {
    dispatch(setIsAddMember(true))
  }

  const removeMemberHandler = (userId) => {
    removeMember('Removing members', { chatId, userId })
  }
  const openNewGroup = () => {
    dispatch(setIsNewGroup(true))
  }

  const filteredChatItems = myGroups?.data?.groups.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );




  const IconsButtons = <>
    <Box sx={{ display: { xs: 'block', sm: 'none', position: 'fixed', right: '2rem', top: '1rem', } }}>

      <IconButton onClick={handleMobile}>
        <MenuIcon style={{ color: 'white', fontSize: '40px' }} />
      </IconButton>

    </Box>

    <Tooltip title="back">
      <IconButton sx={{ position: 'absolute', top: '2rem', left: "2rem", bgcolor: mateBlack, "&:hover": { bgcolor: 'rgba(0,0,0,0.7)' }, color: 'white' }} onClick={navigateBack}>
        <KeyboardBackspaceIcon />
      </IconButton>
    </Tooltip>
  </>

  const updateGroupNameHandler = () => {
    setisEdit(false)
    renameGroup('Updating group name...', { chatId, name: groupNameUpdatedValue })
  }

  const GroupNameComponent = <>

    <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} spacing={'1rem'} padding={' 5rem 0 0 0'}>
      {isEdit ?
        <>
          <TextField value={groupNameUpdatedValue} onChange={(e) => setGroupNameUpdatedValue(e.target.value)} style={{ backgroundColor: '#eeeeee', borderRadius: '10px' }} />
          <IconButton onClick={updateGroupNameHandler} disabled={isLoadingGroupName} > <DoneIcon style={{ color: 'white' }} /> </IconButton>
        </>
        :
        <>
          <Typography variant='h5' color="white"> {groupName}</Typography>
          <IconButton onClick={() => setisEdit(true)} disabled={isLoadingGroupName} > <EditIcon style={{ color: 'white' }} />  </IconButton>
        </>}
    </Stack>
  </>

  const ButtonGroup = <>
    <Stack direction={{ sx: 'column-reverse', sm: 'row' }} p={{ xs: '0', sm: '1rem', md: '1rem 4rem' }}>
      <Button size='large' color='error' startIcon={<Delete />} onClick={openConfirmDeleteHandler} >Delete Group</Button>
      <Button size='large' variant='contained' startIcon={<Add />} onClick={openAddMember} >Add Members</Button>
    </Stack>
  </>


  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`)
      setGroupNameUpdatedValue(`Group Name ${chatId}`)
    }

    return () => {
      setGroupName("")
      setGroupNameUpdatedValue('')
      setisEdit(false);
    }
  }, [chatId])


  return myGroups.isLoading ? <LayoutLoader /> : (
    <>
        <Title title='ZapChat - My Groups' />

      {/* Left Container  */}
      <Grid container height={'100vh'}>

        <Grid className={` max-sm:hidden `} item style={{ height: '100%' }} sm={4} bgcolor={'bisque'}>

          {/* <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} /> */}

          <div className={`flex flex-col  h-full text-white transition-all duration-300 max-md:w-full`} style={{ backgroundColor: sideBarBgColor, borderRight: ' #666' }} >
            <div className="flex items-center p-4 pt-6 justify-between shadow-2xl " style={{ backgroundColor: sideBarBgColor }} >
              <div className="flex items-center ">
                <img src={user?.avatar.url} alt="User profile" className="w-12 h-12 rounded-full mr-4 " />
                <h1 className="text-xl font-bold">{user?.name}</h1>
              </div>
            </div>

            <div className="p-3 px-4">
              <div className="flex items-center p-2 rounded" style={{ backgroundColor: '	#eaeaea' }}>
                <FontAwesomeIcon icon={faSearch} className="mr-2 text-gray-500" />

                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-gray-500 placeholder-gray-500 w-full"
                />

              </div>
            </div>
            <div className="flex-1 overflow-y-auto ">

              {
                filteredChatItems.length === 0 ? <>
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    <h1 className='text-white mb-5 text-lg'>Please create a group</h1>
                    <img onClick={openNewGroup} className=' w-72 hover:cursor-pointer' src="./assest/add_friend2.png" alt="" />
                  </div>
                </> : filteredChatItems?.map((group, index) => {
                  return (
                    <GroupListItem group={group} chatId={chatId} key={group._id} />
                  )

                })

              }
            </div>
          </div>


        </Grid>

        {/* Right Container  */}

        <Grid className={`max-md:${location.pathname === '/groups' ? ' hidden' : 'block'} `} item xs={12} sm={8} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', padding: '0', margin: '0', backgroundColor: sideBarBgColor }}>

          {IconsButtons}

          {groupName ? <>
            {GroupNameComponent}
            <Typography margin={'2rem'} alignSelf={'flex-start'} variant='body1' color="white" >Members</Typography>

            <Stack maxWidth={'45rem'} width={'100%'} boxSizing={'border-box'} spacing={'2rem'} height={'50vh'} overflow={'auto'} padding={{ sm: '1rem', xs: '0', md: '1rem, 4rem', }}>

              {/* Group Members  */}

              {
                isLoadingRemoveMember ? (<CircularProgress />) : members.map((data, index) => (
                  <UserItem user={data} isAdded key={index} handler={removeMemberHandler}
                    styling={{
                      boxShadow: '0 0 0.2rem rgba(0,0,0.2)',
                      padding: '1rem 2rem',
                      borderRadius: '1rem',
                      backgroundColor: '#eeeeee'
                    }} />
                ))
              }


            </Stack>

            {ButtonGroup}
          </> : <>
            <div className="flex flex-col justify-center items-center h-screen">
              <img className='w-96' src="./assest/selectUser2.png" alt="" />
              <h1 className=" text-3xl text-white">Please select a group </h1>
            </div>
          </>}



        </Grid>

        <Drawer sx={{ display: { xs: 'block', sm: 'none' } }} open={isMobileMenu} onClose={handleMobileClose}>
          {/* <GroupsList w={'50vw'} myGroups={myGroups?.data?.groups} chatId={chatId} /> */}

          <div className={`flex flex-col  w-full  h-full text-white transition-all duration-300 max-md:w-full`} style={{ backgroundColor: sideBarBgColor, borderRight: '#eeeeee' }} >
            <div className="flex items-center p-2 justify-between " style={{ backgroundColor: activeColor }} >
              <div className="flex items-center ">
                <img src={user?.data?.avatar.url} alt="User profile" className="w-12 h-12 rounded-full mr-4 " />
                <h1 className="text-xl font-bold">{user?.data?.name}</h1>
              </div>
            </div>

            <div className="p-3 px-4">
              <div className="flex items-center p-2 rounded" style={{ backgroundColor: '	#eaeaea' }}>
                <FontAwesomeIcon icon={faSearch} className="mr-2 text-gray-500" />

                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-gray-500 placeholder-gray-500 w-full"
                />

              </div>
            </div>
            <div className="flex-1 overflow-y-auto ">

              {
                filteredChatItems?.map((group, index) => {
                  return (
                    <GroupListItem group={group} chatId={chatId} key={group._id} />
                  )

                })

              }
            </div>
          </div>

        </Drawer>


        {confirmDeleteDialog && <Suspense fallback={<Backdrop open />} ><DeleteDialog open={confirmDeleteDialog} handleClose={closeConfirmDeletehandler} deleteHandler={deleteHandler} /></Suspense>}

        {isAddMember && <Suspense fallback={<Backdrop open />}>  <AddMemberDialog chatId={chatId} />   </Suspense>}

      </Grid>
      {
        isNewGroup && (
          <Suspense fallback={<Backdrop open />}>
            <NewGroupDialog />
          </Suspense>
        )
      }

    </>
  )
}


const GroupsList = ({ w = '100%', myGroups = [], chatId }) => {
  return (
    <>
      <Stack width={w} height={'100vh'} overflow={'auto'}>
        {
          myGroups.length > 0 ? myGroups.map((group) => (
            <GroupListItem group={group} chatId={chatId} key={group._id} />
          )) : <Typography textAlign={'center'} padding={'1rem'} >No Groups</Typography>
        }
      </Stack>
    </>
  )
}


const GroupListItem = memo(({ group, chatId }) => {

  const { name, avatar, _id } = group;

  return (
    <>
      <Link to={`?group=${_id}`} onClick={(e) => {
        if (chatId === _id) {
          e.preventDefault()
        }
      }} style={{ margin: '0', padding: '0' }} >
        <Stack direction={'row'} spacing={'1rem'} alignItems={'center'} style={{ borderBottom: ' #666', padding: '15px 20px', color: ' white' }} >
          <AvatarCard avatar={avatar} />
          <Typography>{name}</Typography>
        </Stack>
      </Link>
    </>
  )

})