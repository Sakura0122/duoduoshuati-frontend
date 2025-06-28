import { Tag } from 'antd'

interface Props {
  tagList?: string[]
  className?: string
}

/**
 * 标签列表组件
 * @param props
 * @constructor
 */
const TagList = (props: Props) => {
  const { tagList = [] } = props

  return (
    <div className={'tag-list ' + props.className}>
      {tagList.map((tag) => {
        return <Tag key={tag}>{tag}</Tag>
      })}
    </div>
  )
}

export default TagList
