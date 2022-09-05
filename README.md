# Graphnavi

Network analysis and visualization tool: [graphnavi.vercel.app](https://graphnavi.vercel.app/)

![image](https://user-images.githubusercontent.com/351828/188310445-91655c7d-1b60-46d4-b000-b72acd4d2be1.png)

https://user-images.githubusercontent.com/351828/188310397-9a14b73f-41ba-47e3-b1df-88fa0b400cd3.mp4



## Rationale
Network analysis tools can be intimidating, and especially, the data preparation in the form that these tools expect (which often involves combining multiple datasets) can be very time consuming.
SQL is a very powerful and quite popuar language for data analysis and manipulation which can be of immense help for the data preparation. However, setting up a database with an SQL query engine is often a tedious process.
Thanks to [DuckDB](https://www.duckdb.org") we can now run an efficient SQL database, execute queries directly in the browser
and pass the results to a graph layout engine to visualize them as a network.



## Roadmap
- Non-expert mode not requiring familiarity with SQL
- Support for more visual attributes: node sizes, colors, edge thickness, color, edge labels
- Saving added datasets and queries to GitHub Gists
- Query history
- Table view for the input files and for the query results
- Pass table schema to the query auto-completion engine
- More efficient data structures (arrow) for the graph/layout to support larger graphs  
- Graph layout taking node/edge weights/importance into account (e.g. [like this one](https://networkofthrones.wordpress.com/)) 
- Consider using other graph rendering approaches: [one](https://observablehq.com/@zakjan/force-directed-graph-pixi), [two](https://bl.ocks.org/BTKY/6c282b65246f8f46bb55aadc322db709), [three](https://observablehq.com/@subbuballa/force-directed-graph)
- Weighted [one](https://observablehq.com/@stefanwenger/game-of-thrones-character-influence), [two](https://observablehq.com/@ericmauviere/graphology-et-migrations-residentielles-entre-aires), [three](https://observablehq.com/@jrladd/gotgraphology), [four](https://observablehq.com/@mef/forceatlas2-layout-settings-visualized)


## Development

```bash
npm install
npm run dev
# or
yarn
yarn dev
```
