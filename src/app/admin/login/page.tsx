import { login } from './actions'
import styles from './page.module.css'

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h2>Admin Login</h2>
          <p>Sign in to access the Ibqa dashboard</p>
        </div>
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email address</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              placeholder="admin@ibqa.store"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              placeholder="••••••••"
            />
          </div>
          <button formAction={login} className={styles.submitBtn}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
