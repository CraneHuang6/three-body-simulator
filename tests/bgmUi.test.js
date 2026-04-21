import fs from 'node:fs';
import path from 'node:path';

describe('bgm wiring', () => {
  it('mounts looping BGM for story and simulator modes', () => {
    const appSource = fs.readFileSync(path.resolve(process.cwd(), 'src/App.jsx'), 'utf8');

    expect(appSource).toContain('LoopingBgm');
    expect(appSource).toContain('mode === \'story\' || mode === \'simulator\'');
  });

  it('LoopingBgm accepts volume prop', () => {
    const bgmSource = fs.readFileSync(path.resolve(process.cwd(), 'src/components/LoopingBgm.jsx'), 'utf8');
    expect(bgmSource).toContain('volume');
    expect(bgmSource).toContain('audio.volume');
  });
});
