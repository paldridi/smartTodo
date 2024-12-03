// frontend/src/pages/TasksPage.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api';
import TaskCard from '../components/TaskCard';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

const TasksList = styled.div`
  width: 100%;
  max-width: 800px;
  margin-bottom: 2rem;
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text};
  text-align: center;
  opacity: 0.8;
`;

const AddTaskContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 1.5rem;
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const Input = styled.input`
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.inputText};
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: 5px;
  width: 180px;
  font-size: 1rem;
  transition: border-color 0.3s, background-color 0.3s, color 0.3s;

  &:focus {
    border-color: ${({ theme }) => theme.inputFocusBorder};
  }
`;

const ColorPicker = styled.input`
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
`;

const AddButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.buttonHoverBackground};
    color: ${({ theme }) => theme.buttonHoverText};
  }
`;

function TasksPage() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskColor, setNewTaskColor] = useState('#ADD8E6'); // Light blue as the default color

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`/tasks/${id}/tasks`);
        const sortedTasks = response.data.sort(
          (a, b) => new Date(a.deadline) - new Date(b.deadline)
        );
        setTasks(sortedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        alert("Failed to load tasks. Please check your connection or sign in again.");
      }
    };

    fetchTasks();
  }, [id]);

  const handleAddTask = async () => {
    if (newTaskTitle.trim() === '') return;
    try {
      const taskData = {
        title: newTaskTitle,
        deadline: newTaskDeadline,
        description: newTaskDescription,
        color: newTaskColor,
        status: false,
        bucket_id: id,
      };
      const response = await axios.post('/tasks/todos', taskData);
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks, response.data].sort(
          (a, b) => new Date(a.deadline) - new Date(b.deadline)
        );
        return updatedTasks;
      });
      setNewTaskTitle('');
      setNewTaskDeadline('');
      setNewTaskDescription('');
      setNewTaskColor('#ADD8E6');
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task. Please try again.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`/tasks/todos/${taskId}`);
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskId)
      );
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task. Please try again.");
    }
  };

  const handleEditTask = async (taskId, updatedTask) => {
    try {
      const payload = {
        title: updatedTask.title || '',
        description: updatedTask.description || '',
        deadline: updatedTask.deadline || '',
        color: updatedTask.color || '#ADD8E6',
        status: Boolean(updatedTask.status),
        bucket_id: updatedTask.bucket_id,
      };
      const response = await axios.patch(`/tasks/todos/${taskId}`, payload);
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.map((task) =>
          task._id === taskId ? response.data : task
        ).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        return updatedTasks;
      });
    } catch (error) {
      console.error("Error editing task:", error);
      alert("Failed to edit task. Please try again.");
    }
  };

  const toggleTaskStatus = async (taskId, status) => {
    try {
      const response = await axios.patch(`/tasks/todos/${taskId}`, { status: !status });
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.map((task) =>
          task._id === taskId ? response.data : task
        ).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        return updatedTasks;
      });
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update task status. Please try again.");
    }
  };

  return (
    <PageContainer>
      <Title>Your Tasks</Title>
      <TasksList>
        <AnimatePresence>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TaskCard
                  task={task}
                  onDelete={() => handleDeleteTask(task._id)}
                  onEdit={(updatedTask) => handleEditTask(task._id, updatedTask)}
                  onToggleStatus={() => toggleTaskStatus(task._id, task.status)}
                />
              </motion.div>
            ))
          ) : (
            <Message>No tasks available. Please add a new task.</Message>
          )}
        </AnimatePresence>
      </TasksList>
      <AddTaskContainer>
        <Input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter task title"
        />
        <Input
          type="date"
          value={newTaskDeadline}
          onChange={(e) => setNewTaskDeadline(e.target.value)}
        />
        <Input
          type="text"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          placeholder="Enter task description"
        />
        <ColorPicker
          type="color"
          value={newTaskColor}
          onChange={(e) => setNewTaskColor(e.target.value)}
        />
        <AddButton onClick={handleAddTask}>Add</AddButton>
      </AddTaskContainer>
    </PageContainer>
  );
}

export default TasksPage;
