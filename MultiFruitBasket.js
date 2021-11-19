module.exports = (pool) => {

    // get multi fruit basket Id
    let getMultiBasketsId = async (basketName) => {
        var result = await pool.query('select id from multi_fruit_basket where name=$1 ', [basketName]);
        return result.rows[0].id
    }
    // *** create a fruit basket for a given fruit type,qty and price

    let setFruitBasketItem = async (type, price, qty, basketName) => {
        var setId = await getMultiBasketsId(basketName);
        var result = await pool.query('insert into fruit_basket_item (fruit_name,price,quantity,multi_id) values ($1,$2,$3,$4)', [type, price, qty, setId])
        return result.rows
    }
    // *** Add to existing basket
    let setMultiFruitBasket = async (id, basketName) => {
        var result = await pool.query('insert into multi_fruit_basket (id,name) values ($1,$2)', [id, basketName])
        return result.rows
    }
    // *** Get all the baskets
    let getAllBaskets = async () => {
        var result = await pool.query('select fruit_name,price,quantity from fruit_basket_item ')
        return result.rows
    }

    let getMultiBaskets = async () => {
        var result = await pool.query('select name from multi_fruit_basket')
        return result.rows
    }


    /*remove fruits from an existing basket - 
    if there are no fruit left in the basket the basket should be removed*/

    let removeFromBasket = async (type, id) => {
        var removeItem = await pool.query('delete from fruit_basket_item where fruit_name=$1', [type])
        var checkExistingBaskets = await pool.query('select fruit_name,price,quantity,name from fruit_basket_item, multi_fruit_basket where fruit_basket_item.multi_id=multi_fruit_basket.id');
        if (checkExistingBaskets.rows.length < 0) {
            var removeAgain = await pool.query('delete from multi_fruit_basket where id=$1', [id]);
            return removeAgain.rows;
        }
        return removeItem.rows
    }

    // *** for a given id return the basket_name & id as well as a list of all the fruits in the basket
let getAllFromBothTables =async()=>{
    var result= await pool.query('select f.fruit_name,f.price,f.quantity,m.id,m.name from fruit_basket_item f , multi_fruit_basket m where f.multi_id=m.id')

return result.rows
}

/* return the total cost of a specific basket based: 
----> basket name
----> the basket id 
*/
let getAllBasketTotals = async()=>{
    var result = await pool.query(' select m.id,m.name ,sum(f.price*f.quantity) from multi_fruit_basket m join fruit_basket_item f on m.id=f.multi_id group by m.id');
    return result.rows
}

let getSpecificBasketTotal =async(type)=>{
    var result = await pool.query(' select m.id,m.name ,sum(f.price*f.quantity) from multi_fruit_basket m join fruit_basket_item f on m.id=f.multi_id where f.fruit_name=$1 group by m.id',[type]);
    return result.rows

}
    return {
        getMultiBasketsId,
        setFruitBasketItem,
        setMultiFruitBasket,
        getAllBaskets,
        getMultiBaskets,
        removeFromBasket,
        getAllFromBothTables,
        getAllBasketTotals,
        getSpecificBasketTotal
    }
}

