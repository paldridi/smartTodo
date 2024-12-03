import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { FiTrash, FiCheckSquare, FiSquare, FiRefreshCw, FiX, FiEdit } from 'react-icons/fi';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Modal, Button } from 'react-bootstrap';

const getContrastingColor = (bgColor) => {
  const color = bgColor.slice(1);
  const rgb = parseInt(color, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#333' : '#fff';
};

// Styled components
const Card = styled(motion.div)`
  background-color: ${({ color }) => color || '#eaf4ff'};
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.15);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const TaskTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${({ color }) => color};
  margin: 0;
  transition: color 0.3s;
`;

const StatusSymbol = styled.span`
  font-size: 1.5rem;
  color: ${({ isCompleted }) => (isCompleted ? '#4CAF50' : '#FF5722')};
  margin-top: 15px;
  display: ${({ isExpanded }) => (isExpanded ? 'none' : 'inline')};
`;

const TaskDescription = styled.p`
  font-size: 1rem;
  color: ${({ color }) => color};
  margin: 1rem 0;
`;

const TaskDeadline = styled.p`
  font-size: 0.9rem;
  color: ${({ isOverdue, color }) => (isOverdue ? '#D9534F' : color)};
  font-weight: 500;
`;

const TaskStatus = styled.p`
  font-size: 0.9rem;
  color: ${({ isCompleted }) => (isCompleted ? '#4CAF50' : '#FF5722')};
  font-weight: bold;
`;

const IconContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  position: absolute;
  top: 8px;
  right: 8px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.3s, transform 0.2s;

  &:hover {
    color: #1976d2;
    transform: scale(1.1);
  }
`;

const EditField = styled.input`
  padding: 0.5rem;
  margin-bottom: 0.8rem;
  width: 100%;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #1976d2;
  }
`;

const ColorPicker = styled.input`
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 0.5rem;
`;

const Label = styled.span`
  font-weight: bold;
  color: ${({ color }) => color};
  font-size: 1.1rem;
  display: block;
  margin-bottom: 0.5rem;
`;

const RecommendationSection = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f1f8ff;
  border-radius: 8px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  max-height: ${({ isExpanded }) => (isExpanded ? '100%' : '0')};
  transition: max-height 0.6s ease;
`;

const RecommendationText = styled.p`
  font-size: 1rem;
  color: #0d47a1; // Darker blue color for AI recommendation text
  white-space: pre-wrap;
  overflow: hidden;
  display: inline-block;
  max-width: 100%;
`;

const ActionButtonsContainer = styled.div`
  position: absolute;
  top: 5px;
  right: 8px;
  display: flex;
  gap: 5px;
`;

const ModalHeaderStyled = styled(Modal.Header)`
  background: linear-gradient(45deg, #1976d2, #4caf50);
  color: #fff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const ModalBodyStyled = styled(Modal.Body)`
  font-size: 1.1rem;
  text-align: center;
  color: #333;
  padding: 2rem;
`;

const StyledButton = styled(Button)`
  border-radius: 50px;
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
`;

function TaskCard({ task, onDelete, onToggleStatus, onEdit }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title || '');
  const [newDescription, setNewDescription] = useState(task.description || '');
  const [newDeadline, setNewDeadline] = useState(task.deadline || '');
  const [newColor, setNewColor] = useState(task.color || '#eaf4ff');
  const [recommendation, setRecommendation] = useState('');
  const [typedRecommendation, setTypedRecommendation] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const typingIntervalRef = useRef(null);
  const today = new Date().toISOString().split('T')[0];
  const isOverdue = !task.status && task.deadline <= today;

  const contrastingColor = getContrastingColor(newColor);

  const fetchRecommendation = useCallback(async () => {
    setIsTyping(true);
    clearInterval(typingIntervalRef.current);
    try {
      const response = await axios.post('http://localhost:5000/api/ai/recommendation', {
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        status: task.status,
      });
      setRecommendation(response.data.recommendation);
      setTypedRecommendation('');
      displayTypingEffect(response.data.recommendation);
    } catch {
      setRecommendation("Unable to generate recommendation at this time.");
    }
  }, [task]);

  const displayTypingEffect = (text) => {
    let index = 0;
    setTypedRecommendation('');
    typingIntervalRef.current = setInterval(() => {
      if (index < text.length) {
        setTypedRecommendation((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(typingIntervalRef.current);
      }
    }, 15); // Faster typing speed
  };

  const stopTyping = () => {
    clearInterval(typingIntervalRef.current);
    setTypedRecommendation(recommendation);
    setIsTyping(false);
  };

  const toggleExpand = () => {
    if (!isExpanded && !recommendation) fetchRecommendation(); // Only fetch recommendation on first expansion
    setIsExpanded(!isExpanded);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (isEditing) {
      const updatedTask = {
        ...task,
        title: newTitle,
        description: newDescription,
        deadline: newDeadline,
        color: newColor,
      };
      onEdit(updatedTask);
    }
    setIsEditing(!isEditing);
  };

  // Open and close confirmation modal
  const handleShowConfirm = () => setShowConfirm(true);
  const handleCloseConfirm = () => setShowConfirm(false);

  // Confirm deletion action
  const confirmDelete = () => {
    onDelete(task._id);
    handleCloseConfirm();
  };

  return (
    <Card
      color={newColor}
      isExpanded={isExpanded}
      initial={{ scale: 0.95 }}
      animate={{ scale: isExpanded ? 1.03 : 1 }}
      transition={{ duration: 0.3 }}
    >
      <Header onClick={toggleExpand}>
        <TaskTitle color={contrastingColor}>{task.title}</TaskTitle>
        <StatusSymbol isCompleted={task.status} isExpanded={isExpanded}>
          {task.status ? '✅' : '⌛'}
        </StatusSymbol>
      </Header>
      <TaskDeadline isOverdue={isOverdue} color={contrastingColor}>
        Deadline: {task.deadline}
      </TaskDeadline>
      {isExpanded && (
        <>
          {isEditing ? (
            <>
              <EditField
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Task Title"
              />
              <EditField
                type="date"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
              />
              <EditField
                as="textarea"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Task Description"
                rows="3"
              />
              <ColorPicker
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
              />
            </>
          ) : (
            <>
              <TaskStatus isCompleted={task.status}>
                Status: {task.status ? 'Completed' : 'Pending'}
              </TaskStatus>
              <Label color={contrastingColor}>Description:</Label>
              <TaskDescription color={contrastingColor}>{task.description}</TaskDescription>
            </>
          )}
          <Label color={contrastingColor}>AI Recommendation:</Label>
          <RecommendationSection isExpanded={isExpanded}>
            <RecommendationText>{typedRecommendation}</RecommendationText>
            <ActionButtonsContainer>
              <IconButton onClick={fetchRecommendation}><FiRefreshCw /></IconButton>
              {isTyping && <IconButton onClick={stopTyping}><FiX /></IconButton>}
            </ActionButtonsContainer>
          </RecommendationSection>
        </>
      )}
      {isExpanded && (
        <IconContainer>
          <IconButton onClick={handleEditClick}><FiEdit /></IconButton>
          <IconButton onClick={(e) => { e.stopPropagation(); onToggleStatus(task._id, task.status); }}>
            {task.status ? <FiCheckSquare /> : <FiSquare />}
          </IconButton>
          <IconButton onClick={(e) => { e.stopPropagation(); handleShowConfirm(); }}><FiTrash /></IconButton>
        </IconContainer>
      )}

      {/* Confirmation Modal */}
      <Modal show={showConfirm} onHide={handleCloseConfirm} centered animation={true} backdrop="static">
        <ModalHeaderStyled closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </ModalHeaderStyled>
        <ModalBodyStyled>
          Are you sure you want to delete this task? This action cannot be undone.
        </ModalBodyStyled>
        <Modal.Footer className="d-flex justify-content-center">
          <StyledButton variant="secondary" onClick={handleCloseConfirm}>
            Cancel
          </StyledButton>
          <StyledButton variant="danger" onClick={confirmDelete}>
            Delete
          </StyledButton>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}

export default TaskCard;
