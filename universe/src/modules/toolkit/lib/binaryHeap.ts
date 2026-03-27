/**
 * 二叉堆实现的优先队列（Top-K、配色排序等）
 * 默认最小堆：堆顶为 compare 意义下最小元素
 */

export type CompareFn<T> = (a: T, b: T) => number;

export class BinaryHeap<T> {
  private heap: T[] = [];

  constructor(private compare: CompareFn<T>) {}

  get size(): number {
    return this.heap.length;
  }

  peek(): T | undefined {
    return this.heap[0];
  }

  push(item: T): void {
    this.heap.push(item);
    this.siftUp(this.heap.length - 1);
  }

  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const root = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.siftDown(0);
    }
    return root;
  }

  /** 取全部元素（破坏堆顺序），用于调试 */
  drain(): T[] {
    const out: T[] = [];
    while (this.heap.length) {
      const x = this.pop();
      if (x !== undefined) out.push(x);
    }
    return out;
  }

  private siftUp(i: number): void {
    const { heap, compare } = this;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (compare(heap[i], heap[p]) >= 0) break;
      [heap[i], heap[p]] = [heap[p], heap[i]];
      i = p;
    }
  }

  private siftDown(i: number): void {
    const { heap, compare } = this;
    const n = heap.length;
    while (true) {
      const l = i * 2 + 1;
      const r = i * 2 + 2;
      let smallest = i;
      if (l < n && compare(heap[l], heap[smallest]) < 0) smallest = l;
      if (r < n && compare(heap[r], heap[smallest]) < 0) smallest = r;
      if (smallest === i) break;
      [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
      i = smallest;
    }
  }
}

/** 最大堆：堆顶为最大元素 */
export function createMaxHeap<T>(compare: CompareFn<T>): BinaryHeap<T> {
  return new BinaryHeap<T>((a, b) => -compare(a, b));
}

/**
 * 从数组中取「最小」的 K 个元素（按 compare），使用最大堆维护当前 Top-K
 * 时间复杂度 O(n log k)
 */
export function topKSmallest<T>(items: T[], k: number, compare: CompareFn<T>): T[] {
  if (k <= 0 || items.length === 0) return [];
  if (k >= items.length) return [...items].sort(compare);

  const maxHeap = createMaxHeap<T>(compare);
  for (const item of items) {
    if (maxHeap.size < k) {
      maxHeap.push(item);
    } else {
      const worst = maxHeap.peek();
      if (worst !== undefined && compare(item, worst) < 0) {
        maxHeap.pop();
        maxHeap.push(item);
      }
    }
  }
  return maxHeap.drain().sort(compare);
}
