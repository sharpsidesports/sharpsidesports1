import { CourseWeights, ApproachDistributionWeights } from '../../types/golf.js';

export const googleSheetsService = {
  async getCourseWeights(): Promise<CourseWeights | null> {
    try {
      const SHEET_ID = '1Vw2wKLO0x9cGWh8QyL8hmlpIzPsj9YfZE3Tuso1OaYs';
      
      // Using the public sheet URL format
      const response = await fetch(
        `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Sheet1&range=A2:F2`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch course weights');
      }

      const text = await response.text();
      // Remove the google.visualization.Query.setResponse() wrapper
      const jsonText = text.match(/google\.visualization\.Query\.setResponse\((.*)\)/)?.[1];
      if (!jsonText) {
        throw new Error('Invalid response format');
      }

      const data = JSON.parse(jsonText);
      const values = data.table.rows[0].c.map((cell: any) => cell?.v);

      if (!values || values.length < 5) {
        throw new Error('Invalid data format');
      }

      // Convert percentage strings to decimal numbers
      return {
        courseName: values[0],
        ottWeight: parseFloat(values[1]) / 100,
        approachWeight: parseFloat(values[2]) / 100,
        aroundGreenWeight: parseFloat(values[3]) / 100,
        puttingWeight: parseFloat(values[4]) / 100,
        lastUpdated: values[5] || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching course weights:', error);
      return null;
    }
  },

  async getApproachDistributionWeights(): Promise<ApproachDistributionWeights> {
    try {
      const SHEET_ID = '16dZBMfXnRqfc8tvmBtu_C9PF2TeM_19TDcLBYm-r8LQ';
      const response = await fetch(
        `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=AI%20Prox&range=A2:H2`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch approach distribution weights');
      }

      const text = await response.text();
      // Remove the google.visualization.Query.setResponse() wrapper
      const jsonText = text.match(/google\.visualization\.Query\.setResponse\((.*)\)/)?.[1];
      if (!jsonText) {
        throw new Error('Invalid response format');
      }

      const data = JSON.parse(jsonText);
      if (!data.table || !data.table.rows || data.table.rows.length === 0) {
        throw new Error('No data found in approach distribution weights');
      }

      const row = data.table.rows[0].c;
      
      // Safely parse values with error checking
      const parseValue = (cell: any) => {
        if (!cell || cell.v === undefined || cell.v === null) {
          return 0;
        }
        // Remove any % symbol and convert to string to handle both number and string inputs
        const cleanValue = String(cell.v).replace('%', '');
        const value = parseFloat(cleanValue);
        return isNaN(value) ? 0 : value / 100;
      };

      return {
        courseName: row[0]?.v || 'Memorial Park',
        prox100_125Weight: parseValue(row[1]),
        prox125_150Weight: parseValue(row[2]),
        prox150_175Weight: parseValue(row[3]),
        prox175_200Weight: parseValue(row[4]),
        prox200_225Weight: parseValue(row[5]),
        prox225plusWeight: parseValue(row[6]),
        lastUpdated: row[7]?.v || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching approach distribution weights:', error);
      // Return default weights if there's an error
      return {
        courseName: 'Memorial Park',
        prox100_125Weight: 0.094,  // 9.40%
        prox125_150Weight: 0.146,  // 14.60%
        prox150_175Weight: 0.212,  // 21.20%
        prox175_200Weight: 0.169,  // 16.90%
        prox200_225Weight: 0.144,  // 14.40%
        prox225plusWeight: 0.182,  // 18.20%
        lastUpdated: new Date().toISOString()
      };
    }
  }
}; 