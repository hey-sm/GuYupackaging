
//
import { log } from 'console'
import {useMemo}from 'react'
export const BeforeStatus = ( {status}:any)=>{
  const avtivestatus=useMemo(()=>{
        if (status==='success') {
            return '#00B42A'
        }else if(status==='failure'){
          return '#F53F3F'
        }
        else if(status==='processing'){
          return '#0081FF'
        }

  },[status])




  return <span
      style={{
        width:6,
        height:6,
        background:avtivestatus,
        marginRight:8,
        borderRadius:'50%'
      }}
  ></span>
}

