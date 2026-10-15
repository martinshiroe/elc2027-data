import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialELCData } from '../src/data/initialData';
import { SiteCustomizationProvider } from '../src/lib/siteCustomization';
import { PageAccueil } from '../src/components/PageAccueil';
import { PageAPropos } from '../src/components/PageAPropos';
import { PageCalendrier } from '../src/components/PageCalendrier';
import { PageClassements } from '../src/components/PageClassements';
import { PageContact } from '../src/components/PageContact';
import { PageHallOfFame } from '../src/components/PageHallOfFame';
import { PageInscription } from '../src/components/PageInscription';
import { PageJoueurs } from '../src/components/PageJoueurs';
import { PageSaison } from '../src/components/PageSaison';
import { PageVideos } from '../src/components/PageVideos';
import { Footer } from '../src/components/Footer';
import { Header } from '../src/components/Header';
import { PageLibre } from '../src/components/PageLibre';
import { slugPage, validerPages } from '../src/components/AdminPersonnalisation';
import { sectionDepuisChemin } from '../src/lib/routes';
import type { ELCData, ELCPageLibre } from '../src/types';
import { urlImage, lienPartagePhoto } from '../src/lib/images';
import { urlSure, urlCss } from '../src/lib/urls';
import { CarteActualite } from '../src/components/CarteActualite';
import { CarteFaitMarquant } from '../src/components/CarteFaitMarquant';
import { BlocInscription, miniatureDe } from '../src/components/Blocs';
import { AdminImageInput } from '../src/components/AdminImageInput';
import { OngletActualites, OngletPages } from '../src/components/AdminContenu';
import { contenuDe } from '../src/data/contenu';

test('Le portrait survit à la fusion des contenus et reste visible dans le formulaire et les deux pages',()=>{
  for (const photo of ['https://example.com/portrait.jpg', importedImage]) {
    const data=structuredClone(initialELCData);
    data.contenu={...data.contenu,faitMarquant:{...contenuDe(data).faitMarquant,photo,publie:true}};
    assert.equal(contenuDe(data).faitMarquant.photo,photo);
    const editor=render(<OngletPages formData={data} setFormData={noop}/>);
    assert.ok(editor.includes(`src="${photo}"`),'Aperçu du formulaire');
    const saved=JSON.parse(JSON.stringify(data));
    for (const node of [<PageAPropos data={saved} onNaviguer={noop}/>,<PageHallOfFame data={saved} etat="pret" onReessayer={noop} onNaviguer={noop}/>]) {
      assert.ok(render(node).includes(`src="${photo}"`),'Portrait public');
    }
    const updated={...data,contenu:{...data.contenu,faitMarquant:{...contenuDe(data).faitMarquant,description:'Texte modifié'}}};
    assert.equal(contenuDe(updated).faitMarquant.photo,photo,'Une autre modification conserve la photo');
    updated.contenu.faitMarquant.photo=undefined;
    assert.equal(contenuDe(updated).faitMarquant.photo,undefined,'La suppression reste possible');
  }
});

const importedImage='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aV1sAAAAASUVORK5CYII=';

test('Les partenaires conservent leurs logos et liens, y compris la FECASES',()=>{
  const data=structuredClone(initialELCData);
  data.contenu={...data.contenu,apropos:{...data.contenu?.apropos,partenaires:[
    {titre:'FECASES',texte:'Affiliation',logo:importedImage,url:'https://example.com/fecases'},
    {titre:'Partenaire local',texte:'Soutien',logo:'https://example.com/logo.png',url:'https://example.com/partenaire'},
    {titre:'Sans lien',texte:'Présentation',logo:importedImage},
    {titre:'Lien refusé',texte:'Présentation',logo:importedImage,url:'javascript:alert(1)'}
  ]}};
  const saved=JSON.parse(JSON.stringify(data));
  assert.equal(contenuDe(saved).apropos.partenaires[0].logo,importedImage);
  const html=render(<PageAPropos data={saved} onNaviguer={noop}/>);
  assert.match(html,/aria-label="Visiter FECASES \(nouvel onglet\)"/);
  assert.match(html,/href="https:\/\/example.com\/fecases"/);
  assert.match(html,/href="https:\/\/example.com\/partenaire"/);
  assert.match(html,/rel="noopener noreferrer"/);
  assert.ok(!html.includes('javascript:'));
  assert.ok(html.includes(`src="${importedImage}"`));
  const admin=render(<OngletPages formData={saved} setFormData={noop}/>);
  assert.match(admin,/Logo du partenaire/);assert.match(admin,/Lien vers le site ou la page/);assert.match(admin,/Ajouter un partenaire/);
});

test('Les imports raster sont acceptés uniquement comme images ; les liens de partage sont expliqués',()=>{
  assert.equal(urlImage(importedImage),importedImage);
  assert.equal(urlCss(importedImage),importedImage);
  assert.equal(urlSure(importedImage),'');
  for(const bad of ['javascript:alert(1)','data:text/html;base64,PHNjcmlwdD4=','data:image/svg+xml;base64,PHN2Zz4=','mailto:a@b.com','file:///photo.png'])assert.equal(urlImage(bad),'');
  assert.equal(urlImage('https://lh3.googleusercontent.com/photo'),'https://lh3.googleusercontent.com/photo');
  assert.equal(lienPartagePhoto('https://photos.app.goo.gl/example'),true);
  const html=render(<AdminImageInput value="https://photos.app.goo.gl/example" onChange={noop}/>);
  assert.match(html,/Téléchargez la photo/);assert.ok(!html.includes('<img'));
});

test('La couverture de l’actualité reste visible avec une vidéo et dispose de son propre champ',()=>{
  const html=render(<CarteActualite actu={{titre:'Article illustré',rubrique:'Ligue',texte:'Article',image:importedImage,video:'https://youtu.be/dQw4w9WgXcQ'}}/>);
  assert.ok(html.includes(`src="${importedImage}"`));assert.match(html,/Illustration : Article illustré/);assert.match(html,/Lire la vidéo/);
  const editor=render(<OngletActualites formData={{...initialELCData,contenu:{saison:{actualites:[{titre:'Article',rubrique:'Ligue',texte:''}]}}}} setFormData={noop}/>);
  assert.match(editor,/Image de couverture de l’article/);assert.match(editor,/Importer une image/);
});

test('Les bannières, portraits et logos importés sont raccordés aux pages publiques',()=>{
  const data=structuredClone(initialELCData);
  data.meta.heroImage=importedImage;data.meta.ctaImage=importedImage;data.meta.videosBannerImage=importedImage;data.meta.inscriptionBannerImage=importedImage;data.meta.formBannerImage=importedImage;data.meta.pantheonBannerImage=importedImage;
  for(const game of Object.values(data.competition)){game.heroImage=importedImage;game.logoImage=importedImage;}
  for(const node of [<PageAccueil data={data} onNaviguer={noop}/>,<BlocInscription data={data} onNaviguer={noop}/>,<PageVideos data={data} onNaviguer={noop}/>,<PageInscription data={data} onNaviguer={noop} onOpenRegulations={noop}/>,<PageClassements data={data} jeu="hok" etat="pret" onReessayer={noop} onNaviguer={noop}/>,<PageLibre page={{...page,image:importedImage}}/>])assert.ok(render(node).includes(`src="${importedImage}"`));
  data.pantheon.distinctions=[{key:'goat',title:'GOAT',subtitle:'Prix',desc:'Test',nomineNom:'Lauréat',nominePhoto:importedImage,nomineHero:importedImage,fondImage:importedImage,logoImage:importedImage}];
  const hall=render(<PageHallOfFame data={data} etat="pret" onReessayer={noop} onNaviguer={noop}/>);
  assert.ok(hall.split(`src="${importedImage}"`).length>=4);assert.ok(hall.includes(`url(&quot;${importedImage}&quot;)`));
  const fait={nom:'Portrait test',distinction:'MVP',description:'Test',photo:importedImage};
  assert.ok(!render(<CarteFaitMarquant fait={{...fait,publie:false}}/>).includes(importedImage));
  assert.ok(render(<CarteFaitMarquant fait={{...fait,publie:true}}/>).includes(importedImage));
  assert.equal(miniatureDe({titre:'Test',url:'https://youtu.be/dQw4w9WgXcQ',miniature:importedImage} as any),importedImage);
});

const noop=()=>{};
const page:ELCPageLibre={id:'privacy',slug:'politique-de-confidentialite',titre:'Politique de confidentialité',categorie:'Informations légales',texte:'Contenu rédigé par la ligue.',publie:true,menu:true,piedDePage:true};
const render=(node:React.ReactNode,site:ELCData['site']={})=>renderToStaticMarkup(<SiteCustomizationProvider value={site??{}}>{node}</SiteCustomizationProvider>);

test('Les états de chargement et erreur de la dernière version restent disponibles',()=>{
  for(const Component of [PageSaison,PageHallOfFame,PageClassements]){
    const C=Component as React.ComponentType<any>;
    const loading=render(<C data={initialELCData} jeu="hok" etat="chargement" onReessayer={noop} onNaviguer={noop}/>);
    const error=render(<C data={initialELCData} jeu="hok" etat="erreur" onReessayer={noop} onNaviguer={noop}/>);
    assert.match(loading,/Chargement/);
    assert.match(error,/role="alert"/);
    assert.match(error,/Réessayer/);
  }
});

test('Les dix pages publiques se rendent avec les contenus existants',()=>{
  for(const Component of [PageAccueil,PageAPropos,PageCalendrier,PageClassements,PageContact,PageHallOfFame,PageInscription,PageJoueurs,PageSaison,PageVideos]){
    const C=Component as React.ComponentType<any>;
    const html=render(<C data={initialELCData} jeu="hok" etat="pret" onReessayer={noop} onNaviguer={noop} onOpenRegulations={noop}/>);
    assert.ok(html.includes('<h1'),Component.name);
    assert.ok(!html.includes('[object Object]'),Component.name);
  }
});
test('Un texte, un logo et leur rétablissement sont raccordés au rendu public',()=>{
  const node=<><Header data={initialELCData} activeSection="accueil" onNaviguer={noop}/><PageAccueil data={initialELCData} onNaviguer={noop}/></>;
  const original=render(node);
  const custom=render(node,{textes:{'Affronte les meilleurs — sans compromis':'Bienvenue dans la ligue'},images:{'/img/logo-ligue-est.webp':'https://example.com/logo.png'}});
  assert.match(custom,/Bienvenue dans la ligue/);
  assert.match(custom,/src="https:\/\/example.com\/logo.png"/);
  assert.equal(render(node,{}),original);
});
test('Les textes du CMS sont échappés et les URLs exécutables refusées',()=>{
  const html=render(<PageAccueil data={initialELCData} onNaviguer={noop}/>,{textes:{'Affronte les meilleurs — sans compromis':'<script>alert(1)</script>'},images:{'/img/hero-joueur.webp':'javascript:alert(1)'}});
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(!html.includes('src="javascript:'));
});
test('Les pages publiées sont liées dans le pied de page, les brouillons sont absents',()=>{
  const data={...initialELCData,site:{pages:[page,{...page,id:'draft',slug:'brouillon',titre:'Texte confidentiel',publie:false}]}};
  const html=render(<Footer data={data} onNaviguer={noop} onOpenRegulations={noop}/>);
  assert.match(html,/href="\/pages\/politique-de-confidentialite"/);
  assert.ok(!html.includes('Texte confidentiel'));
  assert.equal(sectionDepuisChemin('/pages/politique-de-confidentialite'),'page');
  assert.match(render(<PageLibre page={page}/>),/Contenu rédigé par la ligue/);
});
test('Les adresses et contenus des pages sont validés avant publication',()=>{
  assert.equal(slugPage('Politique de confidentialité'),'politique-de-confidentialite');
  assert.equal(validerPages([page]),null);
  assert.ok(validerPages([page,{...page,id:'duplicate'}]));
  assert.ok(validerPages([{...page,texte:''}]));
  assert.ok(validerPages([{...page,slug:'../admin'}]));
});
test('Le Hall of Fame accepte les nouvelles distinctions et masque les désactivées',()=>{
  const data=structuredClone(initialELCData);
  data.pantheon.distinctions=[...(data.pantheon.distinctions??[]).filter(d=>d.key!=='goat'),{key:'goat',title:'G.O.A.T',subtitle:'',desc:'',visible:false},{key:'fairplay',title:'Prix du fair-play',subtitle:'Esprit sportif',desc:'Pour un comportement exemplaire.',couleur:'#ffffff',logoImage:'https://example.com/prix.png'}];
  const html=render(<PageHallOfFame data={data} etat="pret" onReessayer={noop} onNaviguer={noop}/>);
  assert.match(html,/Prix du fair-play/);assert.match(html,/prix.png/);
  assert.ok(!html.includes('id="distinction-goat"'));
});

test('API : sauvegarde complète, confidentialité des brouillons et rejet des pages invalides',async()=>{
  process.env.SUPABASE_URL='https://example.invalid';
  process.env.SUPABASE_SERVICE_KEY='test-only';
  process.env.ADMIN_KEY='test-only-admin';
  const {default:handler}=await import('../api/data');
  const originalFetch=globalThis.fetch;
  let stored:ELCData={...structuredClone(initialELCData),site:{textes:{Titre:'Nouveau titre'},images:{'/img/logo-ligue-est.webp':'https://example.com/logo.png'},pages:[page,{...page,id:'draft',slug:'brouillon',titre:'Secret brouillon',publie:false}]}};
  globalThis.fetch=async(_url,options)=>{
    if(options?.method==='POST') {stored=JSON.parse(options.body as string).data;return new Response(null,{status:201});}
    return Response.json([{data:stored}]);
  };
  const call=async(method:string,body?:unknown,auth=false)=>{
    const result={status:0,body:null as any};
    const res={status(n:number){result.status=n;return this;},json(v:unknown){result.body=v;},setHeader(){}};
    await handler({method,headers:auth?{'x-admin-key':'test-only-admin'}:{},query:{},body},res);
    return result;
  };
  try {
    const publicRead=await call('GET');assert.equal(publicRead.status,200);assert.equal(publicRead.body.site.pages.length,1);
    const adminRead=await call('GET',undefined,true);assert.equal(adminRead.body.site.pages.length,2);
    const updated={...stored,meta:{...stored.meta,heroImage:importedImage},site:{...stored.site,images:{'/img/logo-ligue-est.webp':importedImage},textes:{Titre:'Titre sauvegardé'}}};
    assert.equal((await call('POST',updated)).status,401);
    assert.equal((await call('POST',updated,true)).status,200);
    assert.equal((await call('GET')).body.site.textes.Titre,'Titre sauvegardé');
    assert.equal((await call('GET')).body.meta.heroImage,importedImage);
    assert.equal((await call('GET')).body.site.images['/img/logo-ligue-est.webp'],importedImage);
    assert.equal((await call('POST',{...stored,site:{pages:[page,page]}},true)).status,400);
    assert.equal((await call('POST',{...stored,site:{textes:{Titre:{invalide:true}}}},true)).status,400);
  } finally {globalThis.fetch=originalFetch;}
});
