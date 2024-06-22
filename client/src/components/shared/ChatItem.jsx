import React, { memo } from 'react'
import { Link } from '../styles/StyledComponents'
import { Box, Stack, Typography } from '@mui/material'
import AvatarCard from './AvatarCard'
import { motion } from 'framer-motion'
import { activeColor, richBlackColor4, richBlackColor5 } from '../../constants/color'


const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChatOpen,
  chatId
}) => {

  return (
    <>
      <Link to={`/chat/${_id}`} onContextMenu={(e) => handleDeleteChatOpen(e, _id, groupChat)}
        sx={{
          padding: '0',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: '-100%' }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          style={{
            display: "flex",
            gap: '1rem',
            padding: '10px 10px',
            alignItems: 'center',
            // alignSelf: 'center',
            backgroundColor: sameSender ? 'white' : 'unset',
            color: sameSender ? "black" : "black",
            position: 'relative',
            borderBottom: '0.1rem solid 	#eeeeee'

          }}
        >
          <AvatarCard avatar={avatar} />
          <Stack>
            <Typography>{name}</Typography>
            {
              newMessageAlert && <p className=" text-sm text-green-500">{newMessageAlert.count} New Message</p>
            }

          </Stack>
          {
            isOnline && <span className=" absolute right-5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            // <Box sx={{
            //   width: '10px',
            //   height: '10px',
            //   borderRadius: '50%',
            //   backgroundColor: 'green',
            //   position: 'absolute',
            //   top: '50%',
            //   right: '1rem',
            //   transform: 'translateY(-50%)'
            // }} />
          }
        </motion.div>
      </Link>
    </>
  )
}

export default memo(ChatItem)