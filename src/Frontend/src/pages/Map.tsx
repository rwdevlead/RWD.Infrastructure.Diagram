import React, { useEffect, useRef, useState, useCallback } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import Cytoscape from 'cytoscape';
import { useStore } from '../store/useStore';
import { apiService } from '../api/client';
import { MapLayout } from '../api/types';

// ─────────────────────────────────────────────────
// Node type configuration: colours, labels, shapes
// ─────────────────────────────────────────────────
const NODE_CONFIG: Record<string, { color: string; shape: string; icon: string }> = {
  hardware: { color: '#6366f1', shape: 'roundrectangle', icon: '🖥' },
  vm:       { color: '#06b6d4', shape: 'roundrectangle', icon: '📦' },
  app:      { color: '#10b981', shape: 'ellipse',         icon: '🌐' },
  storage:  { color: '#f59e0b', shape: 'barrel',          icon: '💿' },
  network:  { color: '#8b5cf6', shape: 'diamond',         icon: '🔌' },
  share:    { color: '#f97316', shape: 'tag',             icon: '📂' },
};

// ─────────────────────────────────────────────────
// Cytoscape base stylesheet
// ─────────────────────────────────────────────────
const buildStylesheet = (): any[] => [
  {
    selector: 'node',
    style: {
      'label':             'data(label)',
      'color':             '#f3f4f6',
      'font-size':         '11px',
      'font-family':       'Inter, sans-serif',
      'text-valign':       'bottom',
      'text-halign':       'center',
      'text-margin-y':     6,
      'text-wrap':         'wrap',
      'text-max-width':    '100px',
      'background-color':  'data(color)',
      'border-width':      2,
      'border-color':      'data(borderColor)',
      'width':             'data(size)',
      'height':            'data(size)',
      'shape':             'data(shape)',
      'transition-property':  'border-width, border-color, background-color',
      'transition-duration':  '0.15s',
    } as any,
  },
  {
    selector: 'node:selected',
    style: {
      'border-width':   4,
      'border-color':   '#fff',
      'box-shadow-blur':  8,
      'box-shadow-color': '#ffffff55',
    } as any,
  },
  {
    selector: 'node:hover',
    style: {
      'border-width':  3,
      'border-color':  '#fff',
    } as any,
  },
  {
    selector: 'edge',
    style: {
      'width':             1.5,
      'line-color':        '#2e3f5b',
      'target-arrow-color':'#2e3f5b',
      'target-arrow-shape':'triangle',
      'curve-style':       'bezier',
      'arrow-scale':       0.8,
      'opacity':           0.7,
    },
  },
  {
    selector: 'edge[edgeType="relationship"]',
    style: {
      'line-style':        'dashed',
      'line-color':        '#6366f1',
      'target-arrow-color':'#6366f1',
      'opacity':           0.9,
      'label':             'data(label)',
      'font-size':         '9px',
      'color':             '#9ca3af',
    } as any,
  },
  {
    selector: 'edge:selected',
    style: {
      'line-color':        '#6366f1',
      'target-arrow-color':'#6366f1',
      'opacity':           1,
    },
  },
];

// ─────────────────────────────────────────────────
// Detail panel content per type
// ─────────────────────────────────────────────────
interface NodeData {
  id: string;
  entityType: string;
  entity: Record<string, unknown>;
}

const DetailPanel: React.FC<{ data: NodeData; onClose: () => void }> = ({ data, onClose }) => {
  const { entityType, entity } = data;
  const cfg = NODE_CONFIG[entityType];

  const renderField = (key: string, value: unknown) => {
    if (value === null || value === undefined || value === '') return null;
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
    return (
      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{label}</span>
        <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontFamily: typeof value === 'string' && value.match(/^\d{1,3}\.\d/) ? 'var(--font-mono)' : undefined, textAlign: 'right', maxWidth: '170px', wordBreak: 'break-all' }}>
          {String(value)}
        </span>
      </div>
    );
  };

  const skip = new Set(['id', 'createdAt', 'updatedAt', 'hardwareId', 'virtualMachineId', 'storageId', 'networkId', 'parentId']);
  const fields = Object.entries(entity).filter(([k]) => !skip.has(k));

  return (
    <div style={{
      position: 'absolute', top: '1rem', right: '1rem', bottom: '1rem',
      width: '280px', backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)', zIndex: 10, display: 'flex', flexDirection: 'column',
      animation: 'modalEnter 0.2s ease-out',
    }}>
      {/* Header */}
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: cfg.color + '22', border: `2px solid ${cfg.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
          {cfg.icon}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ fontSize: '0.75rem', color: cfg.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{entityType}</div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {String(entity['name'] ?? entity['title'] ?? `#${entity['id']}`)}
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer', padding: '0.25rem', lineHeight: 1 }}>×</button>
      </div>

      {/* Fields */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 1rem' }}>
        {fields.map(([k, v]) => renderField(k, v))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────
// Main Map component
// ─────────────────────────────────────────────────
const MapPage: React.FC = () => {
  const { hardware, vms, apps, storage, shares, networks, fetchAll } = useStore();
  const cyRef = useRef<Cytoscape.Core | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [savedLayouts, setSavedLayouts] = useState<MapLayout[]>([]);
  const [layoutMode, setLayoutMode] = useState<'cose' | 'breadthfirst' | 'grid'>('cose');
  const [filterTypes, setFilterTypes] = useState<Set<string>>(new Set(Object.keys(NODE_CONFIG)));

  // Load everything
  useEffect(() => {
    fetchAll();
    apiService.getMapLayout().then(setSavedLayouts).catch(() => {});
  }, [fetchAll]);

  // Build Cytoscape elements
  const elements = React.useMemo<Cytoscape.ElementDefinition[]>(() => {
    const nodes: Cytoscape.ElementDefinition[] = [];
    const edges: Cytoscape.ElementDefinition[] = [];

    const posOf = (type: string, id: number) => {
      const saved = savedLayouts.find(l => l.nodeType === type && l.nodeId === id);
      return saved ? { x: saved.x, y: saved.y } : undefined;
    };

    const makeNode = (type: string, id: number, label: string, extra: Record<string, unknown> = {}) => {
      if (!filterTypes.has(type)) return;
      const cfg = NODE_CONFIG[type];
      const pos = posOf(type, id);
      const node: Cytoscape.ElementDefinition = {
        data: {
          id:          `${type}-${id}`,
          label,
          color:       cfg.color,
          borderColor: cfg.color + 'aa',
          shape:       cfg.shape,
          size:        type === 'hardware' ? 56 : type === 'network' ? 60 : 44,
          entityType:  type,
          entityId:    id,
          ...extra,
        },
      };
      if (pos) node.position = pos;
      nodes.push(node);
    };

    const makeEdge = (sourceType: string, sourceId: number, targetType: string, targetId: number, edgeType = 'structural', label = '') => {
      if (!filterTypes.has(sourceType) || !filterTypes.has(targetType)) return;
      edges.push({
        data: {
          id:       `edge-${sourceType}-${sourceId}-${targetType}-${targetId}`,
          source:   `${sourceType}-${sourceId}`,
          target:   `${targetType}-${targetId}`,
          edgeType,
          label,
        },
      });
    };

    // Hardware nodes
    hardware.forEach(h => makeNode('hardware', h.id, h.name, { entity: h }));

    // VM nodes + edges to hardware
    vms.forEach(v => {
      makeNode('vm', v.id, v.name, { entity: v });
      makeEdge('vm', v.id, 'hardware', v.hardwareId);
    });

    // App nodes + edges to VM or hardware
    apps.forEach(a => {
      makeNode('app', a.id, a.name, { entity: a });
      if (a.virtualMachineId) makeEdge('app', a.id, 'vm', a.virtualMachineId);
      else if (a.hardwareId)  makeEdge('app', a.id, 'hardware', a.hardwareId);
    });

    // Storage nodes + edges
    storage.forEach(s => {
      makeNode('storage', s.id, s.name, { entity: s });
      if (s.virtualMachineId) makeEdge('storage', s.id, 'vm', s.virtualMachineId);
      else if (s.hardwareId)  makeEdge('storage', s.id, 'hardware', s.hardwareId);
    });

    // Share nodes + edges to storage
    shares.forEach(sh => {
      makeNode('share', sh.id, sh.name, { entity: sh });
      makeEdge('share', sh.id, 'storage', sh.storageId);
    });

    // Network nodes + member edges
    networks.forEach(n => makeNode('network', n.id, n.name, { entity: n }));

    return [...nodes, ...edges];
  }, [hardware, vms, apps, storage, shares, networks, filterTypes, savedLayouts]);

  // Save node position to API after drag
  const handleNodeDragEnd = useCallback(async (event: Cytoscape.EventObject) => {
    const node = event.target;
    const pos  = node.position();
    const entityType = node.data('entityType') as string;
    const entityId   = node.data('entityId') as number;
    try {
      await apiService.saveMapLayout({ nodeType: entityType, nodeId: entityId, x: pos.x, y: pos.y, locked: false });
    } catch { /* non-critical — silently ignore */ }
  }, []);

  // Wire Cytoscape events
  const handleCyReady = useCallback((cy: Cytoscape.Core) => {
    cyRef.current = cy;
    cy.on('tap', 'node', evt => {
      const d = evt.target.data();
      setSelectedNode({ id: d.id as string, entityType: d.entityType as string, entity: d.entity as Record<string, unknown> });
    });
    cy.on('tap', evt => { if (evt.target === cy) setSelectedNode(null); });
    cy.on('dragfreeon', 'node', handleNodeDragEnd);
  }, [handleNodeDragEnd]);

  const runLayout = (mode: 'cose' | 'breadthfirst' | 'grid') => {
    setLayoutMode(mode);
    if (!cyRef.current) return;
    const hasSavedPositions = savedLayouts.length > 0;
    if (mode === 'cose' && hasSavedPositions) return; // already positioned
    cyRef.current.layout({
      name: mode,
      animate: true,
      animationDuration: 500,
      ...(mode === 'breadthfirst' ? { directed: true, spacingFactor: 1.4 } : {}),
      ...(mode === 'cose' ? { idealEdgeLength: () => 100, nodeRepulsion: () => 4000 } : {}),
    } as any).run();
  };

  const toggleFilter = (type: string) => {
    setFilterTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) { next.delete(type); } else { next.add(type); }
      return next;
    });
  };

  const fitAll = () => cyRef.current?.fit(undefined, 40);
  const zoomIn = () => cyRef.current?.zoom({ level: (cyRef.current.zoom() ?? 1) * 1.3, renderedPosition: { x: cyRef.current.width() / 2, y: cyRef.current.height() / 2 } });
  const zoomOut = () => cyRef.current?.zoom({ level: (cyRef.current.zoom() ?? 1) * 0.77, renderedPosition: { x: cyRef.current.width() / 2, y: cyRef.current.height() / 2 } });

  const totalNodes = Object.keys(NODE_CONFIG).reduce((acc, type) =>
    acc + elements.filter(e => e.data?.entityType === type).length, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)', gap: '0.75rem' }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div className="page-title">
          <h1>Network Diagram</h1>
          <p>Interactive topology of {totalNodes} nodes across your infrastructure. Drag to reposition.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button className="btn btn-secondary btn-sm" onClick={fitAll} title="Fit all">⊡ Fit</button>
          <button className="btn btn-secondary btn-sm" onClick={zoomIn}  title="Zoom in">＋</button>
          <button className="btn btn-secondary btn-sm" onClick={zoomOut} title="Zoom out">－</button>
          <div style={{ width: '1px', height: '28px', backgroundColor: 'var(--border-color)', margin: '0 0.25rem' }} />
          {(['cose', 'breadthfirst', 'grid'] as const).map(mode => (
            <button
              key={mode}
              className={`btn btn-sm ${layoutMode === mode ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => runLayout(mode)}
            >
              {mode === 'cose' ? 'Auto' : mode === 'breadthfirst' ? 'Tree' : 'Grid'}
            </button>
          ))}
        </div>
      </div>

      {/* Legend / Filter bar */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '0.25rem' }}>Show:</span>
        {Object.entries(NODE_CONFIG).map(([type, cfg]) => (
          <button
            key={type}
            onClick={() => toggleFilter(type)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.3rem 0.7rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s ease',
              backgroundColor: filterTypes.has(type) ? cfg.color + '22' : 'var(--bg-tertiary)',
              border: `1px solid ${filterTypes.has(type) ? cfg.color : 'var(--border-color)'}`,
              color: filterTypes.has(type) ? cfg.color : 'var(--text-muted)',
            }}
          >
            <span>{cfg.icon}</span>
            <span style={{ textTransform: 'capitalize' }}>{type}</span>
            <span style={{ opacity: 0.6 }}>
              ({type === 'hardware' ? hardware.length
                : type === 'vm' ? vms.length
                : type === 'app' ? apps.length
                : type === 'storage' ? storage.length
                : type === 'share' ? shares.length
                : networks.length})
            </span>
          </button>
        ))}
      </div>

      {/* Canvas area */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundColor: '#080b12',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}>
          {elements.length === 0 ? (
            <div className="flex-center" style={{ height: '100%', flexDirection: 'column', color: 'var(--text-secondary)' }}>
              <span style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗺️</span>
              <h3>No entities to display</h3>
              <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Add hardware hosts, VMs, or services to populate the diagram.</p>
            </div>
          ) : (
            <CytoscapeComponent
              elements={elements}
              stylesheet={buildStylesheet()}
              layout={savedLayouts.length > 0
                ? { name: 'preset' }
                : { name: 'cose', animate: false, idealEdgeLength: () => 100, nodeRepulsion: () => 4000 } as any
              }
              style={{ width: '100%', height: '100%' }}
              cy={handleCyReady}
              wheelSensitivity={0.2}
            />
          )}
        </div>

        {/* Detail side-panel */}
        {selectedNode && (
          <DetailPanel data={selectedNode} onClose={() => setSelectedNode(null)} />
        )}
      </div>
    </div>
  );
};

export default MapPage;
