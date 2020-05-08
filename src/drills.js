const knex = require('knex');
require('dotenv').config();

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

function searchByProduceName(searchTerm) {
    knexInstance
        .select('id', 'name', 'price', 'date_added')
        .from('shopping_list')
        .where(
            'name', 'ILIKE', `%${searchTerm}%`
        )
        .then(result => {
            console.log(result)
        })
}

// searchByProduceName('fish')

function paginateProducts(page) {
    const productsPerPage = 10
    const offset = productsPerPage * (page - 1)
    knexInstance
        .select('id', 'name', 'price', 'date_added')
        .from('shopping_list')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })
}

// paginateProducts(2)

function afterDate(daysAgo) {
    knexInstance
        .select('id', 'name', 'price', 'date_added')
        .from('shopping_list')
        .where(
            'date_added', '>',
            knexInstance.raw(`now() - '?? days':: INTERVAL`, daysAgo)
        )
        .then(result => {
            console.log(result);
        })
}

afterDate(3)