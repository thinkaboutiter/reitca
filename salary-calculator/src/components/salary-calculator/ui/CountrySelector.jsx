import React from 'react';
import { Globe, Check } from 'lucide-react';
import { Card } from '../shared/Card';

export const CountrySelector = ({
  selectedCountryCode,
  onCountryChange,
  countries,
  disabled = false
}) => {
  // Sort countries alphabetically by name
  const sortedCountries = [...countries].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Card className="mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Globe className="w-5 h-5" />
        Country Selection
      </h3>
      
      <div className="mb-4">
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <Globe className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Select your country for accurate tax calculations</p>
            <p>Each country has different tax rates, social security rules, and legal requirements.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {sortedCountries.map((country) => (
          <button
            key={country.code}
            onClick={() => !disabled && onCountryChange(country.code)}
            disabled={disabled}
            className={`
              flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left
              ${selectedCountryCode === country.code 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
              ${disabled 
                ? 'opacity-50 cursor-not-allowed' 
                : 'cursor-pointer'
              }
            `}
          >
            {/* Country Flag Placeholder - can be replaced with actual flag components */}
            <div className={`
              w-8 h-6 rounded border flex items-center justify-center text-xs font-bold
              ${selectedCountryCode === country.code 
                ? 'bg-blue-100 text-blue-800 border-blue-300' 
                : 'bg-gray-100 text-gray-600 border-gray-300'
              }
            `}>
              {country.code}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{country.name}</span>
                {selectedCountryCode === country.code && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <div className="text-sm text-gray-500">
                Currency: {country.currency}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Current selection summary */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Currently selected:</span>
          <span className="font-medium text-gray-900">
            {sortedCountries.find(c => c.code === selectedCountryCode)?.name || 'None selected'}
          </span>
        </div>
      </div>

      {/* Coming soon section for future countries */}
      {sortedCountries.length === 1 && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">🚧 More countries coming soon!</p>
            <p>We're working on adding support for Germany, France, and other European countries.</p>
          </div>
        </div>
      )}
    </Card>
  );
};