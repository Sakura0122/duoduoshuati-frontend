'use client'
import { useEffect } from 'react'
import questionApi from '@/api/question'

export default () => {
  const getQuestionData = async () => {
    const res = await questionApi.getPublicList({})
    console.log(res)
  }
  useEffect(() => {
    getQuestionData()
  }, [])
  return (
    <div>
      <h1>Questions</h1>
    </div>
  )
}
