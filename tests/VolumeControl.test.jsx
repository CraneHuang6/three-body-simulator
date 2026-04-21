import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { VolumeControl } from '../src/components/VolumeControl.jsx';

describe('VolumeControl', () => {
  it('renders a range slider and a toggle button', () => {
    const html = renderToStaticMarkup(
      <VolumeControl value={0.5} onChange={() => {}} />,
    );
    expect(html).toContain('type="range"');
    expect(html).toContain('min="0"');
    expect(html).toContain('max="1"');
    expect(html).toContain('volume-control');
    expect(html).toContain('volume-control__icon');
  });
});
