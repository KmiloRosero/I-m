/**
 * The Cyborg 15 keyboard, without a numpad: a short function row and five
 * full rows, every row 15 units wide. `code` matches `KeyboardEvent.code`,
 * so a key on the user's own keyboard presses the same key on the model.
 */

export interface KeySpec {
  code: string
  label: string
  /** Width in key units (1 = one letter key). */
  width: number
  /** Second legend, drawn small above the main one. */
  shift?: string
  /** WASD keycaps are clear on the real laptop. */
  accent?: boolean
}

export interface KeyRow {
  /** Height in key units; the function row is shorter. */
  height: number
  keys: KeySpec[]
}

export const ROW_UNITS = 15

const key = (code: string, label: string, width = 1, extra: Partial<KeySpec> = {}): KeySpec => ({
  code,
  label,
  width,
  ...extra,
})

const letters = (codes: string) => [...codes].map((letter) => key(`Key${letter}`, letter))

export const KEYBOARD_ROWS: KeyRow[] = [
  {
    height: 0.62,
    keys: [
      key('Escape', 'Esc'),
      ...Array.from({ length: 12 }, (_, index) => key(`F${index + 1}`, `F${index + 1}`)),
      key('Insert', 'Ins'),
      key('Delete', 'Del'),
    ],
  },
  {
    height: 1,
    keys: [
      key('Backquote', '`', 1, { shift: '~' }),
      ...['!', '@', '#', '$', '%', '^', '&', '*', '('].map((shift, index) =>
        key(`Digit${index + 1}`, String(index + 1), 1, { shift }),
      ),
      key('Digit0', '0', 1, { shift: ')' }),
      key('Minus', '-', 1, { shift: '_' }),
      key('Equal', '=', 1, { shift: '+' }),
      key('Backspace', '⟵', 2),
    ],
  },
  {
    height: 1,
    keys: [
      key('Tab', 'Tab', 1.5),
      key('KeyQ', 'Q'),
      key('KeyW', 'W', 1, { accent: true }),
      ...letters('ERTYUIOP'),
      key('BracketLeft', '[', 1, { shift: '{' }),
      key('BracketRight', ']', 1, { shift: '}' }),
      key('Backslash', '\\', 1.5, { shift: '|' }),
    ],
  },
  {
    height: 1,
    keys: [
      key('CapsLock', 'Caps Lock', 1.75),
      key('KeyA', 'A', 1, { accent: true }),
      key('KeyS', 'S', 1, { accent: true }),
      key('KeyD', 'D', 1, { accent: true }),
      ...letters('FGHJKL'),
      key('Semicolon', ';', 1, { shift: ':' }),
      key('Quote', "'", 1, { shift: '"' }),
      key('Enter', 'Enter', 2.25),
    ],
  },
  {
    height: 1,
    keys: [
      key('ShiftLeft', 'Shift', 2.25),
      ...letters('ZXCVBNM'),
      key('Comma', ',', 1, { shift: '<' }),
      key('Period', '.', 1, { shift: '>' }),
      key('Slash', '/', 1, { shift: '?' }),
      key('ShiftRight', 'Shift', 1.75),
      key('ArrowUp', '▲'),
    ],
  },
  {
    height: 1,
    keys: [
      key('ControlLeft', 'Ctrl', 1.25),
      key('Fn', 'Fn'),
      key('MetaLeft', '⊞', 1.25),
      key('AltLeft', 'Alt', 1.25),
      key('Space', '', 5.25),
      key('AltRight', 'Alt'),
      key('ControlRight', 'Ctrl'),
      key('ArrowLeft', '◀'),
      key('ArrowDown', '▼'),
      key('ArrowRight', '▶'),
    ],
  },
]

export function rowUnits(row: KeyRow): number {
  return row.keys.reduce((sum, spec) => sum + spec.width, 0)
}

/** Every key's code, for checking a keyboard event against the model. */
export const KEY_CODES = new Set(KEYBOARD_ROWS.flatMap((row) => row.keys.map((spec) => spec.code)))
