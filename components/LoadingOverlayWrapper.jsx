"use client";
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import LoadingOverlay from './LoadingOverlay';

const LoadingOverlayWrapper = () => {
  const { isLoading } = useAppContext();
  
  return <LoadingOverlay isLoading={isLoading} />;
};

export default LoadingOverlayWrapper; 