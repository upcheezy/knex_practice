const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');

describe(`Articles service object`, function () {
    let db;

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
    })

    let testArticles = [{
            id: 1,
            name: 'first name',
            price: '1.990',
            category: 'Main',
            date_added: new Date('1919-12-22T16:28:32.615Z'),
            checked: false
        },
        {
            id: 2,
            name: 'second name',
            price: '1.990',
            category: 'Snack',
            date_added: new Date('1919-12-22T16:28:32.615Z'),
            checked: false
        },
        {
            id: 3,
            name: 'third name',
            price: '1.990',
            category: 'Breakfast',
            date_added: new Date('1919-12-22T16:28:32.615Z'),
            checked: false
        }
    ]

    before(() => db('shopping_list').truncate());

    afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy());

    context(`Given 'shopping_list' has data`, () => {
        this.beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testArticles)
        })

        it(`resolves all articles from 'shopping_list'`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testArticles)
                })
        })

        it(`getById() resolves an article by id from 'shopping_list' table`, () => {
            const thirdId = 3
            const thirdTestItem = testArticles[thirdId - 1]
            return ShoppingListService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: thirdId,
                        name: thirdTestItem.name,
                        price: thirdTestItem.price,
                        category: thirdTestItem.category,
                        date_added: thirdTestItem.date_added,
                        checked: thirdTestItem.checked,
                    })
                })
        })

        it(`updateItems() updates an item on the 'shopping_list' table`, () => {
            const idOfItemToUpdate = 3;
            const newItemData = {
                name: 'updated name',
                price: '1.890',
                category: 'Breakfast',
                date_added: new Date(),
                checked: true

            }

            return ShoppingListService.updateItems(db, idOfItemToUpdate, newItemData)
                .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                .then(item => {
                    expect(item).to.eql({
                        id: idOfItemToUpdate,
                        ...newItemData
                    })
                })
        })
    })

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllArticles() resolves an empty array`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.equal([])
                })
        })

        it(`insertItem() inserts a new item and resolves the new article with an 'id'`, () => {
            const newItem = {
                name: 'new grocery item',
                price: '2.500',
                category: 'Breakfast',
                date_added: new Date(),
                checked: false
            }
            return ShoppingListService.insertItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        name: newItem.name,
                        price: newItem.price,
                        category: newItem.category,
                        date_added: newItem.date_added,
                        checked: newItem.checked,
                    })
                })
        })
    })
})