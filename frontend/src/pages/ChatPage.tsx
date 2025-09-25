import React from 'react'
import { useAuthStore } from '../store/useAuthStore'

const ChatPage = () => {

  const {logout} = useAuthStore();

  return (
    <div className='z-10'>ChatPage
      <button className='cursor-pointer' onClick={logout}>logout</button>
    </div>
  )
}

export default ChatPage