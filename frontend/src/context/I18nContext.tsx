import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Lang = 'pt' | 'en';

const dict: Record<Lang, Record<string, string>> = {
  pt: {
    welcome_title: 'Bem-vindo à Nexora',
    welcome_subtitle: 'A exclusividade começa aqui.',
    enter: 'Entrar',
    sign_in_apple: 'Entrar com Apple',
    sign_in_google: 'Entrar com Google',
    sign_in_email: 'Entrar com Email',
    signup: 'Criar conta',
    signup_title: 'Crie sua conta',
    name: 'Nome',
    city: 'Cidade',
    country: 'País',
    accept_terms: 'Aceito os termos',
    photo: 'Foto',
    add_photo: 'Adicionar foto',
    home: 'Início',
    my_collection: 'Minha Coleção',
    discover_relic: 'Descobrir Relic',
    invites: 'Convites',
    world_registry: 'Registro Mundial',
    profile: 'Perfil',
    reveal_relic: 'REVELAR RELIC',
    reveal_again: 'Descobrir outra',
    view_details: 'Ver detalhes',
    rarest_relic: 'Sua Relic mais rara',
    no_relic_yet: 'Descubra sua primeira Relic',
    serial_number: 'Número de série',
    max_qty: 'Quantidade máxima',
    discovered_qty: 'Descobertas',
    remaining_qty: 'Restantes',
    first_collector: 'Primeiro colecionador',
    current_collector: 'Colecionador atual',
    discovery_city: 'Cidade da descoberta',
    discovery_country: 'País da descoberta',
    discovery_date: 'Data',
    discovery_time: 'Hora',
    description: 'Descrição oficial',
    history: 'História',
    certificate: 'Certificado Nexora',
    certificate_body: 'Este documento atesta a autenticidade e a raridade desta peça no acervo Nexora.',
    settings: 'Configurações',
    language: 'Idioma',
    account: 'Conta',
    privacy: 'Privacidade',
    security: 'Segurança',
    terms: 'Termos',
    logout: 'Sair',
    invite_code: 'Código exclusivo',
    copy: 'Copiar',
    copied: 'Copiado',
    share: 'Compartilhar',
    influence_acquired: 'Influência adquirida',
    collector_since: 'Colecionador desde',
    influence: 'Influência',
    invites_sent: 'Convites',
    relic_count: 'Relics',
    empty_collection: 'Nenhuma Relic descoberta ainda.',
    all_relics_discovered: 'Todas as Relics foram descobertas.',
    tap_to_reveal: 'Toque para revelar',
    revealed: 'Revelada',
  },
  en: {
    welcome_title: 'Welcome to Nexora',
    welcome_subtitle: 'Exclusivity begins here.',
    enter: 'Enter',
    sign_in_apple: 'Sign in with Apple',
    sign_in_google: 'Sign in with Google',
    sign_in_email: 'Sign in with Email',
    signup: 'Create account',
    signup_title: 'Create your account',
    name: 'Name',
    city: 'City',
    country: 'Country',
    accept_terms: 'Accept terms',
    photo: 'Photo',
    add_photo: 'Add photo',
    home: 'Home',
    my_collection: 'My Collection',
    discover_relic: 'Discover Relic',
    invites: 'Invites',
    world_registry: 'World Registry',
    profile: 'Profile',
    reveal_relic: 'REVEAL RELIC',
    reveal_again: 'Discover another',
    view_details: 'View details',
    rarest_relic: 'Your rarest Relic',
    no_relic_yet: 'Discover your first Relic',
    serial_number: 'Serial number',
    max_qty: 'Maximum supply',
    discovered_qty: 'Discovered',
    remaining_qty: 'Remaining',
    first_collector: 'First collector',
    current_collector: 'Current collector',
    discovery_city: 'Discovery city',
    discovery_country: 'Discovery country',
    discovery_date: 'Date',
    discovery_time: 'Time',
    description: 'Official description',
    history: 'History',
    certificate: 'Nexora Certificate',
    certificate_body: 'This document attests to the authenticity and rarity of this piece within the Nexora archive.',
    settings: 'Settings',
    language: 'Language',
    account: 'Account',
    privacy: 'Privacy',
    security: 'Security',
    terms: 'Terms',
    logout: 'Sign out',
    invite_code: 'Exclusive code',
    copy: 'Copy',
    copied: 'Copied',
    share: 'Share',
    influence_acquired: 'Influence acquired',
    collector_since: 'Collector since',
    influence: 'Influence',
    invites_sent: 'Invites',
    relic_count: 'Relics',
    empty_collection: 'No Relics discovered yet.',
    all_relics_discovered: 'All Relics have been discovered.',
    tap_to_reveal: 'Tap to reveal',
    revealed: 'Revealed',
  },
};

type Ctx = {
  lang: Lang;
  t: (k: keyof typeof dict.pt) => string;
  setLang: (l: Lang) => void;
};

const I18nContext = createContext<Ctx>({ lang: 'pt', t: (k) => String(k), setLang: () => {} });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('pt');

  useEffect(() => {
    AsyncStorage.getItem('nexora_lang').then((v) => {
      if (v === 'pt' || v === 'en') setLangState(v);
    });
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    AsyncStorage.setItem('nexora_lang', l);
  };

  const value = useMemo<Ctx>(() => ({
    lang,
    setLang,
    t: (k) => dict[lang][k] ?? String(k),
  }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
