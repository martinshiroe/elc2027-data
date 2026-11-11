import { ELCData } from '../types';
import rawData from '../../data/elc2027-data.json';
import { preparerVitrine } from '../lib/vitrine';

export const initialELCData: ELCData = preparerVitrine(rawData as ELCData);
