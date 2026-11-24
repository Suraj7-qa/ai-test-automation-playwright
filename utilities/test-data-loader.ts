import * as fs from 'fs';
import * as path from 'path';

const TESTDATA_DIR = path.resolve(__dirname, '../testdata');

export interface TestData {
  ui?: Record<string, any>;
  api?: Record<string, any>;
  db?: Record<string, any>;
}

let cachedTestData: TestData | null = null;

export function loadTestData(category: 'ui' | 'api' | 'db' = 'ui'): any {
  const filePath = path.join(TESTDATA_DIR, category, 'data.json');
  if (!fs.existsSync(filePath)) {
    throw new Error(`Test data not found: ${category} at ${filePath}`);
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

export function loadAllTestData(): TestData {
  if (cachedTestData) {
    return cachedTestData;
  }

  const categories: ('ui' | 'api' | 'db')[] = ['ui', 'api', 'db'];
  const data: TestData = {};

  for (const category of categories) {
    const filePath = path.join(TESTDATA_DIR, category, 'data.json');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      data[category] = JSON.parse(content);
    }
  }

  cachedTestData = data;
  return data;
}

export function getTestData(category: 'ui' | 'api' | 'db', key: string): any {
  const data = loadTestData(category);
  const keys = key.split('.');
  let value: any = data;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      throw new Error(`Test data key '${key}' not found in category '${category}'`);
    }
  }

  return value;
}

export function clearCache(): void {
  cachedTestData = null;
}

export function reloadTestData(category: 'ui' | 'api' | 'db'): any {
  clearCache();
  return loadTestData(category);
}