const { Pool } = require('pg');
const assert = require('assert')
const MultiFruitBasket = require('./MultiFruitBasket')

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
describe('Multi fruit basket', ()=>{
    beforeEach(async()=>{
await pool.query('delete from fruit_basket_item')
    })
    const multiFruity = MultiFruitBasket(pool);
it('set baskets', async()=>{
await multiFruity.createBasket('Apple',3.00,5);
await multiFruity.createBasket('Banana',1.00,5);
await multiFruity.createBasket('Mango',2.00,5);
await multiFruity.createBasket('Orange',2.00,5);

assert.deepEqual(
    [
      {
        fruit_name: 'Apple',
        price: '3.00',
        quantity: 5
      },
      {
        fruit_name: 'Banana',
        price: '1.00',
        quantity: 5
      },
      {
        fruit_name: 'Mango',
        price: '2.00',
        quantity: 5
      },
      {
        fruit_name: 'Orange',
        price: '2.00',
        quantity: 5
      }
    ],await multiFruity.getAllBaskets())

})
after(()=>{
    pool.end();
})
})

