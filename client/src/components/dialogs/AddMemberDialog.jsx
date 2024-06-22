import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAsyncMutation, useErrors } from '../../hooks/hook'
import { useAddGroupMemberMutation, useAvailableFriendsQuery } from '../../redux/api/api'
import { setIsAddMember } from '../../redux/reducers/misc'
import UserItem from '../shared/UserItem'

const AddMemberDialog = ({ chatId }) => {
    const dispatch = useDispatch()

    const { isAddMember } = useSelector((state) => state.misc)

    const [addMembers, isLoadingAddMembers] = useAsyncMutation(useAddGroupMemberMutation)
    const { isLoading, data, error, isError } = useAvailableFriendsQuery(chatId)

    const [selectedMembers, setSelectedMembers] = useState([])


    const selectMemberHandler = (id) => {
        // setMembers((prev) => prev.map(user => user._id === id ? { ...user, isAdded: !user.isAdded } : user))
        setSelectedMembers((prev) =>
            prev.includes(id) ?
                prev.filter((currentElement) => currentElement !== id)
                : [...prev, id])
    }


    const closeHandler = () => {
        dispatch(setIsAddMember(false))
    }
    const addMemberSubmitHandler = () => {
        addMembers('Adding members', { members: selectedMembers, chatId })
        closeHandler()
    }

    useErrors([{ isError, error }])

    return (
        <>
            <Dialog open={isAddMember} onClose={closeHandler}>
                <Stack p={'2rem'} spacing={'2rem'} width={'30rem'}  >
                    <DialogTitle textAlign={'center'}>Add Members</DialogTitle>

                    <Stack>
                        {
                            isLoading ? <Skeleton /> : data?.availableFriends?.length > 0 ? data?.availableFriends?.map((data, index) => {
                                return (
                                    <UserItem key={index} user={data} handler={selectMemberHandler} isAdded={selectedMembers.includes(data._id)} />
                                )
                            }) : <Typography textAlign={'center'}>No Friends</Typography>
                        }
                    </Stack>

                    <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} >
                        <Button color='error' onClick={closeHandler}>Cancel</Button>
                        <Button onClick={addMemberSubmitHandler} variant='contained' disabled={isLoadingAddMembers} > Submit</Button>
                    </Stack>
                </Stack>
            </Dialog>
        </>
    )
}

export default AddMemberDialog