import { useContext } from 'react';
import { AliyunOSSContext, AliyunOSSContextValue } from './AliyunOSSContext';

export const useAliyunOSSContext = () =>
  useContext(AliyunOSSContext) as AliyunOSSContextValue;
