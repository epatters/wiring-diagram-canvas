#!/usr/bin/env julia

using Catlab, Catlab.Doctrines, Catlab.WiringDiagrams, Catlab.Graphics
using Catlab.Graphics: Graphviz

W, X, Y, Z = Ob(FreeCartesianCategory, :W, :X, :Y, :Z)
I = munit(FreeCartesianCategory.Ob)
f = Hom(:f, otimes(X,Y), Z)
g = Hom(:g, Z, Z)
h = Hom(:h, I, W)

diagram = to_wiring_diagram(otimes(compose(f,g),h))
write_json_graph(diagram, "simple_graph.json", indent=2)

graph = to_graphviz(diagram,
  direction = :horizontal,
  labels = false, node_labels = false,
  port_size = "0",
  cell_attrs = Graphviz.Attributes(
    :width => "40",
    :height => "40",
  )
)

open("simple_graph.dot", "w") do io
  Graphviz.pprint(io, graph)
end
open("simple_graph.dot.json", "w") do io
  print(io, Graphviz.run_graphviz(graph, format="json0"))
end
