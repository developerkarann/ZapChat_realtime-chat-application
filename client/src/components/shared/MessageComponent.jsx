import { Box, Typography } from '@mui/material';
import React, { memo } from 'react'
import { activeColor, lightBlue } from '../../constants/color';
import moment from 'moment';
import { fileFormate } from '../../lib/features';
import RenderAttachment from './RenderAttachment';
import { motion } from 'framer-motion'

const MessageComponent = ({ message, user }) => {
    const { sender, content, attachment = [], createdAt } = message;

    const sameSender = sender?._id === user?._id;

    // console.log(sender?._id,user?._id)

    const timeAgo = moment(createdAt).fromNow()

    // console.log(attachment)

    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: "-100%" }}
                whileInView={{ opacity: 1, x: 0 }}
                style={{
                    alignSelf: sameSender ? 'flex-end' : 'flex-start',
                    backgroundColor: sameSender ? activeColor : 'white',
                    borderRadius: '10px',
                    padding: '0.5rem 1rem',
                    margin: '0.2rem',
                    width: 'fit-content',
                    color: sameSender ? 'white': 'unset'
                }} className={'shadow-md'} >
                {
                    !sameSender && <Typography color={lightBlue} fontWeight={'600'} variant='caption' >{sender && sender.name}</Typography>
                }

                {
                    content && <Typography>{content}</Typography>
                }

                {/* Attachment  */}
                {
                    attachment.length > 0 && attachment.map((i, index) => {
                        const url = i.url;
                        //  console.log(url)
                        const file = fileFormate(url);
                        //  console.log(file)
                        return (
                            <Box key={index}>
                                <a href={url} target='_blank' download style={{ color: 'black' }}>

                                    {RenderAttachment(file, url)}

                                </a>
                            </Box>
                        )
                    })
                }

                {/* <Typography variant='caption' color={'text.secondary'} >{timeAgo}</Typography> */}

            </motion.div>
        </>
    )
}

export default memo(MessageComponent)