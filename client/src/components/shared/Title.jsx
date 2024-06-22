import React from 'react'
import { Helmet} from 'react-helmet-async'
const Title = ({title="Chat Application", description="his  is the chat app"}) => {
  return (
   <Helmet>
    <title>{title}</title>
    <meta name='description' content={description} />
   </Helmet>
  )
}

export default Title