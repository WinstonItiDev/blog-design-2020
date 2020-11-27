
// exports.seed = function(knex) {
//   // Deletes ALL existing entries
//   return knex('todos').del()
//     .then(function () {
//       // Inserts seed entries
//       return knex('todos').insert([
//         {id: 1, colName: 'rowValue1'},
//         {id: 2, colName: 'rowValue2'},
//         {id: 3, colName: 'rowValue3'}
//       ]);
//     });
// };


exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('todos').del()
    .then(function () {
      // Inserts seed entries
      return knex('todos').insert([
        {
          id: 1, 
          title: 'todo1',
          user_id: '234235235'
        },
        {
          id: 2, 
          title: 'todo2',
          user_id: '234235235'
          
          
        },
        {
          id: 3, 
          title: 'todo3',
          user_id: '234235235'
          
        }
      ]);
    });
};