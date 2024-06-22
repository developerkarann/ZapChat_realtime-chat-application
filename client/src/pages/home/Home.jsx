import React from 'react'
import AppLaylout from '../../components/layouts/AppLaylout'
import { activeColor } from '../../constants/color'

const Home = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-700">
            <div className="mb-6">
                <img className=' w-96' src="./assest/selectUser2.png" alt="" />
            </div>
            <div className=" text-2xl" >
                Please select a friend to chat with
            </div>
        </div>
    </>
  )
}

export default AppLaylout()(Home)