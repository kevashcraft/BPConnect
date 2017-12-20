import { native } from 'pg'

const pool = new native.Pool({
  user: 'bpconnect',
  password: 'bpconnect',
  database: 'bpconnect',
})

export default pool
