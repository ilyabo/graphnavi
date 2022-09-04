# Graphnavi

Network analysis and visualization tool

![image](https://user-images.githubusercontent.com/351828/188308036-c6ccc12b-ec6f-4403-9724-ddeaad5b943c.png)

## Rationale
Network analysis tools can be intimidating, and especially, the data preparation in the form that these tools expect (which often involves combining multiple datasets) can be very time consuming.
SQL is a very powerful and quite popuar language for data analysis and manipulation which can be of immense help for the data preparation. However, setting up a database with an SQL query engine is often a tedious process.
Thanks to [DuckDB](https://www.duckdb.org") we can now run an efficient SQL database, execute queries directly in the browser
and pass the results to a graph layout engine to visualize them as a network.



## Roadmap
- Saving added datasets and queries to GitHub Gists
- Support for more visual attributes: node sizes, colors, edge thickness, color, edge labels
- Non-expert mode not requiring familiarity with SQL
- More efficient data structures (arrow) for the graph/layout to support larger graphs  
- Graph layout taking node/edge weights/importance into account (e.g. [like this one](https://networkofthrones.wordpress.com/)) 
- Consider using other graph rendering approaches: [one](https://observablehq.com/@zakjan/force-directed-graph-pixi), [two](https://bl.ocks.org/BTKY/6c282b65246f8f46bb55aadc322db709), [three](https://observablehq.com/@subbuballa/force-directed-graph) 



## Development

```bash
npm install
npm run dev
# or
yarn
yarn dev
```
