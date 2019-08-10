require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
})

// 1. Get all items that contain text

function searchByName(searchTerm) {
  knexInstance
    .select('*')
    .from('shopping-list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result)
    })
}

searchByName('cat')

// 2. Get all items paginated

function paginateItems(pageNumber) {
  const itemsPerPage = 6
  const offset = itemsPerPage * (pageNumber -1)
  knexInstance
    .select('*')
    .from('shopping-list')
    .limit(itemsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result)
    })
}

paginateItems(2)

// 3. Get all items added after date

function addedSinceDaysAgo(daysAgo) {
  knexInstance
    .select('*')
    .from('shopping-list')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .then(result => {
      console.log(result)
    })
}

addedSinceDaysAgo(20)

// 4. Get the total cost for each category

function totalCost() {
  knexInstance
    .select('category')
    .sum('price AS total')
    .from('shopping-list')
    .groupBy('category')
    .then(result => {
      console.log(result)
    })
}

totalCost()
