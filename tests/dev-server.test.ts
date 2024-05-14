import { runDevServer } from '../src/run-dev-server';
import fs from 'node:fs';
import { describe, it, expect, spyOn } from 'bun:test'


const spy = spyOn(fs, "readdirSync");

describe('devServer', () => {

  it('should have called the readdirSync', async () => {
    runDevServer('./path/to/functions');

    // Assert that the handler for the function file was called
    expect(spy).toHaveBeenCalledWith('./path/to/functions');
  });
});