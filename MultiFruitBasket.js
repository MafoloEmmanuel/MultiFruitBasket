module.exports = (pool) => {

    //create a fruit basket for a given fruit type,qty and price

    let createBasket = async (type, price, qty) => {
        var result = await pool.query('insert into fruit_basket_item (fruit_name,price,quantity) values ($1,$2,$3)',[type,price,qty])
        return result.rows
    }

    let getAllBaskets=async()=>{
        var result = await pool.query('select fruit_name,price,quantity from fruit_basket_item ')
        return result.rows
    }
    return{
        createBasket,
        getAllBaskets
    }
}