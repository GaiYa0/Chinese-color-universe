/**
 * 三维 KD-Tree（RGB 空间），用于最近邻与中国色匹配
 */

export interface KDPoint<T> {
  coords: [number, number, number];
  data: T;
}

export class KDTreeNode<T> {
  constructor(
    public point: KDPoint<T>,
    public axis: number,
    public left: KDTreeNode<T> | null = null,
    public right: KDTreeNode<T> | null = null
  ) {}
}

function distSq(a: [number, number, number], b: [number, number, number]): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return dx * dx + dy * dy + dz * dz;
}

function build<T>(points: KDPoint<T>[], depth: number): KDTreeNode<T> | null {
  if (points.length === 0) return null;
  const axis = depth % 3;
  const sorted = [...points].sort((p, q) => p.coords[axis] - q.coords[axis]);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted[mid]!;
  const left = build(sorted.slice(0, mid), depth + 1);
  const right = build(sorted.slice(mid + 1), depth + 1);
  return new KDTreeNode(median, axis, left, right);
}

/** K 近邻用：最大堆存 (distSq, point)，堆顶为当前 K 个里最远的 */
interface Neighbor<T> {
  d: number;
  p: KDPoint<T>;
}

export class KDTree<T> {
  private root: KDTreeNode<T> | null;

  constructor(points: KDPoint<T>[]) {
    this.root = points.length ? build(points, 0) : null;
  }

  nearest(target: [number, number, number]): KDPoint<T> | null {
    if (!this.root) return null;
    let best: KDPoint<T> | null = null;
    let bestD = Infinity;

    const search = (node: KDTreeNode<T> | null) => {
      if (!node) return;
      const d = distSq(target, node.point.coords);
      if (d < bestD) {
        bestD = d;
        best = node.point;
      }
      const ax = node.axis;
      const diff = target[ax] - node.point.coords[ax];
      const first = diff <= 0 ? node.left : node.right;
      const second = diff <= 0 ? node.right : node.left;
      search(first);
      if (diff * diff < bestD) search(second);
    };

    search(this.root);
    return best;
  }

  /**
   * K 最近邻：最大堆维护当前 K 个候选中「最远」的一个，便于剪枝
   */
  nearestK(target: [number, number, number], k: number): KDPoint<T>[] {
    if (!this.root || k <= 0) return [];
    const heap: Neighbor<T>[] = [];

    const sortMaxRoot = () => heap.sort((a, b) => b.d - a.d);

    const tryAdd = (p: KDPoint<T>) => {
      const d = distSq(target, p.coords);
      if (heap.length < k) {
        heap.push({ d, p });
        sortMaxRoot();
        return;
      }
      if (d >= heap[0]!.d) return;
      heap[0] = { d, p };
      sortMaxRoot();
    };

    const worstDist = () => (heap.length < k ? Infinity : heap[0]!.d);

    const search = (node: KDTreeNode<T> | null) => {
      if (!node) return;
      tryAdd(node.point);
      const ax = node.axis;
      const diff = target[ax] - node.point.coords[ax];
      const first = diff <= 0 ? node.left : node.right;
      const second = diff <= 0 ? node.right : node.left;
      search(first);
      const w = worstDist();
      if (diff * diff < w || heap.length < k) search(second);
    };

    search(this.root);
    return heap.sort((a, b) => a.d - b.d).map((n) => n.p);
  }
}
