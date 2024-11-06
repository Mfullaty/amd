import React from 'react'
import BackButton from './BackButton'

export default function FormHeader({title}) {
  return (
    <div className=" w-full flex flex-row items-center gap-2  p-4 rounded-md">
        <BackButton/>
        <p className="text-sm font-bold text-foreground drop-shadow-lg dark:drop-shadow-md dark:drop-shadow-slate-400">{title}</p>
    </div>
  )
}
