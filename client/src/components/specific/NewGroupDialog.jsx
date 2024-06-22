import { Button, Dialog, DialogTitle, Skeleton, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import UserItem from '../shared/UserItem'
import { useInputValidation } from '6pp';
import { useDispatch, useSelector } from 'react-redux';
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api/api';
import { useAsyncMutation, useErrors } from '../../hooks/hook';
import { setIsNewGroup } from '../../redux/reducers/misc';
import toast from 'react-hot-toast';



const NewGroupDialog = () => {

  const { isNewGroup } = useSelector((state) => state.misc)
  const { isError, isLoading, error, data } = useAvailableFriendsQuery()
  const [newGroup, newGroupLoading] = useAsyncMutation(useNewGroupMutation)

  const dispatch = useDispatch()

  const [selectedMembers, setSelectedMembers] = useState([])

  const groupName = useInputValidation('')

  const errors = [{ isError, error }]
  useErrors(error)

  const selectMemberHandler = (id) => {

    // setMembers((prev) => prev.map(user => user._id === id ? { ...user, isAdded: !user.isAdded } : user))

    setSelectedMembers((prev) =>
      prev.includes(id) ?
        prev.filter((currentElement) => currentElement !== id)
        : [...prev, id])
  }
  //console.log(selectedMembers)
  const submitHandler = () => {
    if (!groupName.value) {
      return toast.error('Group name is requiered')
    }
    if (selectedMembers.length < 2) {
      return toast.error('Please select atleast 2 members')
    }
    console.log(groupName.value, selectedMembers)
    //Creating Group
    newGroup("Group is creating..", { name: groupName.value, members: selectedMembers })

    // closeHandler()
  }
  const closeHandler = () => {
    dispatch(setIsNewGroup(false))
  }
  return (
    <>
      <Dialog open={isNewGroup} onClose={closeHandler}>
        <Stack p={{ xs: '1rem', sm: '2rem' }} width={'25rem'} spacing={'1rem'}>
          <DialogTitle textAlign={'center'} variant='h4'  >New Group</DialogTitle>
          <Stack  className=' max-sm:w-10/12' >
            <TextField label='Group Name'  value={groupName.value} onChange={groupName.changeHandler} />
            <Typography variant='body1' sx={{ margin: '1rem 0' }} >Members</Typography>
            {isLoading ? <Skeleton /> : data?.friends.map((user, index) => (
              <UserItem user={user} key={index} handler={selectMemberHandler}
                isAdded={selectedMembers.includes(user._id)} />
            ))}
          </Stack>

          <Stack justifyContent={'space-evenly'} direction={'row'}  className=' max-sm:w-10/12' >
            <Button variant='text' color='error' onClick={closeHandler}>Cancel</Button>
            <Button variant='contained' disabled={newGroupLoading} onClick={submitHandler}>Create</Button>
          </Stack>
        </Stack>
      </Dialog>
    </>
  )
}

export default NewGroupDialog