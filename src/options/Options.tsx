import React, { useState } from 'react'

const Options: React.FC = () => {
  const [count] = useState(0)

  return (
    <div className="options-root">
      this is options page
      {count}
    </div>
  )
}

export default Options
