export type Graph = any;

export type GraphNode = {
  id: string;
  name?: string;
};

export type GraphEdge = {
  id: string;
  sourceId: string;
  targetId: string;
  directed: boolean;
};
