import React, {ReactNode} from 'react';
import {Constraint} from './types';
import {View, ViewProps} from 'react-native';

interface Props extends ViewProps {
  label: string;
  constraints: Constraint[];
  children: React.ReactNode;
}

interface DefaultProps {
  constraints: Constraint[];
}

class ConstraintSystemView extends React.Component<Props> {
  static defaultProps: DefaultProps = {
    constraints: [],
  };

  render() {
    return <View {...this.props} onLayout={() => {}} />;
  }
}

export default ConstraintSystemView;
