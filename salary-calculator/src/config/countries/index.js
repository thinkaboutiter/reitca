import { bulgariaConfig } from './bulgaria.js';

export const countries = {
  BG: bulgariaConfig
};

export const getCountryConfig = (countryCode) => {
  return countries[countryCode] || countries.BG; // Default to Bulgaria
};

export const getAvailableCountries = () => {
  return Object.keys(countries).map(code => ({
    code,
    name: countries[code].name,
    currency: countries[code].currency
  }));
};