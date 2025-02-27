import React from 'react';
import {  useSelector } from 'react-redux';
import {Modal, Typography} from '@mui/material';
import { CircularProgress } from '@mui/material';
import {RootState} from "../../context/Store";

const LoadingModal = () => {
  const loading = useSelector((state: RootState) => state.modal.loadingModal);
  if (!loading) return null;
  return (
    <Modal open={loading.open}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
        padding: '20px',
      }}>
        <CircularProgress />
        <Typography style={{ marginTop: '10px', color: '#fff' }}>{loading.message}</Typography>
      </div>
    </Modal>
  );
};

export default LoadingModal;
