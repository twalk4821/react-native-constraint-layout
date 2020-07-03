# React Native Constraint Layout

## Example Usage

```js
import {
  ConstraintSystem,
  ConstraintSystemView,
  Pin,
} from "react-native-constraint-layout";

const App = () => (
  <ConstraintSystem
    style={{
      width: 300,
      height: 300,
    }}
  >
    <ConstraintSystemView
      label="hello"
      // centered in parent
      constraints={[
        { pin: Pin.top, target: "parent" },
        { pin: Pin.bottom, target: "parent" },
        { pin: Pin.left, target: "parent" },
        { pin: Pin.right, target: "parent" },
      ]}
      style={{
        width: 100,
      }}
    >
      <Text
        style={{
          textAlign: "center",
        }}
      >
        Hello
      </Text>
    </ConstraintSystemView>
    <ConstraintSystemView
      label="world"
      // pin to bottom of "hello"
      // centered horizontally in parent
      constraints={[
        { pin: Pin.bottom, target: "hello", value: 0 },
        { pin: Pin.left, target: "parent" },
        { pin: Pin.right, target: "parent" },
      ]}
      style={{
        width: 100,
      }}
    >
      <Text
        style={{
          textAlign: "center",
        }}
      >
        Constraint-World!
      </Text>
    </ConstraintSystemView>
  </ConstraintSystem>
);
```
