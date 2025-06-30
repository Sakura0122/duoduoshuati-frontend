'use client'
import { getToken } from '@/utils/request-axios'

const test = () => {
  const res = getToken()
  console.log(res)
  return (
    <>
      <div>test</div>
    </>
  )
}

export default test
