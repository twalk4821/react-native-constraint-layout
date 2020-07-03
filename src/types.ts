import ConstraintSystemView from './ConstraintSystemView';
import {RefObject} from 'react';
import {View} from 'react-native';

export enum Pin {
  top = 'top',
  bottom = 'bottom',
  left = 'left',
  right = 'right',
}
export interface Constraint {
  target: string;
  pin: Pin;
  value: number;
}
export interface Measurement {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
}
export interface Measurements {
  [key: string]: Measurement;
}

export interface ConstraintNode {
  label: string;
  constraints: Constraint[];
}
