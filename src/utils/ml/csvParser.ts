import type { DataPoint2D } from '../../types/ml';

export interface CSVParseResult {
  success: boolean;
  points?: DataPoint2D[];
  headers?: string[];
  error?: string;
  rowCount?: number;
}

export function parseCSVTo2DPoints(
  csvText: string,
  xColIdx = 0,
  yColIdx = 1,
  labelColIdx = 2
): CSVParseResult {
  const lines = csvText.trim().split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length < 2) {
    return { success: false, error: 'CSV file must contain at least a header row and 1 data row.' };
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  if (headers.length < 2) {
    return { success: false, error: 'CSV must contain at least 2 columns (for X and Y coordinates).' };
  }

  const points: DataPoint2D[] = [];
  const maxRows = 200; // Limit for in-browser visual performance

  for (let i = 1; i < lines.length; i++) {
    if (points.length >= maxRows) break;
    const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
    if (cols.length < 2) continue; // Skip malformed empty lines

    const xVal = parseFloat(cols[xColIdx]);
    const yVal = parseFloat(cols[yColIdx]);

    if (isNaN(xVal) || isNaN(yVal)) {
      return {
        success: false,
        error: `Row ${i + 1} contains non-numeric coordinates: "${cols[xColIdx]}", "${cols[yColIdx]}".`,
      };
    }

    let labelVal: number | undefined = undefined;
    if (cols.length > labelColIdx && cols[labelColIdx] !== undefined) {
      const parsedLabel = parseFloat(cols[labelColIdx]);
      labelVal = !isNaN(parsedLabel) ? parsedLabel : (cols[labelColIdx].toLowerCase() === 'yes' || cols[labelColIdx].toLowerCase() === 'true' ? 1 : 0);
    }

    points.push({
      x: xVal,
      y: yVal,
      label: labelVal,
      id: points.length,
    });
  }

  if (points.length === 0) {
    return { success: false, error: 'No valid numeric data rows could be parsed from the CSV.' };
  }

  return {
    success: true,
    points,
    headers,
    rowCount: points.length,
  };
}
