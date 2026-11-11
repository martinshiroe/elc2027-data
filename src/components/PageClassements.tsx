import React from 'react';
import { PageCalendrier } from './PageCalendrier';
import { ELCData } from '../types';
import { Section } from '../lib/routes';
import { EtatDonnees } from './Etats';
export const PageClassements = ({data,onNaviguer}: {data:ELCData;onNaviguer:(section:Section,jeu?:string)=>void;jeu:string;etat:EtatDonnees;onReessayer:()=>void}) => <PageCalendrier data={data} onNaviguer={onNaviguer} onOpenRegulations={()=>onNaviguer('apropos')} />;
