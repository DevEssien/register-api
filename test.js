
const  getCounter =  () =>  {
    let count = 10;
    return () => count++   
}

const counter = getCounter()
console.log(counter())
console.log(counter())
console.log(counter())
console.log(counter())
console.log(counter())
console.log(counter())

const knex = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'postgres',
      password : '@postgreSQL_300',
      database : 'register'
    }
  });
  
  module.exports = knex;
  
  