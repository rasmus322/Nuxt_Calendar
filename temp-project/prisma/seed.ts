import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.resolve(__dirname, '..', 'dev.db')
const db = new Database(dbPath)

// Создаем категории если их нет
const categories = [
  { id: 'cat-1', name: 'Работа', color: '#3B82F6' },
  { id: 'cat-2', name: 'Личное', color: '#10B981' },
  { id: 'cat-3', name: 'Важное', color: '#EF4444' },
  { id: 'cat-4', name: 'Здоровье', color: '#F59E0B' },
  { id: 'cat-5', name: 'Образование', color: '#8B5CF6' }
]

const insert = db.prepare(`
  INSERT OR IGNORE INTO Category (id, name, color) VALUES (@id, @name, @color)
`)

const insertMany = db.transaction((cats) => {
  for (const cat of cats) {
    insert.run(cat)
  }
})

insertMany(categories)

console.log('Created categories:', categories.map(c => c.name))
db.close()
