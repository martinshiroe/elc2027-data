import React from 'react';
import { ELCPageLibre } from '../types';
import { Conteneur, EnTetePage } from './ui';
import { urlSure } from '../lib/urls';

export function PageLibre({page}: {page:ELCPageLibre}) {
  return <>
    <EnTetePage image={page.image ? urlSure(page.image) : undefined}><Conteneur><p className="surtitre mb-4">{page.categorie}</p><h1 className="titre text-3xl sm:text-5xl break-words">{page.titre}</h1></Conteneur></EnTetePage>
    <Conteneur className="py-12 sm:py-16"><article className="max-w-3xl whitespace-pre-wrap break-words leading-relaxed">{page.texte}</article></Conteneur>
  </>;
}
