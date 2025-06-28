import './index.scss'

export default () => {
  const currentYear = new Date().getFullYear()

  return (
    <div className="globalFooter">
      <div>© {currentYear} 多多刷题平台</div>
      <div>
        <a target="_blank">作者：sakura</a>
      </div>
    </div>
  )
}
