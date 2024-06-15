class PriorityQueue {
  constructor() {
    this.nodes = [];
  }

  enqueue(priority, key) {
    this.nodes.push({ key, priority });
    this.sort();
  }

  dequeue() {
    return this.nodes.shift().key;
  }

  sort() {
    this.nodes.sort((a, b) => a.priority - b.priority);
  }

  isEmpty() {
    return !this.nodes.length;
  }
}

class Graph {
  constructor() {
    this.nodes = new Set();
    this.adjacencyList = {};
  }

  addNode(node) {
    this.nodes.add(node);
    this.adjacencyList[node] = {};
  }

  addEdge(node1, node2, weight) {
    this.adjacencyList[node1][node2] = weight;
    this.adjacencyList[node2][node1] = weight;
  }

  dijkstra(startNode) {
    let distances = {};
    let backtrace = {};
    let pq = new PriorityQueue();

    distances[startNode] = 0;

    this.nodes.forEach(node => {
      if (node !== startNode) {
        distances[node] = Infinity;
      }
    });

    pq.enqueue(0, startNode);

    while (!pq.isEmpty()) {
      let shortestStep = pq.dequeue();
      let currentNode = shortestStep;

      Object.keys(this.adjacencyList[currentNode]).forEach(neighbor => {
        let weight = this.adjacencyList[currentNode][neighbor];
        let distance = distances[currentNode] + weight;

        if (distance < distances[neighbor]) {
          distances[neighbor] = distance;
          backtrace[neighbor] = currentNode;
          pq.enqueue(distance, neighbor);
        }
      });
    }

    return { distances, backtrace };
  }

  findShortestPath(startNode, endNode) {
    let { distances, backtrace } = this.dijkstra(startNode);
    let path = [endNode];
    let lastStep = endNode;

    while (lastStep !== startNode) {
      path.unshift(backtrace[lastStep]);
      lastStep = backtrace[lastStep];
    }

    return { path, distance: distances[endNode] };
  }
}

const graph = new Graph();
graph.addNode("A");
graph.addNode("B");
graph.addNode("C");
graph.addNode("D");
graph.addNode("E");

graph.addEdge("A", "B", 1);
graph.addEdge("A", "C", 4);
graph.addEdge("B", "C", 2);
graph.addEdge("B", "D", 5);
graph.addEdge("C", "D", 1);
graph.addEdge("D", "E", 3);

function findShortestPath() {
  const startNode = document.getElementById("startNode").value;
  const endNode = document.getElementById("endNode").value;

  const result = graph.findShortestPath(startNode, endNode);

  const resultElement = document.getElementById("result");

  if (result.distance === Infinity) {
    resultElement.innerHTML = `There is no path from ${startNode} to ${endNode}.`;
  } else {
    resultElement.innerHTML = `Shortest path: ${result.path.join(
        " -> "
    )}<br>Total distance: ${result.distance}`;
  }
}
