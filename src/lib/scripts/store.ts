import { writable } from 'svelte/store';

export type Theme = 'light' | 'dark';

export let theme = writable<Theme>('light');
