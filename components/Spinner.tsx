import React from 'react';
import { SpinnerIcon } from '../constants';

/**
 * O componentă simplă de spinner reutilizabilă.
 */
const Spinner = () => {
  return <SpinnerIcon className="w-5 h-5 animate-spin" />;
};

export default Spinner;
