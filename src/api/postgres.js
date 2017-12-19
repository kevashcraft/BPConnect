import { Pool } from 'pg'

const pool = new Pool({
  user: 'bpconnect',
  password: 'bpconnect',
  database: 'bpconnect',
})

export default pool
