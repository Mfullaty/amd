import React from 'react'

const StyledText = ({className}) => {
  return (
    <div>
      <p className={`text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8 ${className}`}>
        Backgrounds
      </p>
    </div>
  )
}

export default StyledText
