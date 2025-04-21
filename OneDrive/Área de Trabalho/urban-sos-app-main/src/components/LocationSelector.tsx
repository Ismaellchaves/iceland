
import React, { useState, useEffect } from 'react';
import { Building, MapPin } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// Brazilian states
const BRAZILIAN_STATES = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
];

// Major cities in Ceará
const CEARA_CITIES = [
  'Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 
  'Sobral', 'Crato', 'Itapipoca', 'Maranguape', 'Iguatu', 
  'Quixadá', 'Canindé', 'Crateús', 'Aquiraz', 'Quixeramobim', 
  'Tianguá', 'Aracati', 'Pacatuba', 'Russas', 'Limoeiro do Norte',
  'Morada Nova', 'Tauá', 'Icó', 'Horizonte', 'São Gonçalo do Amarante'
];

// Cities by state (simplified for demo)
const CITIES_BY_STATE: Record<string, string[]> = {
  CE: CEARA_CITIES,
  // Add more states as needed
};

interface LocationSelectorProps {
  initialState?: string;
  initialCity?: string;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
  disabled?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  initialState = 'CE',
  initialCity = 'Crateús',
  onStateChange,
  onCityChange,
  disabled = false
}) => {
  const [state, setState] = useState(initialState);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  
  // Update cities when state changes
  useEffect(() => {
    if (state) {
      setAvailableCities(CITIES_BY_STATE[state] || []);
    }
  }, [state]);

  const handleStateChange = (value: string) => {
    setState(value);
    onStateChange(value);
    
    // Reset city if state changes
    if (value !== state) {
      onCityChange('');
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="space-y-2 flex-1">
        <label className="text-sm font-medium text-urban-dark-700 dark:text-urban-dark-200">
          Estado
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-urban-dark-400 h-5 w-5 z-10" />
          <Select 
            disabled={disabled} 
            value={state} 
            onValueChange={handleStateChange}
          >
            <SelectTrigger className="w-full pl-10 pr-3 py-2 bg-white dark:bg-urban-dark-700 border border-urban-dark-200 dark:border-urban-dark-600 rounded-lg">
              <SelectValue placeholder="Selecione o estado" />
            </SelectTrigger>
            <SelectContent>
              {BRAZILIAN_STATES.map(state => (
                <SelectItem key={state.value} value={state.value}>
                  {state.label} ({state.value})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2 flex-1">
        <label className="text-sm font-medium text-urban-dark-700 dark:text-urban-dark-200">
          Cidade
        </label>
        <div className="relative">
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-urban-dark-400 h-5 w-5 z-10" />
          <Select 
            disabled={disabled || !state} 
            value={initialCity} 
            onValueChange={onCityChange}
          >
            <SelectTrigger className="w-full pl-10 pr-3 py-2 bg-white dark:bg-urban-dark-700 border border-urban-dark-200 dark:border-urban-dark-600 rounded-lg">
              <SelectValue placeholder="Selecione a cidade" />
            </SelectTrigger>
            <SelectContent>
              {availableCities.map(city => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
              <SelectItem value="other">Outra cidade</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
