
// exports.seed = function(knex) {
//   // Deletes ALL existing entries
//   return knex('users').del()
//     .then(function () {
//       // Inserts seed entries
//       return knex('users').insert([
//         {name: 1, email: 'rowValue1'},
//         {id: 2, colName: 'rowValue2'},
//         {id: 3, colName: 'rowValue3'}
//       ]);
//     });
// };



exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: 1, 
          name: 'Oscar',
          email: 'email@email.com'
        },
        {
          id: 2, 
          name: 'Jenny',
          email: 'email@email.com'
          
        },
        {
          id: 3, 
          name: 'Charlie',
          email: 'email@email.com'
        }
      ]);
    });
};
