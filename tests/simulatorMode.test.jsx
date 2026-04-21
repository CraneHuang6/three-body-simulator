import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SimulatorMode } from '../src/modes/SimulatorMode.jsx';
import { SCENARIOS } from '../src/lib/simulation.jsx';

describe('SimulatorMode preset UI', () => {
  it('renders eight story presets as visible quick-switch controls', () => {
    const html = renderToStaticMarkup(
      <SimulatorMode onBack={() => {}} onSwitchMode={() => {}} />,
    );

    expect(html).toContain('八大天象默认参数');
    expect(html).toContain('辉光范围');
    expect(html).toContain('simulator-stage-actions');
    expect(html).toContain('全屏');
    expect(html).toContain('重置参数');
    expect(html).toContain('三体星温度');
    expect(html).toContain('自由模拟器');
    expect(html).toContain('四体模拟可视化');
    expect(html).not.toContain('质量档');
    expect(html).not.toContain('STAR α');
    expect(html).not.toContain('PLANET');
    for (const scenario of SCENARIOS) {
      expect(html).toContain(scenario.name);
    }
  });
});
