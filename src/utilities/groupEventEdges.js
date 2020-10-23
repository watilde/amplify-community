import {reduce, assoc, invertObj} from 'ramda';
import moment from 'moment';
import * as extract from './extract';

export const monthNameByIndex = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const monthIndexByName = invertObj(monthNameByIndex);

const extractDateFromNode = extract.fromPath(['node', 'fields', 'date']);

export default reduce((accumulator, current) => {
  const stringifiedDate = extractDateFromNode(current);
  const date = new Date(stringifiedDate);
  const year = date.getFullYear();
  const monthIndex = date.getMonth();
  const month = monthNameByIndex[monthIndex];
  const key = `${month} ${year}`;
  current.node.fields.date = moment(stringifiedDate).format(`MMMM D, YYYY`);
  return assoc(key, [...(accumulator[key] || []), current], accumulator);
}, {});
