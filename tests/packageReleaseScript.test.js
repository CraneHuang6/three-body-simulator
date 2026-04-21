import fs from 'node:fs';
import path from 'node:path';

describe('release packaging script', () => {
  function loadReleaseScript() {
    return fs.readFileSync(path.resolve(process.cwd(), 'scripts/package-release.sh'), 'utf8');
  }

  it('builds Windows portable artifacts for x64 only without NSIS', () => {
    const script = loadReleaseScript();

    expect(script).not.toContain('nsis');
    expect(script).toContain('electron-v31.7.7-win32-x64.zip');
    expect(script).toContain('release-win-portable/x64');
    expect(script).not.toContain('electron-v31.7.7-win32-arm64.zip');
    expect(script).not.toContain('release-win-portable/arm64');
    expect(script).toContain('/tmp/three-body-simulator-build');
    expect(script).toContain('/tmp/three-body-simulator-npm-cache');
  });

  it('uses the free macOS zip packaging path instead of signed dmg packaging', () => {
    const script = loadReleaseScript();

    expect(script).toContain('node scripts/package-mac-free.mjs');
    expect(script).not.toContain('node scripts/require-macos-signing.mjs');
    expect(script).not.toContain('release-mac-dmg');
    expect(script).not.toContain('--mac dmg');
    expect(script).toContain('THREE_BODY_SIMULATOR_PROJECT_DIR');
    expect(script).toContain('THREE_BODY_SIMULATOR_RELEASE_DIR');
    expect(script).toContain('THREE_BODY_SIMULATOR_ELECTRON_DIST_DIR');
    expect(script).toContain('THREE_BODY_SIMULATOR_MAC_ARCH');
  });
});
