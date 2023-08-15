import { Chat, Notifications, Search } from '@mui/icons-material';
import React from 'react'

export default function Topbar() {
  return (
    <div className='topbarContainer'>Topbar
      <div className='topbarLeft'>
        <span className='logo'>SNS</span>
        <div className="topbarCenter">
          <div className="searchBar">
            <Search className='searchIcon' />
            <input 
              type="text"
              className='searchInput'
              placeholder='探しものは何ですか？'
            />
          </div>
        </div>
        <div className='topbarRight'></div>
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">2</span>
          </div>
      </div>
      <img src="/assets/person/1.jpeg" alt="" className="topbarImg" />
    </div>
  );
}
