import React, {ReactElement, useState} from 'react';
import {View, ViewProps, ViewStyle, LayoutRectangle} from 'react-native';
import ConstraintSystemView from './ConstraintSystemView';
import {Constraint, Pin} from './types';

interface Props extends ViewProps {
  children: ConstraintSystemView | ConstraintSystemView[];
}

interface Measurement {
  x: number;
  y: number;
  width: number;
  height: number;
}

const countArray = (array: Array<any>) => {
  let c = 0;
  for (let i = 0; i < array.length; ++i) {
    if (array[i]) {
      c++;
    }
  }
  return c;
};

const ConstraintSystem: (props: Props) => ReactElement = (props) => {
  const {children = []} = props;
  const flattenedChildren = children.hasOwnProperty('length')
    ? (children as ConstraintSystemView[])
    : [children as ConstraintSystemView];

  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  const saveMeasurement = (layout: LayoutRectangle, index: number) => {
    measurements[index] = layout;
    if (countArray(measurements) === flattenedChildren.length + 1) {
      setMeasurements([...measurements]);
    }
  };

  const styles = flattenedChildren.map((child, i) => {
    const {label, constraints, style} = child.props;
    const measurement = measurements[i];

    if (!measurement) {
      return style;
    }

    let x = measurement.x;
    let y = measurement.y;
    let width = measurement.width;
    let height = measurement.height;

    const gatheredConstraints: {[key: string]: Constraint[]} = {};
    constraints.forEach((constraint) => {
      if (gatheredConstraints[constraint.target]) {
        gatheredConstraints[constraint.target].push(constraint);
      } else {
        gatheredConstraints[constraint.target] = [constraint];
      }
    });

    Object.keys(gatheredConstraints).forEach((target) => {
      gatheredConstraints[target]!.forEach((constraint) => {
        let targetMeasurement;
        if (target === 'parent') {
          targetMeasurement = measurements[flattenedChildren.length];
        } else {
          const index = flattenedChildren.findIndex(
            (child) => child.props.label === target,
          );
          targetMeasurement = measurements[index];
        }
        targetMeasurement as Measurement;

        if (constraint.pin === Pin.top) {
          const bottomConstraint = constraints.find(
            (constraint) => constraint.pin === Pin.bottom,
          );
          if (bottomConstraint) {
            y =
              targetMeasurement.y +
              (targetMeasurement.height - measurement.height) / 2;
          } else {
            y = targetMeasurement.y + constraint.value;
          }
          measurement.y = y;
        }

        if (constraint.pin === Pin.right) {
          const leftConstraint = constraints.find(
            (constraint) => constraint.pin === Pin.left,
          );
          if (leftConstraint) {
            x =
              targetMeasurement.x +
              (targetMeasurement.width - measurement.width) / 2;
          } else {
            x =
              targetMeasurement.x + targetMeasurement.width + constraint.value;
          }
          measurement.x = x;
        }

        if (constraint.pin === Pin.bottom) {
          const topConstraint = constraints.find(
            (constraint) => constraint.pin === Pin.top,
          );
          if (topConstraint) {
            y =
              targetMeasurement.y +
              (targetMeasurement.height - measurement.height) / 2;
          } else {
            y =
              targetMeasurement.y + targetMeasurement.height + constraint.value;
          }
          measurement.y = y;
        }

        if (constraint.pin === Pin.left) {
          const rightConstraint = constraints.find(
            (constraint) => constraint.pin === Pin.right,
          );
          if (rightConstraint) {
            x =
              targetMeasurement.x +
              (targetMeasurement.width - measurement.width) / 2;
          } else {
            x = targetMeasurement.x + constraint.value;
          }
          measurement.x = x;
        }
      });
    });

    return {
      position: 'absolute',
      left: x,
      top: y,
      width,
      height,
    };
  });

  return (
    <>
      {countArray(measurements) !== flattenedChildren.length + 1 && (
        <View
          {...props}
          onLayout={(e) => {
            saveMeasurement(e.nativeEvent.layout, flattenedChildren.length);
          }}>
          {countArray(measurements) !== flattenedChildren.length &&
            flattenedChildren.map((child, i) => (
              <View
                style={child.props.style}
                onLayout={(e) => {
                  saveMeasurement(e.nativeEvent.layout, i);
                }}>
                {child}
              </View>
            ))}
        </View>
      )}
      {countArray(measurements) === flattenedChildren.length + 1 && (
        <View {...props}>
          {flattenedChildren.map((child, i) => (
            <View style={[child.props.style, styles[i] as ViewStyle]}>
              {child.props.children}
            </View>
          ))}
        </View>
      )}
    </>
  );
};

export default ConstraintSystem;
