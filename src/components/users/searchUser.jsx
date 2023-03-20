import React from 'react'

const SearchUser = ({filter,setFilter}) => {
  return (
    <span>
        Search:{''}
        <input type="text"  value={filter || ''} onChange={(e)=>setFilter(e.target.value)}/>
    </span>
  )
}

export default SearchUser   