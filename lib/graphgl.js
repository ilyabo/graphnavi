import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import DeckGL from "@deck.gl/react";
import { OrthographicView } from "@deck.gl/core";
import { extent } from "d3-array";

import {
  BaseLayout,
  Graph,
  GraphLayer,
  ViewControl,
  SimpleLayout,
} from "graph.gl";
import GraphEngine from "./graph-engine";

const INITIAL_VIEW_STATE = {
  // the target origin of th view
  target: [0, 0],
  // zoom level
  zoom: 1,
};

// the default cursor in the view
const DEFAULT_CURSOR = "default";

// A wrapper for positioning the ViewControl component
const PositionedViewControl = ({
  fitBounds,
  panBy,
  zoomBy,
  zoomLevel,
  maxZoom,
  minZoom,
}) => (
  <div style={{ position: "relative", top: "20px", left: "20px" }}>
    <ViewControl
      fitBounds={fitBounds}
      panBy={panBy}
      zoomBy={zoomBy}
      zoomLevel={zoomLevel}
      maxZoom={maxZoom}
      minZoom={minZoom}
    />
  </div>
);

export default class GraphGL extends PureComponent {
  static displayName = "GraphGL";

  static propTypes = {
    /** Input graph data */
    graph: PropTypes.object.isRequired,
    /** Layout algorithm */
    layout: PropTypes.object.isRequired,
    /** Node event callbacks */
    nodeEvents: PropTypes.shape({
      onClick: PropTypes.func,
      onMouseLeave: PropTypes.func,
      onHover: PropTypes.func,
      onMouseEnter: PropTypes.func,
    }).isRequired,
    /** Declarative node style */
    nodeStyle: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
    ),
    /** Declarative edge style */
    edgeStyle: PropTypes.shape({
      stroke: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      strokeWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
      decorators: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
      ),
    }).isRequired,
    /** Edge event callbacks */
    edgeEvents: PropTypes.shape({
      onClick: PropTypes.func,
      onHover: PropTypes.func,
    }),
    /** The initial view state of the viewport */
    initialViewState: PropTypes.shape({
      target: PropTypes.arrayOf(PropTypes.number),
      zoom: PropTypes.number,
    }),
    /** A component to control view state. */
    ViewControlComponent: PropTypes.func,
    /** A minimum scale factor for zoom level of the graph. */
    minZoom: PropTypes.number,
    /** A maximum scale factor for zoom level of the graph. */
    maxZoom: PropTypes.number,
    /** Padding for fitting entire graph in the screen. (pixel) */
    viewportPadding: PropTypes.number,
    /** Changes the scroll wheel sensitivity when zooming. This is a multiplicative modifier.
      So, a value between 0 and 1 reduces the sensitivity (zooms slower),
      and a value greater than 1 increases the sensitivity (zooms faster) */
    wheelSensitivity: PropTypes.number,
    /** Whether zooming the graph is enabled */
    enableZooming: PropTypes.bool,
    /** Whether panning the graph is enabled */
    enablePanning: PropTypes.bool,
    /** Whether dragging the node is enabled */
    enableDragging: PropTypes.bool,
    /** Resume layout calculation after dragging a node */
    resumeLayoutAfterDragging: PropTypes.bool,
  };

  static defaultProps = {
    graph: new Graph(),
    layout: new SimpleLayout(),
    nodeStyle: [],
    nodeEvents: {
      onMouseEnter: null,
      onHover: null,
      onMouseLeave: null,
      onClick: null,
      onDrag: null,
    },
    edgeStyle: {
      decorators: [],
      stroke: "black",
      strokeWidth: 1,
    },
    edgeEvents: {
      onClick: null,
      onHover: null,
    },
    initialViewState: INITIAL_VIEW_STATE,
    ViewControlComponent: PositionedViewControl,
    minZoom: -20,
    maxZoom: 20,
    viewportPadding: 50,
    wheelSensitivity: 0.5,
    enableZooming: true,
    enablePanning: true,
    enableDragging: false,
    resumeLayoutAfterDragging: false,
  };

  state = {
    viewState: {
      ...INITIAL_VIEW_STATE,
      ...this.props.initialViewState,
    },
  };

  constructor(props) {
    super(props);
    this._engine = new GraphEngine();
    // this._engine = new (class extends GraphEngine {
    //   _onLayoutDone() {
    //     super._onLayoutDone();
    //     console.log("_onLayoutChange");
    //   }
    // })();
    this._graph = null;
    this._layout = null;
    this._setProps(this.props);
    // console.log("this._engine.registerCallbacks");
    // this._engine.registerCallbacks({
    //   onLayoutChange: () => {
    //     console.log("onLayoutChange");
    //   },
    //   onLayoutDone: () => {
    //     console.log("onLayoutDone");
    //     this.forceUpdate();
    //   },
    // });
    // this._engine.start();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this._setProps(nextProps);
  }

  _setProps = (props) => {
    const { graph, layout } = props;

    // set graph
    const validGraph = graph instanceof Graph;
    let graphChanged = false;
    if (!validGraph) {
      console.error("Invalid graph data class")();
      return;
    } else {
      graphChanged = !graph.equals(this._graph);
      if (graphChanged) {
        this._graph = graph;
      }
    }

    // set layout
    const validLayout = layout instanceof BaseLayout;
    let layoutChanged = false;
    if (!validLayout) {
      console.error("Invalid layout class")();
      return;
    } else {
      layoutChanged = !layout.equals(this._layout);
      if (layoutChanged) {
        this._layout = layout;
      }
    }

    // if graph or layout is changed, re-run the layout calculation
    if (graphChanged || layoutChanged) {
      // this._engine = new GraphEngine();
      this._engine.clear();
      this._engine.run(this._graph, this._layout);
      // this._engine.registerCallbacks({
      //   onLayoutChange: () => {
      //     console.log("onLayoutChange");
      //     this.forceUpdate();
      //     this.fitBounds();
      //   },
      // });
      // const interval = setInterval(() => {
      //   this.forceUpdate();
      //   this.fitBounds();
      // }, 100);
    }
  };

  // Relatively pan the graph by a specified position vector.
  panBy = (dx, dy) =>
    this.setState({
      viewState: {
        ...this.state.viewState,
        target: [
          this.state.viewState.target[0] + dx,
          this.state.viewState.target[1] + dy,
        ],
      },
    });

  // Relatively zoom the graph by a delta zoom level
  zoomBy = (deltaZoom) => {
    const { minZoom, maxZoom } = this.props;
    const newZoom = this.state.viewState.zoom + deltaZoom;
    this.setState({
      viewState: {
        ...this.state.viewState,
        zoom: Math.min(Math.max(newZoom, minZoom), maxZoom),
      },
    });
  };

  fitBounds = () => {
    const { width, height } = this.state.viewState;
    const { viewportPadding, minZoom, maxZoom } = this.props;
    const data = this._engine.getGraph().getNodes();

    // get the projected position of all nodes
    const positions = data.map((d) => this._engine.getNodePosition(d));
    // get the value range of x and y
    const xExtent = extent(positions, (d) => d[0]);
    const yExtent = extent(positions, (d) => d[1]);
    const newTarget = [
      (xExtent[0] + xExtent[1]) / 2,
      (yExtent[0] + yExtent[1]) / 2,
    ];
    const zoom = Math.min(
      width / (xExtent[1] - xExtent[0] + viewportPadding * 2),
      height / (yExtent[1] - yExtent[0] + viewportPadding * 2)
    );
    // zoom value is at log scale
    const newZoom = Math.min(Math.max(minZoom, Math.log(zoom)), maxZoom);
    this.setState({
      viewState: {
        ...this.state.viewState,
        target: newTarget,
        zoom: newZoom,
      },
    });
  };

  _onResize = ({ width, height }) =>
    this.setState({
      viewState: {
        ...this.state.viewState,
        width,
        height,
      },
    });

  _onViewStateChange = ({ viewState }) => this.setState({ viewState });

  render() {
    const {
      nodeEvents,
      nodeStyle,
      edgeStyle,
      edgeEvents,
      minZoom,
      maxZoom,
      enableDragging,
      enablePanning,
      enableZooming,
      ViewControlComponent,
      resumeLayoutAfterDragging,
    } = this.props;

    return (
      <div>
        <DeckGL
          width="100%"
          height="100%"
          ref={(ref) => {
            this._deckRef = ref;
          }}
          getCursor={() => DEFAULT_CURSOR}
          viewState={this.state.viewState}
          onResize={this._onResize}
          onViewStateChange={this._onViewStateChange}
          views={[
            new OrthographicView({
              controller: {
                minZoom,
                maxZoom,
                scrollZoom: enableZooming,
                touchZoom: enableZooming,
                doubleClickZoom: enableZooming,
                dragPan: enablePanning,
              },
            }),
          ]}
          layers={[
            new GraphLayer({
              // id: this.props.updateIndex,
              engine: this._engine,
              nodeStyle,
              nodeEvents,
              edgeStyle,
              edgeEvents,
              enableDragging,
              resumeLayoutAfterDragging,
            }),
          ]}
        />
        {/*<ViewControlComponent*/}
        {/*  fitBounds={this.fitBounds}*/}
        {/*  panBy={this.panBy}*/}
        {/*  zoomBy={this.zoomBy}*/}
        {/*  zoomLevel={this.state.viewState.zoom}*/}
        {/*  maxZoom={maxZoom}*/}
        {/*  minZoom={minZoom}*/}
        {/*/>*/}
      </div>
    );
  }
}
