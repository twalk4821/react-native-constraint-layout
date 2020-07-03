import {Constraint, ConstraintNode, Pin} from './types';

class IncomingConstraintGraphEdge {
  _from: ConstraintGraphNode;
  _constraint: Constraint;

  constructor(from: ConstraintGraphNode, constraint: Constraint) {
    this._from = from;
    this._constraint = constraint;
  }
}

class OutgoingConstraintGraphEdge {
  _to: ConstraintGraphNode;
  _constraint: Constraint;

  constructor(to: ConstraintGraphNode, constraint: Constraint) {
    this._to = to;
    this._constraint = constraint;
  }
}

class ConstraintGraphNode {
  _node: ConstraintNode;
  _incomingEdges: IncomingConstraintGraphEdge[];
  _outgoingEdges: OutgoingConstraintGraphEdge[];

  constructor(
    label: ConstraintNode,
    incomingEdges: IncomingConstraintGraphEdge[] = [],
    outgoingEdges: OutgoingConstraintGraphEdge[] = [],
  ) {
    this._node = label;
    this._incomingEdges = incomingEdges;
    this._outgoingEdges = outgoingEdges;
  }
}

class ConstraintGraph {
  _nodes: ConstraintGraphNode[];
  _parent?: ConstraintGraphNode;

  constructor(nodes: ConstraintGraphNode[] = []) {
    this._nodes = nodes;
    this._parent = undefined;
  }
}

const buildConstraintGraph: (nodes: ConstraintNode[]) => ConstraintGraph = (
  nodes,
) => {
  const result = new ConstraintGraph();

  nodes.forEach((node: ConstraintNode) => {
    const {label, constraints} = node;

    let sourceNode = result._nodes.find(
      (existingNode) => existingNode._node.label === label,
    );

    if (!sourceNode) {
      sourceNode = new ConstraintGraphNode(node);
      result._nodes.push(sourceNode);
    }

    constraints.forEach((constraint: Constraint) => {
      const {target} = constraint;

      let targetNode = result._nodes.find(
        (existingNode) => existingNode._node.label === target,
      );

      if (!targetNode) {
        targetNode = new ConstraintGraphNode(node);

        if (target === 'parent' && !result._parent) {
          result._parent = targetNode;
        } else {
          result._nodes.push(targetNode);
        }
      }

      const incomingEdge = new IncomingConstraintGraphEdge(
        sourceNode!,
        constraint,
      );
      const outgoingEdge = new OutgoingConstraintGraphEdge(
        targetNode!,
        constraint,
      );

      sourceNode?._outgoingEdges.push(outgoingEdge);
      targetNode._incomingEdges.push(incomingEdge);
    });
  });

  validateConstraintGraph(result);

  return result;
};

const Errors = {
  CONFLICTING_CONSTRAINTS:
    'Two or more constraints are in conflict. This can happen if two constraints have the same target and pin, or if the same constraint is applied to multiple targets.',
};
const validateConstraintGraph: (constraintGraph: ConstraintGraph) => boolean = (
  constraintGraph,
) => {
  constraintGraph._nodes.forEach((node) => {
    const incomingConstraintSet = new Set(
      node._incomingEdges.map((node) => {
        let positionProperty;
        if (
          node._constraint.pin === Pin.top ||
          node._constraint.pin === Pin.bottom
        ) {
          positionProperty = 'top';
        } else {
          positionProperty = 'left';
        }
        return node._from._node.label + positionProperty;
      }),
    );
    if (incomingConstraintSet.size !== node._incomingEdges.length) {
      throw new Error(Errors.CONFLICTING_CONSTRAINTS);
    }

    const outgoingConstraintSet = new Set(
      node._outgoingEdges.map(
        (node) => node._to._node.label + node._constraint.pin,
      ),
    );
    if (outgoingConstraintSet.size !== node._outgoingEdges.length) {
      throw new Error(Errors.CONFLICTING_CONSTRAINTS);
    }
  });

  return true;
};

export {
  buildConstraintGraph,
  validateConstraintGraph,
  ConstraintGraph,
  ConstraintGraphNode,
};
