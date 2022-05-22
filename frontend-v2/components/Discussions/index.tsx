import styles from './styles.module.css'

interface Props {
  children: React.ReactNode
}

const Discussions = ({ children }: Props) => {
  return <div className={styles.discussions}>{children}</div>
}
export default Discussions
