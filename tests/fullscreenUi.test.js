import fs from 'node:fs';
import path from 'node:path';

describe('fullscreen button wiring', () => {
  it('renders fullscreen controls in story and simulator modes', () => {
    const appSource = fs.readFileSync(path.resolve(process.cwd(), 'src/App.jsx'), 'utf8');
    const simulatorSource = fs.readFileSync(path.resolve(process.cwd(), 'src/modes/SimulatorMode.jsx'), 'utf8');

    expect(appSource).toContain('FullscreenToggleButton');
    expect(simulatorSource).toContain('FullscreenToggleButton');
    expect(appSource).toContain('frame-fullscreen-button');
    expect(simulatorSource).toContain('frame-fullscreen-button');
  });
});
