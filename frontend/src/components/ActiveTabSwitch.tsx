import React from 'react'
import { useChatStore } from '../store/useChatStore'

const ActiveTabSwitch = () => {

  const { activeTab, setActiveTab } = useChatStore();

  console.log(activeTab);

  return (
    <div className='tabs tabs-box bg-transparent p-2 m-2 flex w-full'>

      <button onClick={() => setActiveTab("chats")}
        className={`tab flex-1 px-2 ${activeTab === 'chats' ? "bg-cyan-500/20 !text-cyan-400" : "text-slate-400"}`}
        >
        Chats
      </button>
      <button onClick={() => setActiveTab("contacts")}
        className={`tab flex-1 mx-2 ${activeTab === 'contacts' ? "bg-cyan-500/20 !text-cyan-400" : "text-slate-400"}`}
        >
        Contacs
      </button>

    </div>
  )
}

export default ActiveTabSwitch