'use server'
import Title from 'antd/es/typography/Title'
import QuestionBankList from '@/components/QuestionBankList'
import questionBankApi from '@/api/questionBank'

/**
 * 题库列表页面
 * @constructor
 */
const Banks = async () => {
  let questionBankList
  const questionBankRes = await questionBankApi.getPublicList({
    pageSize: 200,
    sortField: 'createTime',
  })
  questionBankList = questionBankRes.data.list ?? []

  return (
    <div id="banksPage" className="max-width-content">
      <Title level={3}>题库大全</Title>
      <QuestionBankList questionBankList={questionBankList} />
    </div>
  )
}

export default Banks
