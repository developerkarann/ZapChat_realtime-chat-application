import { Add, Remove } from '@mui/icons-material';
import { Avatar, IconButton, ListItem, Stack, Typography } from '@mui/material';
import React, { memo } from 'react';
import { transformImage } from '../../lib/features';

const UserItem = ({ user, handler, handlerIsLoaidng, isAdded = false, styling = {} }) => {

  const { name, _id, avatar } = user;

  return (
    <>
      <ListItem >
        <Stack direction={'row'} alignContent={'center'} spacing={'1rem'} width={'100%'} {...styling}>
          <Avatar src={avatar} />
          <Typography variant='body1' sx={{
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '1005'
          }}>{name}</Typography>

          <IconButton
            size='small'
            sx={{
              bgcolor: isAdded ? 'error.main' : 'primary.main',
              color: 'white',
              "&:hover": {
                bgcolor: isAdded ? 'error.dark' : 'primary.dark'
              }
            }}

            onClick={() => handler(_id)} disabled={handlerIsLoaidng}>
            {
              isAdded ? <Remove /> : <Add />
            }
          </IconButton>
        </Stack>
      </ListItem>
    </>
  )
}

export default memo(UserItem) 