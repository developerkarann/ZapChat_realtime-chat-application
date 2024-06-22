import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from '@mui/material'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsFileMenu, setUploadingLoader } from '../../redux/reducers/misc'
import { AudioFile as AudioFileIcon, Image as ImageIcon, UploadFile as UploadFileIcon, VideoFile as VideoFileIcon } from '@mui/icons-material'
import toast from 'react-hot-toast'
import { useSendAttachmentsMutation } from '../../redux/api/api'

const FileMenu = ({ ancherE1 ,chatId}) => {
  const dispatch = useDispatch()

  const { isFileMenu } = useSelector((state) => state.misc)

  const [sendAttachments] = useSendAttachmentsMutation()

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const documentRef = useRef(null);

  const closeHandler = () => {
    dispatch(setIsFileMenu(false))
  }
  const fileChangeHandler = async(e, key) => {

    const files = Array.from(e.target.files);

    if (files.length <= 0) return;

    if (files.length > 5) {
      return toast.error("Can't upload more than 5 files")
    }
    dispatch(setUploadingLoader(true))

    const toastId = toast.loading(`Sending ${key}...`)
    closeHandler()

    try {
      //Fetching Here

      const myForm = new FormData()

      myForm.append('chatId',chatId)

      files.forEach((file)=> myForm.append('files', file))

      console.log(myForm)
      const response = await sendAttachments(myForm)

      if(response.data){
        toast.success(`${key} sent successfuly`, {id: toastId})
      }else{
        toast.error(`Failed to send${key} !`,{id: toastId})
      }

    } catch (error) {
      toast.error(error, { id: toastId })
    } finally {
      dispatch(setUploadingLoader(false))
    }
  }

  const selectImage = () => { imageRef.current?.click() }
  const selectAudio = () => { audioRef.current?.click() }
  const selectVideo = () => { videoRef.current?.click() }
  const selectDocument = () => { documentRef.current?.click() }



  return (
    <>
      <Menu anchorEl={ancherE1} open={isFileMenu} onClose={closeHandler}  >
        <div style={{ width: '9.5rem' }}>
          <MenuList>
            <MenuItem onClick={selectImage}>
              <ImageIcon />
              <ListItemText style={{ marginLeft: '0.5rem' }} > Image</ListItemText>
              <input type="file" multiple accept='image/png, image/jpeg image/gif'
                style={{ display: 'none' }} onChange={(e) => fileChangeHandler(e, "Images")} ref={imageRef} />
            </MenuItem>


            <MenuItem onClick={selectAudio}>
              <AudioFileIcon />
              <ListItemText style={{ marginLeft: '0.5rem' }} > Audio</ListItemText>
              <input type="file" multiple accept='audio/mpeg , audio/wav '
                style={{ display: 'none' }} onChange={(e) => fileChangeHandler(e, "Audios")} ref={audioRef} />
            </MenuItem>

            <MenuItem onClick={selectVideo}>
              <VideoFileIcon />
              <ListItemText style={{ marginLeft: '0.5rem' }} >Video</ListItemText>
              <input type="file" multiple accept='video/mp4, video/webm, video/ogg '
                style={{ display: 'none' }} onChange={(e) => fileChangeHandler(e, "Videos")} ref={videoRef} />
            </MenuItem>


            <MenuItem onClick={selectDocument}>
              <UploadFileIcon />
              <ListItemText style={{ marginLeft: '0.5rem' }} >Documents</ListItemText>
              <input type="file" multiple accept='*'
                style={{ display: 'none' }} onChange={(e) => fileChangeHandler(e, "Documents")} ref={documentRef} />
            </MenuItem>
          </MenuList>
        </div>
      </Menu>
    </>
  )
}

export default FileMenu