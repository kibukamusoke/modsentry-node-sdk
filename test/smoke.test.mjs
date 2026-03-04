import test from 'node:test';
import assert from 'node:assert/strict';

import { ModsentryClient } from '../dist/index.js';

test('exports ModsentryClient and allows api key updates', () => {
  const client = new ModsentryClient({
    apiKey: 'mod_test_1234567890',
    baseUrl: 'https://api.example.com/',
  });

  assert.ok(client);
  assert.equal(typeof client.moderateMessage, 'function');
  assert.equal(typeof client.moderateBatch, 'function');
  assert.equal(typeof client.getSessionSettings, 'function');
  assert.equal(typeof client.updateSessionSettings, 'function');

  client.setApiKey('mod_test_0987654321');
});

test('throws when api key is missing', () => {
  assert.throws(() => {
    // @ts-expect-error runtime validation check
    new ModsentryClient({ apiKey: '', baseUrl: 'https://api.example.com' });
  }, /apiKey/i);
});
