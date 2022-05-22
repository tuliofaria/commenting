import styles from './styles.module.css'
interface Props {
  children: React.ReactNode
}
const Alert = ({ children }: Props) => {
  return <div className={styles.alert}>{children}</div>
}
export default Alert
