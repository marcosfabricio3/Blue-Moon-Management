// utils/fileHandler.js
import fs from 'fs/promises';

export const readData = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Error reading data from ${filePath}: ${error.message}`);
  }
};

export const writeData = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error(`Error writing data to ${filePath}: ${error.message}`);
  }
};
