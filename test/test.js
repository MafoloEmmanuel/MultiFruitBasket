const { Pool } = require('pg');
const assert = require('assert');
const MultiFruitBasket = require('../MultiFruitBasket')

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = { rejectUnauthorized: false };
}
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:201735469@localhost:5432/coderdb'
const pool = new Pool({
  connectionString: connectionString,
  ssl: useSSL
});
pool.on('connect', () => {
  console.log('connection has started');
});
describe('Multi fruit basket', () => {
  let multiFruity = MultiFruitBasket(pool)
  beforeEach(async() => {
    await pool.query('delete from fruit_basket_item');
    await pool.query('delete from multi_fruit_basket');

    //insert values into the tables
    await pool.query("insert into multi_fruit_basket (id,name) values (25,'Red Apples') ");
   await pool.query("insert into fruit_basket_item (fruit_name,price,quantity,multi_id)  values('Apples', 2.50, 15, 25)");
   
   await pool.query("insert into multi_fruit_basket (id,name) values (41,'Yellow Bananas') ");
   await pool.query("insert into fruit_basket_item (fruit_name,price,quantity,multi_id)  values('Bananas', 1.00, 20, 41)");
  
   await pool.query("insert into multi_fruit_basket (id,name) values (62,'Orange Oranges') ");
   await pool.query("insert into fruit_basket_item (fruit_name,price,quantity,multi_id)  values('Oranges', 2.00, 30, 62)");
  
   await pool.query("insert into multi_fruit_basket (id,name) values (45,'Green Pears') ");
   await pool.query("insert into fruit_basket_item (fruit_name,price,quantity,multi_id)  values('Pears', 4.00, 38, 45)");

  });
  it('Should get all the fruit baskets', async()=>{
      
    assert.deepEqual(   [
        {
          fruit_name: 'Apples',
          price: '2.50',
          quantity: 15
        },
        {
          fruit_name: 'Bananas',
          price: '1.00',
          quantity: 20
        },
        {
          fruit_name: 'Oranges',
          price: '2.00',
          quantity: 30
        },
        {
          fruit_name: 'Pears',
          price: '4.00',
          quantity: 38
        }
      ], await multiFruity.getAllBaskets())
  });
  it('Show all the basket names in the multi fruit basket', async()=>{
    assert.deepEqual([
      {
        name: 'Red Apples'
      },
      {
        name: 'Yellow Bananas'
      },
      {
        name: 'Orange Oranges'
      },
      {
        name: 'Green Pears'
      },
      
    ], await multiFruity.getMultiBaskets());
  
  });
  it('Remove fruit basket item from the basket and later remove the whole basket details', async()=>{
    await multiFruity.removeFromBasket('Pears',45);

    assert.deepEqual([
      {
        fruit_name: 'Apples',
        price: '2.50',
        quantity: 15
      },
      {
        fruit_name: 'Bananas',
        price: '1.00',
        quantity: 20
      },
      {
        fruit_name: 'Oranges',
        price: '2.00',
        quantity: 30
      }
    ]
    , await multiFruity.getAllBaskets());
  });

  it('for a given id return the basket_name & id as well as a list of all the fruits in the basket', async()=>{
    assert.deepEqual(
      [
        {
          fruit_name: 'Apples',
          id: 25,
          name: 'Red Apples',
          price: '2.50',
          quantity: 15
        },
        {
          fruit_name: 'Bananas',
          id: 41,
          name: 'Yellow Bananas',
          price: '1.00',
          quantity: 20
        },
        {
          fruit_name: 'Oranges',
          id: 62,
          name: 'Orange Oranges',
          price: '2.00',
          quantity: 30
        },
        {
          fruit_name: 'Pears',
          id: 45,
          name: 'Green Pears',
          price: '4.00',
          quantity: 38
        }
      ], await multiFruity.getAllFromBothTables())
  });
  it('Show the total cost for a specific basket',async()=>{
    
    assert.deepEqual([
      {
        id: 25,
        name: 'Red Apples',
        sum: '37.50'
      }
    ], await multiFruity.getSpecificBasketTotal('Apples') )
  });
  it('Show the total cost for all the fruit baskets',async()=>{
    
    assert.deepEqual(
      [
        {
          id: 41,
          name: 'Yellow Bananas',
          sum: '20.00'
        },
        {
          id: 62,
          name: 'Orange Oranges',
          sum: '60.00'
        },
        {
          id: 25,
          name: 'Red Apples',
          sum: '37.50'
        },
        {
          id: 45,
          name: 'Green Pears',
          sum: '152.00'
        }
      ], await multiFruity.getAllBasketTotals('Apples') )
  });

    after(() => {
      pool.end();
    })
  });




