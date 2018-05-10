import { native } from 'pg'

const pool = new native.Pool({
	host: 'postgres',
  user: 'bpconnect',
  password: 'bpconnect',
  database: 'bpconnect',
})

export default pool
