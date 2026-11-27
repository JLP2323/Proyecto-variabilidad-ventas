import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const CONFIG_PATH = new URL('../src/config/variants.json', import.meta.url);

/**
 * Valida el esquema de variants.json. Devuelve un arreglo de errores (vacío = válido).
 * - Debe existir al menos las variantes `basic` y `premium`.
 * - Cada variante define todas las features como booleanos.
 * - Las features obligatorias (`required`) siempre activas.
 * - Dependencias entre features respetadas (combinaciones inválidas).
 */
export function validateConfig(config) {
  const errors = [];
  if (!config || typeof config !== 'object') return ['La configuración debe ser un objeto'];
  const { required, dependencies = {}, variants } = config;

  if (!Array.isArray(required) || required.length === 0) errors.push('`required` debe ser un arreglo no vacío');
  if (!variants || typeof variants !== 'object') return [...errors, '`variants` es obligatorio'];

  for (const name of ['basic', 'premium']) {
    if (!variants[name]) errors.push(`Falta la variante "${name}"`);
  }

  const allFeatures = new Set(Object.values(variants).flatMap((v) => Object.keys(v)));

  for (const [name, features] of Object.entries(variants)) {
    for (const f of allFeatures) {
      if (typeof features[f] !== 'boolean') errors.push(`${name}.${f} debe ser booleano`);
    }
    for (const f of required ?? []) {
      if (features[f] !== true) errors.push(`${name}: la característica obligatoria "${f}" debe estar activa`);
    }
    for (const [feature, needs] of Object.entries(dependencies)) {
      if (features[feature] === true) {
        for (const dep of needs) {
          if (features[dep] !== true) errors.push(`${name}: "${feature}" requiere "${dep}" activa`);
        }
      }
    }
  }
  // Premium debe incluir todo lo de Básica (sin duplicar ni quitar capacidades)
  if (variants.basic && variants.premium) {
    for (const [f, on] of Object.entries(variants.basic)) {
      if (on === true && variants.premium[f] !== true) errors.push(`premium debe incluir "${f}" de basic`);
    }
  }
  return errors;
}

// Ejecución por CLI: node scripts/validate-config.js
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const errors = validateConfig(JSON.parse(readFileSync(CONFIG_PATH, 'utf8')));
  if (errors.length) {
    console.error('Configuración de variantes inválida:\n - ' + errors.join('\n - '));
    process.exit(1);
  }
  console.log('Configuración de variantes válida');
}
