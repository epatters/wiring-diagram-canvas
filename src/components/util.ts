import * as Konva from 'konva';


/* Move all ancestors to the top.

   Used to display tooltips without occlusion by other nodes.
 */
export function moveAncestorsToTop(node: Konva.Node, selector?: string) {
  node.findAncestors(selector).map(ancestor => {
    if (ancestor.getParent())
      ancestor.moveToTop();
  });
}