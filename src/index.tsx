import NumericInput from './components/NumericInput';
import { DIMENSIONS } from './utils/dimensions';

export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}

export default NumericInput;
export { DIMENSIONS };
