// frontend/src/pages/BucketsPage.js

import React, { useEffect, useState } from 'react';
import axios from '../api';
import BucketCard from '../components/BucketCard';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

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

const BucketsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 1200px;
`;

const NoBucketsMessage = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.7;
  margin-top: 2rem;
  text-align: center;
`;

const AddBucketContainer = styled.div`
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

function BucketsPage() {
  const [buckets, setBuckets] = useState([]);
  const [newBucketName, setNewBucketName] = useState('');
  const [newBucketColor, setNewBucketColor] = useState('#A5D6A7'); // Light green as the default color
  const [selectedBucket, setSelectedBucket] = useState(null);

  useEffect(() => {
    fetchBuckets();
  }, []);

  const fetchBuckets = async () => {
    try {
      const response = await axios.get('/tasks/buckets');
      const sortedBuckets = response.data.sort((a, b) => a.order - b.order);
      setBuckets(sortedBuckets);
    } catch (error) {
      console.error("Error fetching buckets:", error);
      alert("Failed to load buckets. Please check your connection or sign in again.");
    }
  };

  const handleAddBucket = async () => {
    if (newBucketName.trim() === '') return;
    try {
      await axios.post('/tasks/buckets', { name: newBucketName, color: newBucketColor });
      fetchBuckets();
      setNewBucketName('');
      setNewBucketColor('#A5D6A7'); // Reset to default light green after adding a bucket
    } catch (error) {
      console.error("Error adding bucket:", error);
      alert("Failed to add bucket. Please try again.");
    }
  };

  const handleDeleteBucket = async (bucketId) => {
    try {
      await axios.delete(`/tasks/buckets/${bucketId}`);
      fetchBuckets();
    } catch (error) {
      console.error("Error deleting bucket:", error);
      alert("Failed to delete bucket. Please try again.");
    }
  };

  const handleEditBucket = async (bucketId, newName, color) => {
    try {
      await axios.patch(`/tasks/buckets/${bucketId}`, { name: newName, color });
      fetchBuckets();
    } catch (error) {
      console.error("Error editing bucket:", error);
      alert("Failed to edit bucket. Please try again.");
    }
  };

  const handleSelectBucketToMove = async (index) => {
    if (selectedBucket === null) {
      setSelectedBucket(index);
    } else {
      const reorderedBuckets = [...buckets];
      [reorderedBuckets[selectedBucket], reorderedBuckets[index]] = [
        reorderedBuckets[index],
        reorderedBuckets[selectedBucket],
      ];
      setBuckets(reorderedBuckets);
      setSelectedBucket(null);

      try {
        await axios.patch('/tasks/buckets/reorder', {
          bucketOrder: reorderedBuckets.map((bucket) => bucket._id),
        });
      } catch (error) {
        console.error("Error saving reordered buckets:", error);
        alert("Failed to save reordered buckets. Please try again.");
      }
    }
  };

  return (
    <PageContainer>
      <Title>Your Buckets</Title>
      {buckets.length === 0 && (
        <NoBucketsMessage>No buckets available. Please add a new bucket.</NoBucketsMessage>
      )}
      <BucketsGrid>
        <AnimatePresence>
          {buckets.map((bucket, index) => (
            <motion.div
              key={bucket._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <BucketCard 
                bucket={bucket} 
                onDelete={handleDeleteBucket} 
                onEdit={handleEditBucket} 
                onMove={() => handleSelectBucketToMove(index)} 
                isSelected={selectedBucket === index}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </BucketsGrid>
      <AddBucketContainer>
        <Input
          type="text"
          value={newBucketName}
          onChange={(e) => setNewBucketName(e.target.value)}
          placeholder="Enter new bucket name"
        />
        <ColorPicker
          type="color"
          value={newBucketColor}
          onChange={(e) => setNewBucketColor(e.target.value)}
        />
        <AddButton onClick={handleAddBucket}>Add</AddButton>
      </AddBucketContainer>
    </PageContainer>
  );
}

export default BucketsPage;
