import { test, expect } from 'vitest';
import Home from '@/pages/HomePage.vue';

test('first test', () => {
    expect(1 + 1).toBe(3);
});

test('vue test', () => {
    console.log(Home);
});
