import React from 'react';
import * as d3 from 'd3'


export function SchemaTree(
    {
        srcJson,
        id,
        width=1920,
        height=1080,
        x=0,
        y=0,
        rotation=0
    }
){

  const nodes = React.useRef();
  const svgRef = React.useRef();
  //
  // React.useEffect(() => {
  //   d3.json(src, (data) => setNodeJson(data))
  // }, [])

  const tree = data => {
    const root = d3.hierarchy(data);
    // root.dx = 10;
    root.dy = width / (root.height + 1);

    root.dx=25;
    // root.dy=20;
    return d3.tree().nodeSize([root.dx, root.dy])(root);
  }

  React.useEffect(() => {
    console.log(srcJson)
    const root = tree(srcJson)
    console.log('root', root, srcJson)

    let x0 = Infinity;
    let x1 = -x0;
    root.each(d => {
      if (d.x > x1) x1 = d.x;
      if (d.x < x0) x0 = d.x;
    });

    const svg = d3.select(svgRef.current);

    const g = svg.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("transform", `translate(${root.dy / 3},${root.dx - x0})`);

    const link = g.append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(root.links())
    .join("path")
    .attr("d", d3.linkHorizontal()
    .x(d => d.y)
    .y(d => d.x))
    .attr('class', 'schema-link');

    const node = g.append("g")
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 3)
    .selectAll("g")
    .data(root.descendants())
    .join("g")
    .attr("transform", d => `translate(${d.y},${d.x})`);

    node.append("circle")
    .attr("fill", d => d.children ? "#555" : "#999")
    .attr("r", 10)
    .attr('class', 'schema-node');

    node.append("text")
    .attr("dy", "0.31em")
    .attr("x", d => d.children ? -10 : 10)
    .attr("text-anchor", d => d.children ? "end" : "start")
    .text(d => d.data.name)
    .attr('class', 'schema-label')
    .clone(true).lower()
    .attr("stroke", "white")

    nodes.current = root

  }, [])

  return(
    <svg x={x} y={y}
       className={'schema-tree'} id={id} width={width} height={height} x={x} y={y} ref={svgRef}></svg>
  )
}

export function SchemaContainer(
    {
        children,
        height,
        width,
    }
){

  const svg = React.useRef();
  const drag = React.useRef();
  const dragLine = React.useRef();
  const circles = React.useRef();

  const linksRef = React.useRef([]);

  const [links, setLinks] = React.useState([])

  React.useEffect(() => {


    let selectedNode = null;
    let selectedLink = null;
    let mousedownNode = null;
    let mouseupNode = null;

    circles.current = d3.select(svg.current)
      .selectAll('circle')


    let moving = false


    circles.current
    .on('mouseover', function (d) {
      // if (!mousedownNode || d === mousedownNode) return;
      // enlarge target node

      d3.select(this).attr('transform', 'scale(1.2)');
    })
    .on('mouseout', function (d) {
      // if (!mousedownNode || d === mousedownNode) return;
      // unenlarge target node
      d3.select(this).attr('transform', '');
    })
    .on('mousedown', (d) => {

      // select node
      mousedownNode = d;
      selectedNode = (mousedownNode === selectedNode) ? null : mousedownNode;

      moving = true;
      // reposition drag line
      d3.select(dragLine.current)
      .style('marker-end', 'url(#end-arrow)')
      .classed('hidden', false)
      .attr('x1', mousedownNode.layerX)
      .attr('y1', mousedownNode.layerY)
      .attr('x2', mousedownNode.layerX)
      .attr('y2', mousedownNode.layerY)
      // .attr('d', `M${mousedownNode.x},${mousedownNode.y}L${mousedownNode.x},${mousedownNode.y}`);

    })
    .on('mouseup', function (d) {
      if (!mousedownNode) return;
      // moving = false;

      // needed by FF
      // d3.select(dragLine.current).
      //     classed('hidden', true).
      //     style('marker-end', '');

      // check for drag-to-self
      mouseupNode = d;
      if (mouseupNode === mousedownNode) {
        mousedownNode = null;
        mouseupNode = null;
        return;
      }

      // add line
      setLinks([
          ...links,
        {
          x1:mousedownNode.layerX,
          y1:mousedownNode.layerY,
          x2:mouseupNode.layerX,
          y2:mouseupNode.layerY
        }
        ])

      mousedownNode = null;
      mouseupNode = null;

      // unenlarge target node
      d3.select(this).attr('transform', '');

    })

    d3.select(svg.current)
    .on('mousemove', (d) => {
      if (!moving) return;

      d3.select(dragLine.current)
      .attr('x1', mousedownNode.layerX)
      .attr('y1', mousedownNode.layerY)
      .attr('x2', d.layerX)
      .attr('y2', d.layerY)
      // .attr('d', `M${mousedownNode.x},${mousedownNode.y}L${d.x},${d.y}`);
    })
    .on('mouseup', (d) => {
      if (!moving) return;

      d3.select(dragLine.current)
        .classed('hidden', true)

      moving = false;
    });






  }, [links]);


  function mouseup() {
    if (mousedownNode) {
      // hide drag line
      dragLine
      .classed('hidden', true)
      .style('marker-end', '');
    }

    // because :active only works in WebKit?
    svg.classed('active', false);

    // clear mouse event vars
    resetMouseVars();
  }


  return(
      <svg ref={svg} className={'schema-svg'} height={height} width={width}>
        {links.map((link, i) => (
          <line className={'schema-drawnlink'} key={'drawnlink-'+i} {...link}/>
        ))}
        {children}
        <line className={'link dragline hidden'} x1={0} x2={0} y1={0} y2={0} ref={dragLine}/>
      </svg>
  )
}

SchemaContainer.defaultProps = {
  height: 1080,
  width: 1920
}
