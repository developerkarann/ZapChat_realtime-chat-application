import { useInputValidation } from '6pp'
import { Search as SearchIcon } from '@mui/icons-material'
import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAsyncMutation } from '../../hooks/hook'
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api'
import { setIsSearch } from '../../redux/reducers/misc'
import UserItem from '../shared/UserItem'

const Search = () => {

  const { isSearch } = useSelector((state) => state.misc)

  const [searchUser] = useLazySearchUserQuery()
  const [sendFriendRequest, isLoadingSendFriendRequest] =  useAsyncMutation(useSendFriendRequestMutation)

  const dispatch = useDispatch()

  const search = useInputValidation('')
  const [users, setUsers] = useState([]);

  const addFriendHandler = async (id) => {
    // console.log(id)
   await sendFriendRequest('Sending Friend Request...', {userId: id})
  }

  // let isLoadingSendFriendRequest = false

  const handleClose = () => {
    dispatch(setIsSearch(false))
  }

  useEffect(() => {

    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUsers(data.users))
        .catch((error) => console.log(error))
    }, 1000);

    return () => {
      clearTimeout(timeOutId)
    }
  }, [search.value])


  return (
    <>
      <Dialog open={isSearch} onClose={handleClose}>
        <Stack p={'1rem'} direction={'column'} width={'22rem'}  >
          <DialogTitle textAlign={'center'}>Find People</DialogTitle>
          <TextField label='' className=' max-sm:w-11/12'  value={search.value} onChange={search.changeHandler} placeholder='Search' variant='outlined' size='small'
            inputProps={{
              startadorment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              )
            }} />

          <List className=' max-sm:w-11/12' >
            {users && users.map((user) => (
              <UserItem user={user} key={user._id} handler={addFriendHandler} handlerIsLoaidng={isLoadingSendFriendRequest} />
            ))}
          </List>
        </Stack>
      </Dialog>
    </>
  )
}

export default Search