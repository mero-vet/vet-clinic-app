class RelationshipManager {
  constructor() {
    this.relationships = new Map();
    this.relationshipTypes = {
      PET_OWNER: 'pet_owner',
      SIBLING: 'sibling',
      PARENT_CHILD: 'parent_child',
      MATE: 'mate',
      REFERRER: 'referrer',
      EMERGENCY_CONTACT: 'emergency_contact',
      BREEDER: 'breeder',
      VETERINARIAN: 'veterinarian',
      STAFF_MEMBER: 'staff_member',
    };
  }

  addRelationship(entityId1, entityId2, type, metadata = {}) {
    if (!this.relationships.has(entityId1)) {
      this.relationships.set(entityId1, []);
    }
    if (!this.relationships.has(entityId2)) {
      this.relationships.set(entityId2, []);
    }

    const relationship = {
      id: this.generateRelationshipId(),
      type,
      metadata,
      createdAt: new Date().toISOString(),
    };

    this.relationships.get(entityId1).push({
      ...relationship,
      targetId: entityId2,
      direction: 'outgoing',
    });

    this.relationships.get(entityId2).push({
      ...relationship,
      targetId: entityId1,
      direction: 'incoming',
    });

    return relationship;
  }

  getRelationships(entityId, type = null, direction = null) {
    const entityRelationships = this.relationships.get(entityId) || [];
    
    return entityRelationships.filter(rel => {
      const typeMatch = !type || rel.type === type;
      const directionMatch = !direction || rel.direction === direction;
      return typeMatch && directionMatch;
    });
  }

  getRelatedEntities(entityId, type = null) {
    const relationships = this.getRelationships(entityId, type);
    return relationships.map(rel => rel.targetId);
  }

  removeRelationship(entityId1, entityId2, type = null) {
    if (this.relationships.has(entityId1)) {
      this.relationships.set(
        entityId1,
        this.relationships.get(entityId1).filter(rel => 
          !(rel.targetId === entityId2 && (!type || rel.type === type))
        )
      );
    }

    if (this.relationships.has(entityId2)) {
      this.relationships.set(
        entityId2,
        this.relationships.get(entityId2).filter(rel => 
          !(rel.targetId === entityId1 && (!type || rel.type === type))
        )
      );
    }
  }

  hasRelationship(entityId1, entityId2, type = null) {
    const relationships = this.getRelationships(entityId1, type);
    return relationships.some(rel => rel.targetId === entityId2);
  }

  getRelationshipGraph(entityId, depth = 1) {
    const visited = new Set();
    const graph = { nodes: [], edges: [] };

    const traverse = (currentId, currentDepth) => {
      if (visited.has(currentId) || currentDepth > depth) return;
      
      visited.add(currentId);
      graph.nodes.push({ id: currentId, depth: currentDepth });

      const relationships = this.getRelationships(currentId);
      relationships.forEach(rel => {
        if (!visited.has(rel.targetId)) {
          graph.edges.push({
            from: currentId,
            to: rel.targetId,
            type: rel.type,
            metadata: rel.metadata,
          });
          traverse(rel.targetId, currentDepth + 1);
        }
      });
    };

    traverse(entityId, 0);
    return graph;
  }

  findPath(entityId1, entityId2, maxDepth = 5) {
    const queue = [[entityId1]];
    const visited = new Set([entityId1]);

    while (queue.length > 0) {
      const path = queue.shift();
      const current = path[path.length - 1];

      if (current === entityId2) {
        return path;
      }

      if (path.length < maxDepth) {
        const relationships = this.getRelationships(current);
        for (const rel of relationships) {
          if (!visited.has(rel.targetId)) {
            visited.add(rel.targetId);
            queue.push([...path, rel.targetId]);
          }
        }
      }
    }

    return null;
  }

  generateRelationshipId() {
    return `rel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  clear() {
    this.relationships.clear();
  }

  export() {
    const data = {};
    this.relationships.forEach((value, key) => {
      data[key] = value;
    });
    return data;
  }

  import(data) {
    this.clear();
    Object.entries(data).forEach(([key, value]) => {
      this.relationships.set(key, value);
    });
  }
}

export default RelationshipManager;