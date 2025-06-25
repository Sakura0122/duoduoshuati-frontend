import style from './index.module.scss'

export default () => {
  const currentYear = new Date().getFullYear()

  return (
    <div className={style.globalFooter}>
      <div>© {currentYear} 多多刷题平台</div>
      <div>
        <a target="_blank">作者：sakura</a>
      </div>
    </div>
  )
}
