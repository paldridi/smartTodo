import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { FiEdit, FiTrash, FiMove } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Modal, Button } from 'react-bootstrap';

const Card = styled(motion.div)`
  background-color: ${({ color }) => color || '#e1f5fe'};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.15);
  }

  ${({ isExpanded }) =>
    isExpanded &&
    css`
      padding: 1.8rem;
      max-height: 500px;
    `}
`;

const BucketLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: 600;
  font-size: 1.2rem;
`;

const IconContainer = styled.div`
  display: flex;
  gap: 0.3rem;
  position: absolute;
  top: 8px;
  right: 8px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #333;
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
  margin-bottom: 0.5rem;
  width: 100%;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s ease;

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

function BucketCard({ bucket, onDelete, onEdit, onMove, isSelected }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(bucket.name);
  const [color, setColor] = useState(bucket.color || '#e1f5fe');
  const [showConfirm, setShowConfirm] = useState(false); // Confirmation dialog state

  // Toggle expand state of the card
  const toggleExpand = () => {
    if (!isEditing) setIsExpanded(!isExpanded);
  };

  // Edit button functionality
  const handleEditClick = (e) => {
    e.stopPropagation();
    if (isEditing) {
      onEdit(bucket._id, newName, color);
    }
    setIsEditing(!isEditing);
    setIsExpanded(true);
  };

  // Open and close confirmation modal
  const handleShowConfirm = () => setShowConfirm(true);
  const handleCloseConfirm = () => setShowConfirm(false);

  // Confirm deletion action
  const confirmDelete = () => {
    onDelete(bucket._id);
    handleCloseConfirm();
  };

  return (
    <Card
      color={color}
      onClick={toggleExpand}
      isExpanded={isExpanded}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {isEditing ? (
        <>
          <EditField
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Bucket Name"
          />
          <ColorPicker
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </>
      ) : (
        <BucketLink to={`/bucket/${bucket._id}`}>
          <h3>{bucket.name}</h3>
        </BucketLink>
      )}
      {isExpanded && (
        <IconContainer>
          <IconButton onClick={(e) => { e.stopPropagation(); onMove(); }} title="Move Bucket">
            <FiMove />
          </IconButton>
          <IconButton onClick={handleEditClick} title="Edit Bucket">
            <FiEdit />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleShowConfirm(); // Show confirmation before delete
            }}
            title="Delete Bucket"
          >
            <FiTrash />
          </IconButton>
        </IconContainer>
      )}

      {/* Confirmation Modal */}
      <Modal
        show={showConfirm}
        onHide={handleCloseConfirm}
        centered
        animation={true}
        backdrop="static"
      >
        <ModalHeaderStyled closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </ModalHeaderStyled>
        <ModalBodyStyled>
          Are you sure you want to delete this bucket? This action cannot be undone.
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

export default BucketCard;
