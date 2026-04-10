/**
 * Models for code execution in executable code cells.
 */

/**
 * Output from code execution.
 */
export interface CodeExecutionOutput {
  stdout?: string;
  stderr?: string;
  output?: string;
  code?: number;
}

/**
 * Request payload for code execution.
 */
export interface CodeExecutionRequest {
  code: string;
  language: string;
  timeout?: number;
}

/**
 * Supported programming languages for code execution.
 */
export type SupportedLanguage = 'python' | 'javascript' | 'typescript';
