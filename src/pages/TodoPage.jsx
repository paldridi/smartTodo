// import React from 'react'

// const TodoPage = () => {
//   return (
//     <div>
//       This is the todo page
//     </div>
//   )
// }

// export default TodoPage

import React from 'react';

// Define and export the tasks array
export const tasks = [
  { title: 'Task 1', date: '2024-10-20' },
  { title: 'Task 2', date: '2024-10-22' },
  { title: 'Task 3', date: '2024-10-25' },
];

const TodoPage = () => {
  return (
    <div>
      <h1>This is the todo page</h1>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            {task.title} - {task.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoPage;

